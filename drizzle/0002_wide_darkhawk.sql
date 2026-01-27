CREATE TABLE `affiliates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`referralCode` varchar(32) NOT NULL,
	`commissionRate` decimal(5,2) NOT NULL DEFAULT '10.00',
	`totalReferrals` int DEFAULT 0,
	`totalEarnings` decimal(12,2) DEFAULT '0.00',
	`pendingEarnings` decimal(12,2) DEFAULT '0.00',
	`status` enum('active','suspended','pending') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliates_id` PRIMARY KEY(`id`),
	CONSTRAINT `affiliates_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `approvalWorkflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`listingId` int NOT NULL,
	`requestedBy` int NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`approvers` json,
	`comments` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `approvalWorkflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customProjectBids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`developerId` int NOT NULL,
	`proposedPrice` decimal(10,2) NOT NULL,
	`proposedTimeline` varchar(128),
	`proposal` text NOT NULL,
	`status` enum('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customProjectBids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requesterId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`category` enum('function','template','application','dataset','ai_model') NOT NULL,
	`requirements` json,
	`budgetMin` decimal(10,2),
	`budgetMax` decimal(10,2),
	`status` enum('open','in_progress','completed','canceled') NOT NULL DEFAULT 'open',
	`assignedTo` int,
	`deliverableListingId` int,
	`deadline` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasetVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetId` int NOT NULL,
	`version` varchar(32) NOT NULL,
	`changeLog` text,
	`rowCountDelta` int DEFAULT 0,
	`fileUrl` text,
	`fileKey` varchar(512),
	`fileSize` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `datasetVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`dataType` enum('images','audio','text','time_series','tabular') NOT NULL,
	`qualityScore` int DEFAULT 0,
	`completenessScore` int DEFAULT 0,
	`accuracyScore` int DEFAULT 0,
	`diversityScore` int DEFAULT 0,
	`rowCount` int DEFAULT 0,
	`columnCount` int DEFAULT 0,
	`fileSize` int DEFAULT 0,
	`fileFormat` varchar(32),
	`schema` json,
	`licenseType` enum('commercial','academic','personal','open_source') NOT NULL DEFAULT 'personal',
	`licenseDetails` text,
	`previewData` json,
	`isLabeled` boolean DEFAULT false,
	`labelCategories` json,
	`labelCount` int DEFAULT 0,
	`providerId` int NOT NULL,
	`isVerifiedProvider` boolean DEFAULT false,
	`currentVersion` varchar(32) DEFAULT '1.0.0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listingVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`version` varchar(32) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`fileUrl` text,
	`fileKey` varchar(512),
	`changeLog` text,
	`changedBy` int NOT NULL,
	`changeType` enum('create','update','price_change','file_update','publish','unpublish') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `listingVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`teamId` int,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`stripePayoutId` varchar(128),
	`stripeTransferId` varchar(128),
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`failureReason` text,
	`scheduledFor` timestamp,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`affiliateId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`purchaseId` int,
	`purchaseAmount` decimal(10,2),
	`commissionAmount` decimal(10,2),
	`status` enum('pending','qualified','paid') NOT NULL DEFAULT 'pending',
	`qualifiedAt` timestamp,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revenueSplitRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`teamId` int,
	`splits` json NOT NULL,
	`sourceType` enum('all','direct_sale','subscription','affiliate') NOT NULL DEFAULT 'all',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `revenueSplitRules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('free','pro','master') NOT NULL DEFAULT 'free',
	`stripeSubscriptionId` varchar(128),
	`stripeCustomerId` varchar(128),
	`stripePriceId` varchar(128),
	`status` enum('active','canceled','past_due','trialing') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`canceledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamActivity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`userId` int NOT NULL,
	`actionType` enum('member_joined','member_left','member_role_changed','listing_created','listing_updated','listing_published','project_created','project_updated','revenue_split_changed','settings_updated') NOT NULL,
	`targetType` varchar(64),
	`targetId` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teamActivity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','admin','editor','viewer') NOT NULL DEFAULT 'viewer',
	`revenueSplit` decimal(5,2) DEFAULT '0.00',
	`status` enum('active','invited','removed') NOT NULL DEFAULT 'active',
	`invitedBy` int,
	`joinedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text,
	`avatarUrl` text,
	`ownerId` int NOT NULL,
	`settings` json,
	`memberCount` int DEFAULT 1,
	`projectCount` int DEFAULT 0,
	`totalRevenue` decimal(12,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`),
	CONSTRAINT `teams_slug_unique` UNIQUE(`slug`)
);
