import { eq, and, desc, asc, like, or, sql, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  listings, InsertListing, Listing,
  purchases, InsertPurchase,
  reviews, InsertReview,
  aiProjects, InsertAiProject,
  adminActions, InsertAdminAction,
  refundRequests, InsertRefundRequest
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER QUERIES
// ============================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getAllUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
}

// ============================================
// LISTING QUERIES
// ============================================
export async function createListing(data: InsertListing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(listings).values(data);
  return result[0].insertId;
}

export async function getListingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getListingBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(listings).where(eq(listings.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getApprovedListings(options: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'popular' | 'rating' | 'price_low' | 'price_high';
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(listings.status, 'approved')];
  
  if (options.category && options.category !== 'all') {
    conditions.push(eq(listings.category, options.category as any));
  }
  
  if (options.search) {
    conditions.push(
      or(
        like(listings.title, `%${options.search}%`),
        like(listings.description, `%${options.search}%`)
      )!
    );
  }
  
  if (options.minPrice !== undefined) {
    conditions.push(gte(listings.price, options.minPrice.toString()));
  }
  
  if (options.maxPrice !== undefined) {
    conditions.push(lte(listings.price, options.maxPrice.toString()));
  }
  
  let orderBy;
  switch (options.sortBy) {
    case 'popular':
      orderBy = desc(listings.purchaseCount);
      break;
    case 'rating':
      orderBy = desc(listings.avgRating);
      break;
    case 'price_low':
      orderBy = asc(listings.price);
      break;
    case 'price_high':
      orderBy = desc(listings.price);
      break;
    default:
      orderBy = desc(listings.publishedAt);
  }
  
  return db.select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(options.limit || 20)
    .offset(options.offset || 0);
}

export async function getListingsBySeller(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(listings).where(eq(listings.sellerId, sellerId)).orderBy(desc(listings.createdAt));
}

export async function getPendingListings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(listings).where(eq(listings.status, 'pending')).orderBy(asc(listings.createdAt));
}

export async function updateListing(id: number, data: Partial<InsertListing>) {
  const db = await getDb();
  if (!db) return;
  await db.update(listings).set({ ...data, updatedAt: new Date() }).where(eq(listings.id, id));
}

export async function incrementListingView(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(listings).set({ viewCount: sql`${listings.viewCount} + 1` }).where(eq(listings.id, id));
}

// ============================================
// PURCHASE QUERIES
// ============================================
export async function createPurchase(data: InsertPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(purchases).values(data);
  return result[0].insertId;
}

export async function getPurchaseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(purchases).where(eq(purchases.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPurchasesByBuyer(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).where(eq(purchases.buyerId, buyerId)).orderBy(desc(purchases.createdAt));
}

export async function getPurchasesBySeller(sellerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).where(eq(purchases.sellerId, sellerId)).orderBy(desc(purchases.createdAt));
}

export async function getUserPurchaseForListing(userId: number, listingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select()
    .from(purchases)
    .where(and(
      eq(purchases.buyerId, userId),
      eq(purchases.listingId, listingId),
      eq(purchases.status, 'completed')
    ))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePurchase(id: number, data: Partial<InsertPurchase>) {
  const db = await getDb();
  if (!db) return;
  await db.update(purchases).set(data).where(eq(purchases.id, id));
}

// ============================================
// REVIEW QUERIES
// ============================================
export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviews).values(data);
  
  // Update listing average ratings
  await updateListingRatings(data.listingId);
  
  return result[0].insertId;
}

export async function getReviewsByListing(listingId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.listingId, listingId)).orderBy(desc(reviews.createdAt));
}

