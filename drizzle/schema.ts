import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

// ============================================
// USER & AUTH
// ============================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Seller profile fields
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  website: varchar("website", { length: 512 }),
  stripeAccountId: varchar("stripeAccountId", { length: 128 }),
  stripeOnboarded: boolean("stripeOnboarded").default(false),
  // Subscription tier
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "creator", "team", "enterprise"]).default("free").notNull(),
  // Stats
  totalEarnings: decimal("totalEarnings", { precision: 12, scale: 2 }).default("0.00"),
  totalSales: int("totalSales").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// MARKETPLACE LISTINGS
// ============================================
export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  // Basic info
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 512 }),
  // Categorization
  category: mysqlEnum("category", ["function", "template", "application", "dataset"]).default("function").notNull(),
  tags: json("tags").$type<string[]>(),
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00").notNull(),
  isFree: boolean("isFree").default(false),
  // Files
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 512 }),
  previewImages: json("previewImages").$type<string[]>(),
  // Technical details
  language: varchar("language", { length: 64 }),
  framework: varchar("framework", { length: 64 }),
  version: varchar("version", { length: 32 }),
  dependencies: json("dependencies").$type<string[]>(),
  // Status
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected", "archived"]).default("draft").notNull(),
  rejectionReason: text("rejectionReason"),
  // Stats
  viewCount: int("viewCount").default(0),
  downloadCount: int("downloadCount").default(0),
  purchaseCount: int("purchaseCount").default(0),
  // Ratings (cached averages)
  avgRating: decimal("avgRating", { precision: 3, scale: 2 }).default("0.00"),
  avgAccuracy: decimal("avgAccuracy", { precision: 3, scale: 2 }).default("0.00"),
  avgUsability: decimal("avgUsability", { precision: 3, scale: 2 }).default("0.00"),
  avgDocumentation: decimal("avgDocumentation", { precision: 3, scale: 2 }).default("0.00"),
  avgSupport: decimal("avgSupport", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: int("reviewCount").default(0),
  // Timestamps
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof listings.$inferInsert;

// ============================================
// PURCHASES & TRANSACTIONS
// ============================================
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  listingId: int("listingId").notNull(),
  sellerId: int("sellerId").notNull(),
  // Payment details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platformFee", { precision: 10, scale: 2 }).notNull(),
  sellerEarnings: decimal("sellerEarnings", { precision: 10, scale: 2 }).notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 128 }),
  stripeTransferId: varchar("stripeTransferId", { length: 128 }),
  // Status
  status: mysqlEnum("status", ["pending", "completed", "refunded", "failed"]).default("pending").notNull(),
  refundReason: text("refundReason"),
  refundedAt: timestamp("refundedAt"),
  // Download tracking
  downloadCount: int("downloadCount").default(0),
  lastDownloadAt: timestamp("lastDownloadAt"),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

// ============================================
// REVIEWS & RATINGS
// ============================================
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  userId: int("userId").notNull(),
  purchaseId: int("purchaseId").notNull(),
  // Multi-dimensional ratings (1-5)
  ratingAccuracy: int("ratingAccuracy").notNull(),
  ratingUsability: int("ratingUsability").notNull(),
  ratingDocumentation: int("ratingDocumentation").notNull(),
  ratingSupport: int("ratingSupport").notNull(),
  overallRating: decimal("overallRating", { precision: 3, scale: 2 }).notNull(),
  // Review content
  title: varchar("title", { length: 256 }),
  content: text("content"),
  // Helpfulness
  helpfulCount: int("helpfulCount").default(0),
  // Status
  isVerified: boolean("isVerified").default(true),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============================================
// AI PROJECTS (No-Code Builder)
// ============================================
export const aiProjects = mysqlTable("aiProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Basic info
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  // Model type
  modelType: mysqlEnum("modelType", ["image_classification", "object_detection", "tabular", "time_series"]).default("image_classification").notNull(),
  // Dataset info
  datasetUrl: text("datasetUrl"),
  datasetKey: varchar("datasetKey", { length: 512 }),
  datasetSize: int("datasetSize").default(0),
  classLabels: json("classLabels").$type<string[]>(),
  // Training config
  trainingConfig: json("trainingConfig").$type<{
    epochs?: number;
    batchSize?: number;
    learningRate?: number;
    validationSplit?: number;
  }>(),
  // Training results
  trainingStatus: mysqlEnum("trainingStatus", ["idle", "preparing", "training", "completed", "failed"]).default("idle").notNull(),
  trainingProgress: int("trainingProgress").default(0),
  trainingLogs: json("trainingLogs").$type<{
    epoch: number;
    loss: number;
    accuracy: number;
    valLoss?: number;
    valAccuracy?: number;
  }[]>(),
  finalAccuracy: decimal("finalAccuracy", { precision: 5, scale: 4 }),
  finalLoss: decimal("finalLoss", { precision: 8, scale: 6 }),
  // Exported model
  modelUrl: text("modelUrl"),
  modelKey: varchar("modelKey", { length: 512 }),
  modelFormat: varchar("modelFormat", { length: 32 }),
  // Publishing
  isPublished: boolean("isPublished").default(false),
  publishedListingId: int("publishedListingId"),
  // Timestamps
  trainingStartedAt: timestamp("trainingStartedAt"),
  trainingCompletedAt: timestamp("trainingCompletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiProject = typeof aiProjects.$inferSelect;
export type InsertAiProject = typeof aiProjects.$inferInsert;

// ============================================
// ADMIN ACTIONS LOG
// ============================================
export const adminActions = mysqlTable("adminActions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  actionType: mysqlEnum("actionType", ["approve_listing", "reject_listing", "suspend_user", "process_refund", "other"]).notNull(),
  targetType: mysqlEnum("targetType", ["listing", "user", "purchase", "review"]).notNull(),
  targetId: int("targetId").notNull(),
  reason: text("reason"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminAction = typeof adminActions.$inferSelect;
export type InsertAdminAction = typeof adminActions.$inferInsert;

// ============================================
// REFUND REQUESTS
// ============================================
export const refundRequests = mysqlTable("refundRequests", {
  id: int("id").autoincrement().primaryKey(),
  purchaseId: int("purchaseId").notNull(),
  userId: int("userId").notNull(),
  reason: text("reason").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  processedBy: int("processedBy"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RefundRequest = typeof refundRequests.$inferSelect;
export type InsertRefundRequest = typeof refundRequests.$inferInsert;
