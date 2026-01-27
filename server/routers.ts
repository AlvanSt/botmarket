import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { storagePut, storageGet } from "./storage";
import { nanoid } from "nanoid";
import { createCheckoutSession, getCheckoutSession } from "./stripe/checkout";
import { calculateSellerEarnings } from "./stripe/products";

// Admin procedure - requires admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  // ============================================
  // AUTH ROUTER
  // ============================================
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // USER ROUTER
  // ============================================
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(500).optional(),
        website: z.string().url().optional().or(z.literal('')),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const user = await db.getUserById(input.id);
        if (!user) return null;
        // Return public profile only
        return {
          id: user.id,
          name: user.name,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          website: user.website,
          totalSales: user.totalSales,
          createdAt: user.createdAt,
        };
      }),
    
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return db.getSellerStats(ctx.user.id);
    }),
  }),

  // ============================================
  // LISTINGS ROUTER
  // ============================================
  listings: router({
    browse: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z.enum(['newest', 'popular', 'rating', 'price_low', 'price_high']).optional(),
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
      }))
      .query(async ({ input }) => {
        return db.getApprovedListings(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const listing = await db.getListingBySlug(input.slug);
        if (!listing || listing.status !== 'approved') return null;
        // Increment view count
        await db.incrementListingView(listing.id);
        return listing;
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getListingById(input.id);
      }),
    
    getMine: protectedProcedure.query(async ({ ctx }) => {
      return db.getListingsBySeller(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(3).max(256),
        description: z.string().min(10),
        shortDescription: z.string().max(512).optional(),
        category: z.enum(['function', 'template', 'application', 'dataset']),
        tags: z.array(z.string()).optional(),
        price: z.number().min(0),
        isFree: z.boolean().optional(),
        language: z.string().optional(),
        framework: z.string().optional(),
        version: z.string().optional(),
        dependencies: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`;
        const id = await db.createListing({
          ...input,
          sellerId: ctx.user.id,
          slug,
          price: input.price.toString(),
          status: 'draft',
        });
        return { id, slug };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(3).max(256).optional(),
        description: z.string().min(10).optional(),
        shortDescription: z.string().max(512).optional(),
        tags: z.array(z.string()).optional(),
        price: z.number().min(0).optional(),
        isFree: z.boolean().optional(),
        language: z.string().optional(),
        framework: z.string().optional(),
        version: z.string().optional(),
        dependencies: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.id);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.sellerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { id, ...updateData } = input;
        const finalData: any = { ...updateData };
        if (updateData.price !== undefined) {
          finalData.price = updateData.price.toString();
        }
        await db.updateListing(id, finalData);
        return { success: true };
      }),
    
    uploadFile: protectedProcedure
      .input(z.object({
        listingId: z.number(),
        fileName: z.string(),
        fileContent: z.string(), // base64 encoded
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.sellerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        const buffer = Buffer.from(input.fileContent, 'base64');
        const fileKey = `listings/${listing.id}/${nanoid()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        await db.updateListing(input.listingId, { fileUrl: url, fileKey });
        return { url, fileKey };
      }),
    
    submitForReview: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.id);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.sellerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        if (!listing.fileUrl) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please upload a file before submitting' });
        }
        await db.updateListing(input.id, { status: 'pending' });
        return { success: true };
      }),
    
    // Check if user has purchased a listing
    checkPurchase: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ ctx, input }) => {
        const purchase = await db.getUserPurchaseForListing(ctx.user.id, input.listingId);
        return { hasPurchased: !!purchase, purchase };
      }),
    
    // Get download URL for purchased listing
    getDownloadUrl: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        
        // Check if user owns the listing or has purchased it
        const isOwner = listing.sellerId === ctx.user.id;
        const purchase = await db.getUserPurchaseForListing(ctx.user.id, input.listingId);
        
        if (!isOwner && !purchase && !listing.isFree) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You must purchase this item first' });
        }
        
        if (!listing.fileKey) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No file available' });
        }
        
        const { url } = await storageGet(listing.fileKey);
        
        // Update download count
        await db.updateListing(input.listingId, { 
          downloadCount: (listing.downloadCount || 0) + 1 
        });
        
        if (purchase) {
          await db.updatePurchase(purchase.id, {
            downloadCount: (purchase.downloadCount || 0) + 1,
            lastDownloadAt: new Date(),
          });
        }
        
        return { url };
      }),
  }),

  // ============================================
  // PURCHASES ROUTER
  // ============================================
  purchases: router({
    getMine: protectedProcedure.query(async ({ ctx }) => {
      return db.getPurchasesByBuyer(ctx.user.id);
    }),
    
    getMySales: protectedProcedure.query(async ({ ctx }) => {
      return db.getPurchasesBySeller(ctx.user.id);
    }),
    
    // Create a purchase with Stripe checkout
    create: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.status !== 'approved') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Listing not available' });
        }
        if (listing.sellerId === ctx.user.id) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot purchase your own listing' });
        }
        
        // Check if already purchased
        const existing = await db.getUserPurchaseForListing(ctx.user.id, input.listingId);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already purchased' });
        }
        
        const amount = parseFloat(listing.price as string);
        const { platformFee, sellerEarnings } = calculateSellerEarnings(amount);
        
        // Create pending purchase record
        const purchaseId = await db.createPurchase({
          buyerId: ctx.user.id,
          listingId: input.listingId,
          sellerId: listing.sellerId,
          amount: amount.toString(),
          platformFee: platformFee.toString(),
          sellerEarnings: sellerEarnings.toString(),
          status: listing.isFree ? 'completed' : 'pending',
        });
        
        // If free, complete immediately
        if (listing.isFree) {
          await db.updateListing(input.listingId, {
            purchaseCount: (listing.purchaseCount || 0) + 1,
          });
          return { purchaseId, requiresPayment: false };
        }
        
        // Create Stripe checkout session
        const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get('host')}`;
        const checkout = await createCheckoutSession({
          userId: ctx.user.id,
          userEmail: ctx.user.email || '',
          userName: ctx.user.name || '',
          listingId: input.listingId,
          listingTitle: listing.title,
          listingPrice: amount,
          sellerId: listing.sellerId,
          purchaseId,
          origin,
        });
        
        // Update purchase with Stripe session ID
        await db.updatePurchase(purchaseId, {
          stripePaymentId: checkout.sessionId,
        });
        
        return { 
          purchaseId, 
          requiresPayment: true,
          checkoutUrl: checkout.url,
        };
      }),
    
    // Verify checkout session and complete purchase
    verifyCheckout: protectedProcedure
      .input(z.object({ 
        sessionId: z.string(),
        purchaseId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const purchase = await db.getPurchaseById(input.purchaseId);
        if (!purchase) throw new TRPCError({ code: 'NOT_FOUND' });
        if (purchase.buyerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        // Verify with Stripe
        const session = await getCheckoutSession(input.sessionId);
        
        if (session.payment_status === 'paid') {
          // Update purchase to completed
          await db.updatePurchase(input.purchaseId, {
            status: 'completed',
            stripePaymentId: session.payment_intent as string,
          });
          
          // Update listing purchase count
          const listing = await db.getListingById(purchase.listingId);
          if (listing) {
            await db.updateListing(purchase.listingId, {
              purchaseCount: (listing.purchaseCount || 0) + 1,
            });
          }
          
          return { success: true, status: 'completed' };
        }
        
        return { success: false, status: session.payment_status };
      }),
    
    // Request refund (within 30 days)
    requestRefund: protectedProcedure
      .input(z.object({
        purchaseId: z.number(),
        reason: z.string().min(10).max(1000),
      }))
      .mutation(async ({ ctx, input }) => {
        const purchase = await db.getPurchaseById(input.purchaseId);
        if (!purchase) throw new TRPCError({ code: 'NOT_FOUND' });
        if (purchase.buyerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        if (purchase.status !== 'completed') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Purchase not eligible for refund' });
        }
        
        // Check 30-day window
        const purchaseDate = new Date(purchase.createdAt);
        const daysSincePurchase = (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSincePurchase > 30) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Refund window has expired (30 days)' });
        }
        
        await db.createRefundRequest({
          purchaseId: input.purchaseId,
          userId: ctx.user.id,
          reason: input.reason,
        });
        
        return { success: true };
      }),
  }),

  // ============================================
  // REVIEWS ROUTER
  // ============================================
  reviews: router({
    getByListing: publicProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ input }) => {
        return db.getReviewsByListing(input.listingId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        listingId: z.number(),
        ratingAccuracy: z.number().min(1).max(5),
        ratingUsability: z.number().min(1).max(5),
        ratingDocumentation: z.number().min(1).max(5),
        ratingSupport: z.number().min(1).max(5),
        title: z.string().max(256).optional(),
        content: z.string().max(2000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify purchase
        const purchase = await db.getUserPurchaseForListing(ctx.user.id, input.listingId);
        if (!purchase) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You must purchase this item to review it' });
        }
        
        // Check if already reviewed
        const existing = await db.getUserReviewForListing(ctx.user.id, input.listingId);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'You have already reviewed this item' });
        }
        
        const overallRating = (input.ratingAccuracy + input.ratingUsability + input.ratingDocumentation + input.ratingSupport) / 4;
        
        const reviewId = await db.createReview({
          ...input,
          userId: ctx.user.id,
          purchaseId: purchase.id,
          overallRating: overallRating.toFixed(2),
        });
        
        return { reviewId };
      }),
    
    canReview: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ ctx, input }) => {
        const purchase = await db.getUserPurchaseForListing(ctx.user.id, input.listingId);
        const existing = await db.getUserReviewForListing(ctx.user.id, input.listingId);
        return { canReview: !!purchase && !existing };
      }),
  }),

  // ============================================
  // AI PROJECTS ROUTER
  // ============================================
  aiProjects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getAiProjectsByUser(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await db.getAiProjectById(input.id);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return project;
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(256),
        description: z.string().optional(),
        modelType: z.enum(['image_classification', 'object_detection', 'tabular', 'time_series']),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createAiProject({
          ...input,
          userId: ctx.user.id,
        });
        return { id };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(256).optional(),
        description: z.string().optional(),
        classLabels: z.array(z.string()).optional(),
        trainingConfig: z.object({
          epochs: z.number().min(1).max(100).optional(),
          batchSize: z.number().min(1).max(128).optional(),
          learningRate: z.number().min(0.0001).max(1).optional(),
          validationSplit: z.number().min(0.1).max(0.5).optional(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAiProjectById(input.id);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { id, ...updateData } = input;
        await db.updateAiProject(id, updateData);
        return { success: true };
      }),
    
    uploadDataset: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        fileName: z.string(),
        fileContent: z.string(), // base64
        contentType: z.string(),
        classLabels: z.array(z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAiProjectById(input.projectId);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        const buffer = Buffer.from(input.fileContent, 'base64');
        const fileKey = `ai-projects/${project.id}/datasets/${nanoid()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        await db.updateAiProject(input.projectId, {
          datasetUrl: url,
          datasetKey: fileKey,
          datasetSize: buffer.length,
          classLabels: input.classLabels,
        });
        
        return { url, fileKey };
      }),
    
    startTraining: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAiProjectById(input.projectId);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        if (!project.datasetUrl) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Please upload a dataset first' });
        }
        
        // Simulate training start
        await db.updateAiProject(input.projectId, {
          trainingStatus: 'preparing',
          trainingProgress: 0,
          trainingStartedAt: new Date(),
          trainingLogs: [],
        });
        
        // In production, this would trigger an actual ML training job
        // For MVP, we'll simulate the training process
        simulateTraining(input.projectId);
        
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getAiProjectById(input.id);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await db.deleteAiProject(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // ADMIN ROUTER
  // ============================================
  admin: router({
    getStats: adminProcedure.query(async () => {
      return db.getPlatformStats();
    }),
    
    getPendingListings: adminProcedure.query(async () => {
      return db.getPendingListings();
    }),
    
    approveListing: adminProcedure
      .input(z.object({ listingId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        
        await db.updateListing(input.listingId, {
          status: 'approved',
          publishedAt: new Date(),
        });
        
        await db.createAdminAction({
          adminId: ctx.user.id,
          actionType: 'approve_listing',
          targetType: 'listing',
          targetId: input.listingId,
        });
        
        return { success: true };
      }),
    
    rejectListing: adminProcedure
      .input(z.object({
        listingId: z.number(),
        reason: z.string().min(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        
        await db.updateListing(input.listingId, {
          status: 'rejected',
          rejectionReason: input.reason,
        });
        
        await db.createAdminAction({
          adminId: ctx.user.id,
          actionType: 'reject_listing',
          targetType: 'listing',
          targetId: input.listingId,
          reason: input.reason,
        });
        
        return { success: true };
      }),
    
    getUsers: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }))
      .query(async ({ input }) => {
        return db.getAllUsers(input.limit, input.offset);
      }),
    
    getPendingRefunds: adminProcedure.query(async () => {
      return db.getPendingRefundRequests();
    }),
    
    processRefund: adminProcedure
      .input(z.object({
        refundRequestId: z.number(),
        approved: z.boolean(),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateRefundRequest(input.refundRequestId, {
          status: input.approved ? 'approved' : 'rejected',
          adminNotes: input.adminNotes,
          processedBy: ctx.user.id,
          processedAt: new Date(),
        });
        
        // If approved, update purchase status
        // In production, also process Stripe refund
        
        return { success: true };
      }),
    
    getRecentActions: adminProcedure.query(async () => {
      return db.getAdminActions(50);
    }),
  }),
});

