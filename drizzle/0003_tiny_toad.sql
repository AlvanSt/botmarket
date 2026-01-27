ALTER TABLE `users` MODIFY COLUMN `subscriptionTier` enum('free','pro','master') NOT NULL DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `currentPeriodEnd` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `cancelAtPeriodEnd` boolean DEFAULT false;