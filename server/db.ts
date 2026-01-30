import { eq, and, desc, asc, like, or, sql, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, User,
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


// ============================================
// TEAM QUERIES
// ============================================
import { 
  teams, InsertTeam, 
  teamMembers, InsertTeamMember,
  teamActivity, InsertTeamActivity,
  revenueSplitRules, InsertRevenueSplitRule,
  payouts, InsertPayout,
  datasets, InsertDataset,
  subscriptions, InsertSubscription,
  affiliates, InsertAffiliate,
  referrals, InsertReferral,
  customProjects, InsertCustomProject,
  customProjectBids, InsertCustomProjectBid,
  listingVersions, InsertListingVersion
} from "../drizzle/schema";

export async function createTeam(data: InsertTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teams).values(data);
  return result[0].insertId;
}

export async function getTeamById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const memberRecords = await db.select().from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.status, 'active')));
  
  if (memberRecords.length === 0) return [];
  
  const teamIds = memberRecords.map(m => m.teamId);
  return db.select().from(teams).where(inArray(teams.id, teamIds));
}

export async function updateTeam(id: number, data: Partial<InsertTeam>) {
  const db = await getDb();
  if (!db) return;
  await db.update(teams).set({ ...data, updatedAt: new Date() }).where(eq(teams.id, id));
}

export async function addTeamMember(data: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(teamMembers).values(data);
  
  // Update team member count
  await db.update(teams).set({ 
    memberCount: sql`${teams.memberCount} + 1` 
  }).where(eq(teams.id, data.teamId));
  
  return result[0].insertId;
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.status, 'active')));
}

export async function updateTeamMember(id: number, data: Partial<InsertTeamMember>) {
  const db = await getDb();
  if (!db) return;
  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function removeTeamMember(teamId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(teamMembers)
    .set({ status: 'removed' })
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
  
  // Update team member count
  await db.update(teams).set({ 
    memberCount: sql`${teams.memberCount} - 1` 
  }).where(eq(teams.id, teamId));
}

export async function addTeamActivity(data: InsertTeamActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(teamActivity).values(data);
}

export async function getTeamActivity(teamId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamActivity)
    .where(eq(teamActivity.teamId, teamId))
    .orderBy(desc(teamActivity.createdAt))
    .limit(limit);
}

// ============================================
// REVENUE SPLITTING QUERIES
// ============================================
export async function createRevenueSplitRule(data: InsertRevenueSplitRule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(revenueSplitRules).values(data);
  return result[0].insertId;
}

export async function getRevenueSplitRules(listingId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(revenueSplitRules)
    .where(and(eq(revenueSplitRules.listingId, listingId), eq(revenueSplitRules.isActive, true)));
}

export async function updateRevenueSplitRule(id: number, data: Partial<InsertRevenueSplitRule>) {
  const db = await getDb();
  if (!db) return;
  await db.update(revenueSplitRules).set({ ...data, updatedAt: new Date() }).where(eq(revenueSplitRules.id, id));
}

export async function createPayout(data: InsertPayout) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(payouts).values(data);
  return result[0].insertId;
}

export async function getPayoutsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payouts)
    .where(eq(payouts.userId, userId))
    .orderBy(desc(payouts.createdAt));
}

export async function getPendingPayouts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payouts)
    .where(eq(payouts.status, 'pending'))
    .orderBy(asc(payouts.scheduledFor));
}

export async function updatePayout(id: number, data: Partial<InsertPayout>) {
  const db = await getDb();
  if (!db) return;
  await db.update(payouts).set(data).where(eq(payouts.id, id));
}

// ============================================
// DATASET QUERIES
// ============================================
export async function createDataset(data: InsertDataset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(datasets).values(data);
  return result[0].insertId;
}

