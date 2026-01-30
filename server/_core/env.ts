export const ENV = {
  // Database
  databaseUrl: process.env.DATABASE_URL ?? "",
  
  // Authentication
  cookieSecret: process.env.JWT_SECRET ?? "your-secret-key-change-in-production",
  
  // Environment
  isProduction: process.env.NODE_ENV === "production",
  
  // Stripe Payment Processing
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
};
