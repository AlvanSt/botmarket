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
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "master"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  subscriptionStatus: varchar("subscriptionStatus", { length: 32 }),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false),
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
  // Demo video
  demoVideoUrl: text("demoVideoUrl"),
  demoVideoKey: varchar("demoVideoKey", { length: 512 }),
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


// ============================================
// TEAMS & COLLABORATION
// ============================================
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  avatarUrl: text("avatarUrl"),
  ownerId: int("ownerId").notNull(),
  // Settings
  settings: json("settings").$type<{
    requireApproval?: boolean;
    allowPublicJoin?: boolean;
    defaultRole?: string;
  }>(),
  // Stats
  memberCount: int("memberCount").default(1),
  projectCount: int("projectCount").default(0),
  totalRevenue: decimal("totalRevenue", { precision: 12, scale: 2 }).default("0.00"),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

export const teamMembers = mysqlTable("teamMembers", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "editor", "viewer"]).default("viewer").notNull(),
  // Revenue split percentage for this member
  revenueSplit: decimal("revenueSplit", { precision: 5, scale: 2 }).default("0.00"),
  // Status
  status: mysqlEnum("status", ["active", "invited", "removed"]).default("active").notNull(),
  invitedBy: int("invitedBy"),
  joinedAt: timestamp("joinedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

export const teamActivity = mysqlTable("teamActivity", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  actionType: mysqlEnum("actionType", [
    "member_joined", "member_left", "member_role_changed",
    "listing_created", "listing_updated", "listing_published",
    "project_created", "project_updated",
    "revenue_split_changed", "settings_updated"
  ]).notNull(),
  targetType: varchar("targetType", { length: 64 }),
  targetId: int("targetId"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamActivity = typeof teamActivity.$inferSelect;
export type InsertTeamActivity = typeof teamActivity.$inferInsert;

// ============================================
// APPROVAL WORKFLOWS
// ============================================
export const approvalWorkflows = mysqlTable("approvalWorkflows", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  listingId: int("listingId").notNull(),
  requestedBy: int("requestedBy").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  // Approval chain
  approvers: json("approvers").$type<{
    userId: number;
    status: "pending" | "approved" | "rejected";
    comment?: string;
    decidedAt?: string;
  }[]>(),
  // Comments
  comments: json("comments").$type<{
    userId: number;
    content: string;
    createdAt: string;
  }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApprovalWorkflow = typeof approvalWorkflows.$inferSelect;
export type InsertApprovalWorkflow = typeof approvalWorkflows.$inferInsert;

// ============================================
// REVENUE SPLITTING
// ============================================
export const revenueSplitRules = mysqlTable("revenueSplitRules", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  teamId: int("teamId"),
  // Split configuration
  splits: json("splits").$type<{
    userId: number;
    percentage: number;
    role: string;
  }[]>().notNull(),
  // Revenue source specific rules
  sourceType: mysqlEnum("sourceType", ["all", "direct_sale", "subscription", "affiliate"]).default("all").notNull(),
  // Status
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RevenueSplitRule = typeof revenueSplitRules.$inferSelect;
export type InsertRevenueSplitRule = typeof revenueSplitRules.$inferInsert;

export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teamId: int("teamId"),
  // Amount
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  // Stripe
  stripePayoutId: varchar("stripePayoutId", { length: 128 }),
  stripeTransferId: varchar("stripeTransferId", { length: 128 }),
  // Status
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  failureReason: text("failureReason"),
  // Schedule
  scheduledFor: timestamp("scheduledFor"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;

// ============================================
// VERSION CONTROL
// ============================================
export const listingVersions = mysqlTable("listingVersions", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  // Snapshot of listing data
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 512 }),
  // Change info
  changeLog: text("changeLog"),
  changedBy: int("changedBy").notNull(),
  changeType: mysqlEnum("changeType", ["create", "update", "price_change", "file_update", "publish", "unpublish"]).notNull(),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ListingVersion = typeof listingVersions.$inferSelect;
export type InsertListingVersion = typeof listingVersions.$inferInsert;

// ============================================
// DATA MARKETPLACE (Enhanced Datasets)
// ============================================
export const datasets = mysqlTable("datasets", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  // Data type
  dataType: mysqlEnum("dataType", ["images", "audio", "text", "time_series", "tabular"]).notNull(),
  // Quality metrics (0-100)
  qualityScore: int("qualityScore").default(0),
  completenessScore: int("completenessScore").default(0),
  accuracyScore: int("accuracyScore").default(0),
  diversityScore: int("diversityScore").default(0),
  // Dataset info
  rowCount: int("rowCount").default(0),
  columnCount: int("columnCount").default(0),
  fileSize: int("fileSize").default(0), // in bytes
  fileFormat: varchar("fileFormat", { length: 32 }),
  // Schema/structure
  schema: json("schema").$type<{
    columns?: { name: string; type: string; description?: string }[];
    labels?: string[];
    sampleCount?: number;
  }>(),
  // Licensing
  licenseType: mysqlEnum("licenseType", ["commercial", "academic", "personal", "open_source"]).default("personal").notNull(),
  licenseDetails: text("licenseDetails"),
  // Preview
  previewData: json("previewData").$type<{
    rows?: Record<string, unknown>[];
    sampleImages?: string[];
    sampleText?: string[];
  }>(),
  // Pre-labeled info
  isLabeled: boolean("isLabeled").default(false),
  labelCategories: json("labelCategories").$type<string[]>(),
  labelCount: int("labelCount").default(0),
  // Provider info
  providerId: int("providerId").notNull(),
  isVerifiedProvider: boolean("isVerifiedProvider").default(false),
  // Versioning
  currentVersion: varchar("currentVersion", { length: 32 }).default("1.0.0"),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = typeof datasets.$inferInsert;

export const datasetVersions = mysqlTable("datasetVersions", {
  id: int("id").autoincrement().primaryKey(),
  datasetId: int("datasetId").notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  // Changes
  changeLog: text("changeLog"),
  rowCountDelta: int("rowCountDelta").default(0),
  // Files
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 512 }),
  fileSize: int("fileSize").default(0),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DatasetVersion = typeof datasetVersions.$inferSelect;
export type InsertDatasetVersion = typeof datasetVersions.$inferInsert;

// ============================================
// SUBSCRIPTIONS
// ============================================
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Plan info
  plan: mysqlEnum("plan", ["free", "pro", "master"]).default("free").notNull(),
  // Stripe
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripePriceId: varchar("stripePriceId", { length: 128 }),
  // Status
  status: mysqlEnum("status", ["active", "canceled", "past_due", "trialing"]).default("active").notNull(),
  // Dates
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// ============================================
// AFFILIATES & REFERRALS
// ============================================
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Referral code
  referralCode: varchar("referralCode", { length: 32 }).notNull().unique(),
  // Commission rates
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).default("10.00").notNull(),
  // Stats
  totalReferrals: int("totalReferrals").default(0),
  totalEarnings: decimal("totalEarnings", { precision: 12, scale: 2 }).default("0.00"),
  pendingEarnings: decimal("pendingEarnings", { precision: 12, scale: 2 }).default("0.00"),
  // Status
  status: mysqlEnum("status", ["active", "suspended", "pending"]).default("pending").notNull(),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  referredUserId: int("referredUserId").notNull(),
  // Purchase tracking
  purchaseId: int("purchaseId"),
  purchaseAmount: decimal("purchaseAmount", { precision: 10, scale: 2 }),
  commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }),
  // Status
  status: mysqlEnum("status", ["pending", "qualified", "paid"]).default("pending").notNull(),
  // Timestamps
  qualifiedAt: timestamp("qualifiedAt"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// ============================================
// CUSTOM PROJECT REQUESTS
// ============================================
export const customProjects = mysqlTable("customProjects", {
  id: int("id").autoincrement().primaryKey(),
  requesterId: int("requesterId").notNull(),
  // Project details
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["function", "template", "application", "dataset", "ai_model"]).notNull(),
  requirements: json("requirements").$type<{
    features?: string[];
    techStack?: string[];
    timeline?: string;
    budget?: { min: number; max: number };
  }>(),
  // Budget
  budgetMin: decimal("budgetMin", { precision: 10, scale: 2 }),
  budgetMax: decimal("budgetMax", { precision: 10, scale: 2 }),
  // Status
  status: mysqlEnum("status", ["open", "in_progress", "completed", "canceled"]).default("open").notNull(),
  // Assigned developer
  assignedTo: int("assignedTo"),
  // Deliverables
  deliverableListingId: int("deliverableListingId"),
  // Timestamps
  deadline: timestamp("deadline"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomProject = typeof customProjects.$inferSelect;
export type InsertCustomProject = typeof customProjects.$inferInsert;

export const customProjectBids = mysqlTable("customProjectBids", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  developerId: int("developerId").notNull(),
  // Bid details
  proposedPrice: decimal("proposedPrice", { precision: 10, scale: 2 }).notNull(),
  proposedTimeline: varchar("proposedTimeline", { length: 128 }),
  proposal: text("proposal").notNull(),
  // Status
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "withdrawn"]).default("pending").notNull(),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomProjectBid = typeof customProjectBids.$inferSelect;
export type InsertCustomProjectBid = typeof customProjectBids.$inferInsert;