export async function getDatasetByListingId(listingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(datasets).where(eq(datasets.listingId, listingId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDatasets(options: {
  dataType?: string;
  licenseType?: string;
  minQuality?: number;
  isLabeled?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  
  if (options.dataType) {
    conditions.push(eq(datasets.dataType, options.dataType as any));
  }
  if (options.licenseType) {
    conditions.push(eq(datasets.licenseType, options.licenseType as any));
  }
  if (options.minQuality !== undefined) {
    conditions.push(gte(datasets.qualityScore, options.minQuality));
  }
  if (options.isLabeled !== undefined) {
    conditions.push(eq(datasets.isLabeled, options.isLabeled));
  }
  
  const query = conditions.length > 0 
    ? db.select().from(datasets).where(and(...conditions))
    : db.select().from(datasets);
    
  return query
    .orderBy(desc(datasets.qualityScore))
    .limit(options.limit || 20)
    .offset(options.offset || 0);
}

export async function updateDataset(id: number, data: Partial<InsertDataset>) {
  const db = await getDb();
  if (!db) return;
  await db.update(datasets).set({ ...data, updatedAt: new Date() }).where(eq(datasets.id, id));
}

// ============================================
// SUBSCRIPTION QUERIES
// ============================================
export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptions).values(data);
  return result[0].insertId;
}

export async function getSubscriptionByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSubscription(id: number, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) return;
  await db.update(subscriptions).set({ ...data, updatedAt: new Date() }).where(eq(subscriptions.id, id));
}

// ============================================
// AFFILIATE QUERIES
// ============================================
export async function createAffiliate(data: InsertAffiliate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(affiliates).values(data);
  return result[0].insertId;
}

export async function getAffiliateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAffiliateByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(affiliates).where(eq(affiliates.referralCode, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAffiliate(id: number, data: Partial<InsertAffiliate>) {
  const db = await getDb();
  if (!db) return;
  await db.update(affiliates).set({ ...data, updatedAt: new Date() }).where(eq(affiliates.id, id));
}

export async function createReferral(data: InsertReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(referrals).values(data);
  return result[0].insertId;
}

export async function getReferralsByAffiliate(affiliateId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referrals)
    .where(eq(referrals.affiliateId, affiliateId))
    .orderBy(desc(referrals.createdAt));
}

// ============================================
// CUSTOM PROJECT QUERIES
// ============================================
export async function createCustomProject(data: InsertCustomProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customProjects).values(data);
  return result[0].insertId;
}

export async function getCustomProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customProjects).where(eq(customProjects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOpenCustomProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customProjects)
    .where(eq(customProjects.status, 'open'))
    .orderBy(desc(customProjects.createdAt));
}

export async function getCustomProjectsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customProjects)
    .where(eq(customProjects.requesterId, userId))
    .orderBy(desc(customProjects.createdAt));
}

export async function updateCustomProject(id: number, data: Partial<InsertCustomProject>) {
  const db = await getDb();
  if (!db) return;
  await db.update(customProjects).set({ ...data, updatedAt: new Date() }).where(eq(customProjects.id, id));
}

export async function createCustomProjectBid(data: InsertCustomProjectBid) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customProjectBids).values(data);
  return result[0].insertId;
}

export async function getBidsByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customProjectBids)
    .where(eq(customProjectBids.projectId, projectId))
    .orderBy(asc(customProjectBids.proposedPrice));
}

export async function updateCustomProjectBid(id: number, data: Partial<InsertCustomProjectBid>) {
  const db = await getDb();
  if (!db) return;
  await db.update(customProjectBids).set(data).where(eq(customProjectBids.id, id));
}

// ============================================
// VERSION CONTROL QUERIES
// ============================================
export async function createListingVersion(data: InsertListingVersion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(listingVersions).values(data);
  return result[0].insertId;
}

export async function getListingVersions(listingId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(listingVersions)
    .where(eq(listingVersions.listingId, listingId))
    .orderBy(desc(listingVersions.createdAt));
}


// ============================================
// SUBSCRIPTION QUERIES
// ============================================
export async function updateUserSubscription(userId: number, data: {
  subscriptionTier?: "free" | "pro" | "master";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getUserByStripeCustomerId(customerId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);
  return result[0] || null;
}


// ============================================
// LOCAL AUTH QUERIES (replacing Manus OAuth)
// ============================================
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role?: "user" | "admin";
}): Promise<User> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(users).values({
    email: data.email,
    name: data.name,
    passwordHash: data.passwordHash,
    role: data.role || "user",
    loginMethod: "local",
    lastSignedIn: new Date(),
  });

  const userId = result[0].insertId;
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

export async function updateUserLastSignedIn(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, userId));
}
