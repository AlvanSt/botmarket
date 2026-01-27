CREATE TABLE `adminActions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`actionType` enum('approve_listing','reject_listing','suspend_user','process_refund','other') NOT NULL,
	`targetType` enum('listing','user','purchase','review') NOT NULL,
	`targetId` int NOT NULL,
	`reason` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminActions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`modelType` enum('image_classification','object_detection','tabular','time_series') NOT NULL DEFAULT 'image_classification',
	`datasetUrl` text,
	`datasetKey` varchar(512),
	`datasetSize` int DEFAULT 0,
	`classLabels` json,
	`trainingConfig` json,
	`trainingStatus` enum('idle','preparing','training','completed','failed') NOT NULL DEFAULT 'idle',
	`trainingProgress` int DEFAULT 0,
	`trainingLogs` json,
	`finalAccuracy` decimal(5,4),
	`finalLoss` decimal(8,6),
	`modelUrl` text,
	`modelKey` varchar(512),
	`modelFormat` varchar(32),
	`isPublished` boolean DEFAULT false,
	`publishedListingId` int,
	`trainingStartedAt` timestamp,
	`trainingCompletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text,
	`shortDescription` varchar(512),
	`category` enum('function','template','application','dataset') NOT NULL DEFAULT 'function',
	`tags` json,
	`price` decimal(10,2) NOT NULL DEFAULT '0.00',
	`isFree` boolean DEFAULT false,
	`fileUrl` text,
	`fileKey` varchar(512),
	`previewImages` json,
	`language` varchar(64),
	`framework` varchar(64),
	`version` varchar(32),
	`dependencies` json,
	`status` enum('draft','pending','approved','rejected','archived') NOT NULL DEFAULT 'draft',
	`rejectionReason` text,
	`viewCount` int DEFAULT 0,
	`downloadCount` int DEFAULT 0,
	`purchaseCount` int DEFAULT 0,
	`avgRating` decimal(3,2) DEFAULT '0.00',
	`avgAccuracy` decimal(3,2) DEFAULT '0.00',
	`avgUsability` decimal(3,2) DEFAULT '0.00',
	`avgDocumentation` decimal(3,2) DEFAULT '0.00',
	`avgSupport` decimal(3,2) DEFAULT '0.00',
	`reviewCount` int DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`),
	CONSTRAINT `listings_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`listingId` int NOT NULL,
	`sellerId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`platformFee` decimal(10,2) NOT NULL,
	`sellerEarnings` decimal(10,2) NOT NULL,
	`stripePaymentId` varchar(128),
	`stripeTransferId` varchar(128),
	`status` enum('pending','completed','refunded','failed') NOT NULL DEFAULT 'pending',
	`refundReason` text,
	`refundedAt` timestamp,
	`downloadCount` int DEFAULT 0,
	`lastDownloadAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refundRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseId` int NOT NULL,
	`userId` int NOT NULL,
	`reason` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`processedBy` int,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refundRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`userId` int NOT NULL,
	`purchaseId` int NOT NULL,
	`ratingAccuracy` int NOT NULL,
	`ratingUsability` int NOT NULL,
	`ratingDocumentation` int NOT NULL,
	`ratingSupport` int NOT NULL,
	`overallRating` decimal(3,2) NOT NULL,
	`title` varchar(256),
	`content` text,
	`helpfulCount` int DEFAULT 0,
	`isVerified` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `website` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeAccountId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeOnboarded` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','creator','team','enterprise') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalEarnings` decimal(12,2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `users` ADD `totalSales` int DEFAULT 0;