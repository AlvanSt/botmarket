import Stripe from "stripe";
import { TRPCError } from "@trpc/server";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

// Subscription plan price IDs - these would be created in Stripe Dashboard
// For now, we'll create them dynamically for testing
export const SUBSCRIPTION_PLANS = {
  pro: {
    name: "Pro Plan",
    monthlyPrice: 1499, // $14.99 in cents
    yearlyPrice: 14390, // $143.90 in cents (20% off)
    features: [
      "15 Project Slots",
      "15% Marketplace Commission",
      "10 AI Training Sessions/month",
      "Team Collaboration (3 members)",
      "Custom Project Requests ($500+ budget)",
    ],
  },
  master: {
    name: "Master Plan",
    monthlyPrice: 4999, // $49.99 in cents
    yearlyPrice: 47990, // $479.90 in cents (20% off)
    features: [
      "30 Project Slots",
      "10% Marketplace Commission",
      "40 AI Training Sessions/month",
      "Team Collaboration (10 members)",
      "Custom Project Requests (Any budget)",
      "Priority Support",
    ],
  },
};

export interface CreateSubscriptionCheckoutParams {
  userId: number;
  userEmail: string;
  userName: string;
  planId: "pro" | "master";
  isYearly: boolean;
  origin: string;
  currentPlan?: string;
}

export async function createSubscriptionCheckout(params: CreateSubscriptionCheckoutParams) {
  const {
    userId,
    userEmail,
    userName,
    planId,
    isYearly,
    origin,
    currentPlan,
  } = params;

  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid plan selected",
    });
  }

  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const interval = isYearly ? "year" : "month";

  // Get or create customer
  let customer: Stripe.Customer;
  const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
  if (customers.data.length > 0) {
    customer = customers.data[0];
  } else {
    customer = await stripe.customers.create({
      email: userEmail,
      name: userName || undefined,
      metadata: {
        user_id: userId.toString(),
      },
    });
  }

  // Create checkout session for subscription
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Swarm ${plan.name}`,
            description: plan.features.join(", "),
          },
          unit_amount: price,
          recurring: {
            interval: interval,
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: customer.id,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      plan_id: planId,
      billing_interval: interval,
      previous_plan: currentPlan || "free",
    },
    allow_promotion_codes: true,
    success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
    cancel_url: `${origin}/pricing?canceled=true`,
    subscription_data: {
      metadata: {
        user_id: userId.toString(),
        plan_id: planId,
      },
    },
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
}

export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  return subscription;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}
