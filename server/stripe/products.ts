// Stripe Products Configuration for BotMarket
// This file defines the platform fee structure and pricing

export const PLATFORM_FEE_PERCENT = 15; // 15% platform fee

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "Browse marketplace",
      "Purchase items",
      "Basic project dashboard",
      "Community support",
    ],
  },
  creator: {
    name: "Creator",
    priceMonthly: 7.99,
    stripePriceId: process.env.STRIPE_CREATOR_PRICE_ID || null,
    features: [
      "Everything in Free",
      "Sell on marketplace",
      "88% revenue share",
      "Basic analytics",
      "Email support",
    ],
  },
  team: {
    name: "Team",
    priceMonthly: 24.99,
    stripePriceId: process.env.STRIPE_TEAM_PRICE_ID || null,
    features: [
      "Everything in Creator",
      "Team collaboration",
      "90% revenue share",
      "Advanced analytics",
      "Priority support",
      "Custom project requests",
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceMonthly: null, // Custom pricing
    features: [
      "Everything in Team",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "White-label options",
    ],
  },
};

// Calculate seller earnings after platform fee
export function calculateSellerEarnings(amount: number): {
  platformFee: number;
  sellerEarnings: number;
} {
  const platformFee = amount * (PLATFORM_FEE_PERCENT / 100);
  const sellerEarnings = amount - platformFee;
  return {
    platformFee: Math.round(platformFee * 100) / 100,
    sellerEarnings: Math.round(sellerEarnings * 100) / 100,
  };
}