// Simulate training process (for MVP demo)
async function simulateTraining(projectId: number) {
  const epochs = 10;
  const logs: { epoch: number; loss: number; accuracy: number; valLoss: number; valAccuracy: number }[] = [];
  
  await db.updateAiProject(projectId, { trainingStatus: 'training' });
  
  for (let epoch = 1; epoch <= epochs; epoch++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second per epoch
    
    const loss = 2.5 * Math.exp(-0.3 * epoch) + Math.random() * 0.1;
    const accuracy = 0.5 + 0.45 * (1 - Math.exp(-0.4 * epoch)) + Math.random() * 0.02;
    const valLoss = loss * 1.1 + Math.random() * 0.05;
    const valAccuracy = accuracy * 0.95 + Math.random() * 0.02;
    
    logs.push({
      epoch,
      loss: parseFloat(loss.toFixed(4)),
      accuracy: parseFloat(accuracy.toFixed(4)),
      valLoss: parseFloat(valLoss.toFixed(4)),
      valAccuracy: parseFloat(valAccuracy.toFixed(4)),
    });
    
    await db.updateAiProject(projectId, {
      trainingProgress: Math.round((epoch / epochs) * 100),
      trainingLogs: logs,
    });
  }
  
  const finalAccuracy = logs[logs.length - 1].accuracy;
  const finalLoss = logs[logs.length - 1].loss;
  
  await db.updateAiProject(projectId, {
    trainingStatus: 'completed',
    trainingProgress: 100,
    finalAccuracy: finalAccuracy.toString(),
    finalLoss: finalLoss.toString(),
    trainingCompletedAt: new Date(),
  });
}

export type AppRouter = typeof appRouter;
