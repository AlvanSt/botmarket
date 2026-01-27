import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { PLATFORM_FEE_PERCENT, calculateSellerEarnings } from "./products";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export interface CreateCheckoutParams {
  userId: number;
  userEmail: string;
  userName: string;
  listingId: number;
  listingTitle: string;
  listingPrice: number;
  sellerId: number;
  purchaseId: number;
  origin: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const {
    userId,
    userEmail,
    userName,
    listingId,
    listingTitle,
    listingPrice,
    sellerId,
    purchaseId,
    origin,
  } = params;

  // Calculate amounts
  const unitAmount = Math.round(listingPrice * 100); // Convert to cents
  
  if (unitAmount < 50) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Minimum purchase amount is $0.50",
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: listingTitle,
            description: `Purchase of ${listingTitle} from BotMarket`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail,
      customer_name: userName,
      listing_id: listingId.toString(),
      seller_id: sellerId.toString(),
      purchase_id: purchaseId.toString(),
      platform_fee_percent: PLATFORM_FEE_PERCENT.toString(),
    },
    allow_promotion_codes: true,
    success_url: `${origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}&purchase_id=${purchaseId}`,
    cancel_url: `${origin}/listing/${listingId}?canceled=true`,
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

export async function createStripeCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
  });
  return customer;
}

export async function getOrCreateCustomer(email: string, name?: string, existingCustomerId?: string) {
  if (existingCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(existingCustomerId);
      if (!customer.deleted) {
        return customer;
      }
    } catch (e) {
      // Customer not found, create new one
    }
  }
  
  // Search for existing customer by email
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length > 0) {
    return customers.data[0];
  }
  
  // Create new customer
  return createStripeCustomer(email, name);
}
