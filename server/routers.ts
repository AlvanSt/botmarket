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
import { createSubscriptionCheckout, cancelSubscription, createBillingPortalSession } from "./stripe/subscription";

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
  // TEAMS ROUTER
  // ============================================
  teams: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getTeamsByUser(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const team = await db.getTeamById(input.id);
        if (!team) throw new TRPCError({ code: 'NOT_FOUND' });
        // Check if user is a member
        const members = await db.getTeamMembers(input.id);
        const isMember = members.some(m => m.userId === ctx.user.id);
        if (!isMember && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return { team, members };
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(2).max(256),
        description: z.string().max(1000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`;
        const teamId = await db.createTeam({
          ...input,
          slug,
          ownerId: ctx.user.id,
        });
        
        // Add creator as owner
        await db.addTeamMember({
          teamId,
          userId: ctx.user.id,
          role: 'owner',
          revenueSplit: '100.00',
        });
        
        return { teamId, slug };
      }),
    
    inviteMember: protectedProcedure
      .input(z.object({
        teamId: z.number(),
        userId: z.number(),
        role: z.enum(['admin', 'editor', 'viewer']),
        revenueSplit: z.number().min(0).max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const team = await db.getTeamById(input.teamId);
        if (!team) throw new TRPCError({ code: 'NOT_FOUND' });
        
        // Check if user has permission to invite
        const members = await db.getTeamMembers(input.teamId);
        const currentMember = members.find(m => m.userId === ctx.user.id);
        if (!currentMember || !['owner', 'admin'].includes(currentMember.role)) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        await db.addTeamMember({
          teamId: input.teamId,
          userId: input.userId,
          role: input.role,
          revenueSplit: (input.revenueSplit || 0).toString(),
          invitedBy: ctx.user.id,
          status: 'invited',
        });
        
        await db.addTeamActivity({
          teamId: input.teamId,
          userId: ctx.user.id,
          actionType: 'member_joined',
          targetId: input.userId,
        });
        
        return { success: true };
      }),
    
    updateMemberRole: protectedProcedure
      .input(z.object({
        teamId: z.number(),
        memberId: z.number(),
        role: z.enum(['admin', 'editor', 'viewer']),
        revenueSplit: z.number().min(0).max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const team = await db.getTeamById(input.teamId);
        if (!team) throw new TRPCError({ code: 'NOT_FOUND' });
        if (team.ownerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        await db.updateTeamMember(input.memberId, {
          role: input.role,
          revenueSplit: input.revenueSplit?.toString(),
        });
        
        await db.addTeamActivity({
          teamId: input.teamId,
          userId: ctx.user.id,
          actionType: 'member_role_changed',
          targetId: input.memberId,
        });
        
        return { success: true };
      }),
    
    removeMember: protectedProcedure
      .input(z.object({
        teamId: z.number(),
        userId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const team = await db.getTeamById(input.teamId);
        if (!team) throw new TRPCError({ code: 'NOT_FOUND' });
        
        // Only owner can remove members, or member can remove themselves
        if (team.ownerId !== ctx.user.id && input.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        await db.removeTeamMember(input.teamId, input.userId);
        
        await db.addTeamActivity({
          teamId: input.teamId,
          userId: ctx.user.id,
          actionType: 'member_left',
          targetId: input.userId,
        });
        
        return { success: true };
      }),
    
    getActivity: protectedProcedure
      .input(z.object({ teamId: z.number() }))
      .query(async ({ ctx, input }) => {
        const members = await db.getTeamMembers(input.teamId);
        const isMember = members.some(m => m.userId === ctx.user.id);
        if (!isMember) throw new TRPCError({ code: 'FORBIDDEN' });
        return db.getTeamActivity(input.teamId);
      }),
  }),

  // ============================================
  // REVENUE SPLITTING ROUTER
  // ============================================
  revenue: router({
    getSplitRules: protectedProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.sellerId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        return db.getRevenueSplitRules(input.listingId);
      }),
    
    createSplitRule: protectedProcedure
      .input(z.object({
        listingId: z.number(),
        teamId: z.number().optional(),
        splits: z.array(z.object({
          userId: z.number(),
          percentage: z.number().min(0).max(100),
          role: z.string(),
        })),
        sourceType: z.enum(['all', 'direct_sale', 'subscription', 'affiliate']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.sellerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        // Validate total percentage = 100
        const total = input.splits.reduce((sum, s) => sum + s.percentage, 0);
        if (total !== 100) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Split percentages must total 100%' });
        }
        
        const ruleId = await db.createRevenueSplitRule({
          listingId: input.listingId,
          teamId: input.teamId,
          splits: input.splits,
          sourceType: input.sourceType || 'all',
        });
        
        return { ruleId };
      }),
    
    getPayouts: protectedProcedure.query(async ({ ctx }) => {
      return db.getPayoutsByUser(ctx.user.id);
    }),
  }),

  // ============================================
  // DATA MARKETPLACE ROUTER
  // ============================================
  datasets: router({
    browse: publicProcedure
      .input(z.object({
        dataType: z.string().optional(),
        licenseType: z.string().optional(),
        minQuality: z.number().optional(),
        isLabeled: z.boolean().optional(),
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
      }))
      .query(async ({ input }) => {
        return db.getDatasets(input);
      }),
    
    getByListingId: publicProcedure
      .input(z.object({ listingId: z.number() }))
      .query(async ({ input }) => {
        return db.getDatasetByListingId(input.listingId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        listingId: z.number(),
        dataType: z.enum(['images', 'audio', 'text', 'time_series', 'tabular']),
        qualityScore: z.number().min(0).max(100).optional(),
        completenessScore: z.number().min(0).max(100).optional(),
        accuracyScore: z.number().min(0).max(100).optional(),
        diversityScore: z.number().min(0).max(100).optional(),
        rowCount: z.number().optional(),
        columnCount: z.number().optional(),
        fileFormat: z.string().optional(),
        licenseType: z.enum(['commercial', 'academic', 'personal', 'open_source']),
        licenseDetails: z.string().optional(),
        isLabeled: z.boolean().optional(),
        labelCategories: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const listing = await db.getListingById(input.listingId);
        if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });
        if (listing.sellerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        const datasetId = await db.createDataset({
          ...input,
          providerId: ctx.user.id,
        });
        
        return { datasetId };
      }),
  }),

  // ============================================
  // CUSTOM PROJECTS ROUTER
  // ============================================
  customProjects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getCustomProjectsByUser(ctx.user.id);
    }),
    
    getOpen: publicProcedure.query(async () => {
      return db.getOpenCustomProjects();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await db.getCustomProjectById(input.id);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        const bids = await db.getBidsByProject(input.id);
        return { project, bids };
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(5).max(256),
        description: z.string().min(20),
        category: z.enum(['function', 'template', 'application', 'dataset', 'ai_model']),
        requirements: z.object({
          features: z.array(z.string()).optional(),
          techStack: z.array(z.string()).optional(),
          timeline: z.string().optional(),
        }).optional(),
        budgetMin: z.number().min(0).optional(),
        budgetMax: z.number().optional(),
        deadline: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check user's plan for custom project access
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
        
        // Free users cannot create custom projects
        if (user.subscriptionTier === 'free') {
          throw new TRPCError({ 
            code: 'FORBIDDEN', 
            message: 'Custom projects require Pro or Master plan' 
          });
        }
        
        // Pro users have minimum budget requirement
        if (user.subscriptionTier === 'pro' && (input.budgetMin || 0) < 500) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'Pro plan requires minimum $500 budget for custom projects' 
          });
        }
        
        const projectId = await db.createCustomProject({
          ...input,
          requesterId: ctx.user.id,
          budgetMin: input.budgetMin?.toString(),
          budgetMax: input.budgetMax?.toString(),
        });
        
        return { projectId };
      }),
    
    submitBid: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        proposedPrice: z.number().min(0),
        proposedTimeline: z.string().optional(),
        proposal: z.string().min(50),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getCustomProjectById(input.projectId);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.status !== 'open') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Project is not accepting bids' });
        }
        if (project.requesterId === ctx.user.id) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot bid on your own project' });
        }
        
        const bidId = await db.createCustomProjectBid({
          projectId: input.projectId,
          developerId: ctx.user.id,
          proposedPrice: input.proposedPrice.toString(),
          proposedTimeline: input.proposedTimeline,
          proposal: input.proposal,
        });
        
        return { bidId };
      }),
    
    acceptBid: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        bidId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await db.getCustomProjectById(input.projectId);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
        if (project.requesterId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        
        // Get the bid to find developer
        const bids = await db.getBidsByProject(input.projectId);
        const acceptedBid = bids.find(b => b.id === input.bidId);
        if (!acceptedBid) throw new TRPCError({ code: 'NOT_FOUND' });
        
        // Update bid status
        await db.updateCustomProjectBid(input.bidId, { status: 'accepted' });
        
        // Reject other bids
        for (const bid of bids) {
          if (bid.id !== input.bidId) {
            await db.updateCustomProjectBid(bid.id, { status: 'rejected' });
          }
        }
        
        // Update project
        await db.updateCustomProject(input.projectId, {
          status: 'in_progress',
          assignedTo: acceptedBid.developerId,
        });
        
        return { success: true };
      }),
  }),

  // ============================================
  // AFFILIATES ROUTER
  // ============================================
  affiliates: router({
    getMyAffiliate: protectedProcedure.query(async ({ ctx }) => {
      return db.getAffiliateByUserId(ctx.user.id);
    }),
    
    join: protectedProcedure.mutation(async ({ ctx }) => {
      const existing = await db.getAffiliateByUserId(ctx.user.id);
      if (existing) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already an affiliate' });
      }
      
      const referralCode = nanoid(8).toUpperCase();
      const affiliateId = await db.createAffiliate({
        userId: ctx.user.id,
        referralCode,
        status: 'active',
      });
      
      return { affiliateId, referralCode };
    }),
    
    getReferrals: protectedProcedure.query(async ({ ctx }) => {
      const affiliate = await db.getAffiliateByUserId(ctx.user.id);
      if (!affiliate) return [];
      return db.getReferralsByAffiliate(affiliate.id);
    }),
  }),

  // ============================================
  // SUBSCRIPTIONS ROUTER
  // ============================================
  subscriptions: router({
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
      return db.getSubscriptionByUserId(ctx.user.id);
    }),
    
    // In production, this would create a Stripe subscription checkout
    upgrade: protectedProcedure
      .input(z.object({
        plan: z.enum(['pro', 'master']),
        interval: z.enum(['monthly', 'yearly']),
      }))
      .mutation(async ({ ctx, input }) => {
        // For MVP, just return a message
        // In production, create Stripe checkout session
        return { 
          message: 'Subscription checkout coming soon',
          plan: input.plan,
          interval: input.interval,
        };
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

  // ============================================
  // SUBSCRIPTION ROUTER
  // ============================================
  subscription: router({
    // Get current subscription status
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.user;
      return {
        plan: user.subscriptionTier || 'free',
        stripeCustomerId: user.stripeCustomerId || null,
        stripeSubscriptionId: user.stripeSubscriptionId || null,
        subscriptionStatus: user.subscriptionStatus || null,
        currentPeriodEnd: user.currentPeriodEnd || null,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd || false,
      };
    }),

    // Create checkout session for subscription
    createCheckout: protectedProcedure
      .input(z.object({
        planId: z.enum(['pro', 'master']),
        isYearly: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get('host')}`;
        
        const checkout = await createSubscriptionCheckout({
          userId: ctx.user.id,
          userEmail: ctx.user.email || '',
          userName: ctx.user.name || '',
          planId: input.planId,
          isYearly: input.isYearly,
          origin,
          currentPlan: ctx.user.subscriptionTier || 'free',
        });
        
        return {
          checkoutUrl: checkout.url,
          sessionId: checkout.sessionId,
        };
      }),

    // Cancel subscription
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeSubscriptionId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active subscription' });
      }
      
      await cancelSubscription(ctx.user.stripeSubscriptionId);
      
      await db.updateUserSubscription(ctx.user.id, {
        cancelAtPeriodEnd: true,
      });
      
      return { success: true };
    }),

    // Get billing portal URL
    getBillingPortal: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeCustomerId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No billing account' });
      }
      
      const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get('host')}`;
      const session = await createBillingPortalSession(
        ctx.user.stripeCustomerId,
        `${origin}/dashboard`
      );
      
      return { url: session.url };
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
