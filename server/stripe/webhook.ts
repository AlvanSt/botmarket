import { Request, Response } from "express";
import Stripe from "stripe";

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
      
      // Extract metadata
      const userId = session.metadata?.user_id;
      const listingId = session.metadata?.listing_id;
      const purchaseId = session.metadata?.purchase_id;
      
      if (purchaseId) {
        // Update purchase status in database
        // This would be handled by the db module
        console.log(`[Webhook] Updating purchase ${purchaseId} to completed`);
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
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Webhook] Invoice paid: ${invoice.id}`);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }
}