export async function getUserReviewForListing(userId: number, listingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.listingId, listingId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

async function updateListingRatings(listingId: number) {
  const db = await getDb();
  if (!db) return;
  
  const listingReviews = await db.select().from(reviews).where(eq(reviews.listingId, listingId));
  
  if (listingReviews.length === 0) return;
  
  const avgAccuracy = listingReviews.reduce((sum, r) => sum + r.ratingAccuracy, 0) / listingReviews.length;
  const avgUsability = listingReviews.reduce((sum, r) => sum + r.ratingUsability, 0) / listingReviews.length;
  const avgDocumentation = listingReviews.reduce((sum, r) => sum + r.ratingDocumentation, 0) / listingReviews.length;
  const avgSupport = listingReviews.reduce((sum, r) => sum + r.ratingSupport, 0) / listingReviews.length;
  const avgRating = (avgAccuracy + avgUsability + avgDocumentation + avgSupport) / 4;
  
  await db.update(listings).set({
    avgRating: avgRating.toFixed(2),
    avgAccuracy: avgAccuracy.toFixed(2),
    avgUsability: avgUsability.toFixed(2),
    avgDocumentation: avgDocumentation.toFixed(2),
    avgSupport: avgSupport.toFixed(2),
    reviewCount: listingReviews.length,
  }).where(eq(listings.id, listingId));
}

// ============================================
// AI PROJECT QUERIES
// ============================================
export async function createAiProject(data: InsertAiProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(aiProjects).values(data);
  return result[0].insertId;
}

export async function getAiProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aiProjects).where(eq(aiProjects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAiProjectsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiProjects).where(eq(aiProjects.userId, userId)).orderBy(desc(aiProjects.createdAt));
}

export async function updateAiProject(id: number, data: Partial<InsertAiProject>) {
  const db = await getDb();
  if (!db) return;
  await db.update(aiProjects).set({ ...data, updatedAt: new Date() }).where(eq(aiProjects.id, id));
}

export async function deleteAiProject(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(aiProjects).where(eq(aiProjects.id, id));
}

// ============================================
// ADMIN QUERIES
// ============================================
export async function createAdminAction(data: InsertAdminAction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(adminActions).values(data);
}

export async function getAdminActions(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(adminActions).orderBy(desc(adminActions.createdAt)).limit(limit);
}

// ============================================
// REFUND REQUEST QUERIES
// ============================================
export async function createRefundRequest(data: InsertRefundRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(refundRequests).values(data);
  return result[0].insertId;
}

export async function getPendingRefundRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(refundRequests).where(eq(refundRequests.status, 'pending')).orderBy(asc(refundRequests.createdAt));
}

export async function updateRefundRequest(id: number, data: Partial<InsertRefundRequest>) {
  const db = await getDb();
  if (!db) return;
  await db.update(refundRequests).set(data).where(eq(refundRequests.id, id));
}

// ============================================
// ANALYTICS QUERIES
// ============================================
export async function getSellerStats(sellerId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const sellerListings = await db.select().from(listings).where(eq(listings.sellerId, sellerId));
  const sellerPurchases = await db.select().from(purchases).where(
    and(eq(purchases.sellerId, sellerId), eq(purchases.status, 'completed'))
  );
  
  const totalViews = sellerListings.reduce((sum, l) => sum + (l.viewCount || 0), 0);
  const totalDownloads = sellerListings.reduce((sum, l) => sum + (l.downloadCount || 0), 0);
  const totalEarnings = sellerPurchases.reduce((sum, p) => sum + parseFloat(p.sellerEarnings as string), 0);
  const totalSales = sellerPurchases.length;
  
  return {
    totalListings: sellerListings.length,
    activeListings: sellerListings.filter(l => l.status === 'approved').length,
    pendingListings: sellerListings.filter(l => l.status === 'pending').length,
    totalViews,
    totalDownloads,
    totalEarnings,
    totalSales,
  };
}

export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return null;
  
  const allUsers = await db.select().from(users);
  const allListings = await db.select().from(listings);
  const allPurchases = await db.select().from(purchases).where(eq(purchases.status, 'completed'));
  
  const totalRevenue = allPurchases.reduce((sum, p) => sum + parseFloat(p.amount as string), 0);
  const platformFees = allPurchases.reduce((sum, p) => sum + parseFloat(p.platformFee as string), 0);
  
  return {
    totalUsers: allUsers.length,
    totalListings: allListings.length,
    approvedListings: allListings.filter(l => l.status === 'approved').length,
    pendingListings: allListings.filter(l => l.status === 'pending').length,
    totalPurchases: allPurchases.length,
    totalRevenue,
    platformFees,
  };
}
