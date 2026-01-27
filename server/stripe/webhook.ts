import { Request, Response } from "express";
import Stripe from "stripe";
import * as db from "../db";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  // Always return 200 with valid JSON
  try {
    if (!sig) {
      console.log("[Webhook] Missing Stripe signature");
      return res.status(200).json({ verified: false, error: "Missing signature" });
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      console.log("[Webhook] Missing webhook secret");
      return res.status(200).json({ verified: false, error: "Webhook secret not configured" });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.log(`[Webhook] Signature verification failed: ${err.message}`);
      return res.status(200).json({ verified: false, error: "Signature verification failed" });
    }

    console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

    // Handle test events - return verification response
    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.status(200).json({ verified: true });
    }

    // Process the event asynchronously
    processWebhookEvent(event).catch((err) => {
      console.error(`[Webhook] Error processing event ${event.id}:`, err);
    });

    // Return success immediately
    return res.status(200).json({ verified: true, received: true, eventId: event.id });
  } catch (err: any) {
    console.error("[Webhook] Unexpected error:", err);
    // Always return 200 with JSON
    return res.status(200).json({ verified: false, error: "Internal error" });
  }
}

async function processWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Webhook] Checkout completed: ${session.id}`);
      
      // Check if this is a subscription checkout
      if (session.mode === "subscription") {
        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id as "pro" | "master" | undefined;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        if (userId && planId) {
          console.log(`[Webhook] Updating user ${userId} subscription to ${planId}`);
          await db.updateUserSubscription(parseInt(userId), {
            subscriptionTier: planId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
          });
        }
      } else {
        // Regular purchase checkout
        const purchaseId = session.metadata?.purchase_id;
        if (purchaseId) {
          console.log(`[Webhook] Updating purchase ${purchaseId} to completed`);
          await db.updatePurchase(parseInt(purchaseId), {
            status: "completed",
          });
        }
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      console.log(`[Webhook] Subscription ${event.type}: ${subscription.id}`);
      
      const customerId = subscription.customer as string;
      const user = await db.getUserByStripeCustomerId(customerId);
      
      if (user) {
        const planId = subscription.metadata?.plan_id as "pro" | "master" | undefined;
        await db.updateUserSubscription(user.id, {
          subscriptionTier: planId || user.subscriptionTier as "free" | "pro" | "master",
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`[Webhook] Subscription canceled: ${subscription.id}`);
      
      const customerId = subscription.customer as string;
      const user = await db.getUserByStripeCustomerId(customerId);
      
      if (user) {
        await db.updateUserSubscription(user.id, {
          subscriptionTier: "free",
          subscriptionStatus: "canceled",
          cancelAtPeriodEnd: false,
        });
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Payment succeeded: ${paymentIntent.id}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Webhook] Payment failed: ${paymentIntent.id}`);
      break;
    }

    case "customer.created": {
      const customer = event.data.object as Stripe.Customer;
      console.log(`[Webhook] Customer created: ${customer.id}`);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as any;
      console.log(`[Webhook] Invoice paid: ${invoice.id}`);
      
      // Update subscription status on successful payment
      if (invoice.subscription) {
        const customerId = invoice.customer as string;
        const user = await db.getUserByStripeCustomerId(customerId);
        if (user) {
          await db.updateUserSubscription(user.id, {
            subscriptionStatus: "active",
          });
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
      
      // Mark subscription as past_due
      if (invoice.subscription) {
        const customerId = invoice.customer as string;
        const user = await db.getUserByStripeCustomerId(customerId);
        if (user) {
          await db.updateUserSubscription(user.id, {
            subscriptionStatus: "past_due",
          });
        }
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }
}
