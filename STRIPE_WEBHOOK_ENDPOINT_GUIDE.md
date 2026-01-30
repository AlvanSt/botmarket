# 🔗 Stripe Webhook Endpoint URL Guide

This guide explains what a webhook endpoint URL is and how to configure it for your Swarm platform.

---

## Table of Contents

1. [What is a Webhook?](#what-is-a-webhook)
2. [What is an Endpoint URL?](#what-is-an-endpoint-url)
3. [Your Endpoint URLs](#your-endpoint-urls)
4. [How to Add Endpoint URL to Stripe](#how-to-add-endpoint-url-to-stripe)
5. [Testing Locally with Stripe CLI](#testing-locally-with-stripe-cli)
6. [Testing on Production](#testing-on-production)
7. [Troubleshooting](#troubleshooting)

---

## What is a Webhook?

A **webhook** is a way for Stripe to notify your app when something important happens.

### Example Flow

```
1. Customer pays on your website
   ↓
2. Stripe processes the payment
   ↓
3. Stripe sends a message to your webhook endpoint
   ↓
4. Your app receives the message
   ↓
5. Your app updates the database (marks order as paid)
   ↓
6. Your app sends confirmation email to customer
```

### Why Webhooks Matter

Without webhooks:
- ❌ You wouldn't know if a payment succeeded
- ❌ You couldn't deliver digital products
- ❌ Customers wouldn't get confirmations

With webhooks:
- ✅ Instant payment confirmation
- ✅ Automatic order processing
- ✅ Real-time notifications

---

## What is an Endpoint URL?

An **endpoint URL** is the address where Stripe sends webhook messages.

### Anatomy of an Endpoint URL

```
https://yourdomain.com/api/stripe/webhook
│      │                 │    │     │
│      │                 │    │     └─ Path to webhook handler
│      │                 │    └─ API route prefix
│      │                 └─ Your domain
│      └─ Protocol (HTTPS)
└─ Secure connection
```

### Breaking It Down

| Part | Example | Meaning |
|------|---------|---------|
| Protocol | `https://` | Secure connection (required by Stripe) |
| Domain | `yourdomain.com` | Your website address |
| Path | `/api/stripe/webhook` | Where your webhook handler is |

### ⚠️ CRITICAL: Endpoint URL MUST Be Publicly Accessible

Your endpoint URL must be reachable from the internet. Stripe's servers need to be able to make HTTP requests to your URL.

**What works:**
- ✅ `https://yourdomain.com/api/stripe/webhook` (production domain)
- ✅ `https://3000-yourprojectid.sg1.manus.computer/api/stripe/webhook` (Manus deployment)
- ✅ `https://api.swarm.example.com/api/stripe/webhook` (custom domain)

**What does NOT work:**
- ❌ `http://localhost:3000/api/stripe/webhook` (local only, not accessible from internet)
- ❌ `http://192.168.1.100:3000/api/stripe/webhook` (local IP, not accessible from internet)
- ❌ `http://yourcomputer.local/api/stripe/webhook` (local network, not accessible from internet)

---

## Your Endpoint URLs

### 1. Local Development (Your Computer)

**URL:** `http://localhost:3000/api/stripe/webhook`

**Status:** ❌ NOT publicly accessible

**Use this when:**
- Testing locally in VSCode
- Testing payment flows
- **Use Stripe CLI to forward webhooks** (see below)

**How to test:**
- Install Stripe CLI
- Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Stripe CLI will forward webhook events to your local server

### 2. Deployed to Manus

**URL:** `https://3000-yourprojectid.sg1.manus.computer/api/stripe/webhook`

**Status:** ✅ Publicly accessible

**Example:**
```
https://3000-irg482wahjpxrh3skl1f5-1d795434.sg1.manus.computer/api/stripe/webhook
```

**Use this when:**
- Running on Manus platform
- Testing with real Stripe test keys
- Ready for production

### 3. Custom Domain (Production)

**URL:** `https://yourdomain.com/api/stripe/webhook`

**Status:** ✅ Publicly accessible

**Example:**
```
https://swarm.example.com/api/stripe/webhook
```

**Use this when:**
- You have a custom domain
- Going live with real payments
- Using live Stripe keys

---

## How to Add Endpoint URL to Stripe

### Step 1: Go to Stripe Webhooks

1. Log in to https://dashboard.stripe.com
2. Click **"Developers"** in the left sidebar
3. Click **"Webhooks"**

### Step 2: Add Endpoint

1. Click **"Add endpoint"** button

### Step 3: Enter Endpoint URL

Enter a **publicly accessible** URL:

**For Manus deployment:**
```
https://3000-yourprojectid.sg1.manus.computer/api/stripe/webhook
```

**For custom domain:**
```
https://yourdomain.com/api/stripe/webhook
```

### Step 4: Select Events

Stripe will ask which events to send. Select these:

- ✅ `payment_intent.succeeded` — When payment succeeds
- ✅ `payment_intent.payment_failed` — When payment fails
- ✅ `customer.subscription.updated` — When subscription changes
- ✅ `customer.subscription.deleted` — When subscription cancels
- ✅ `charge.refunded` — When refund is issued

### Step 5: Create Endpoint

1. Click **"Add endpoint"**
2. You'll see a success message
3. The endpoint is now created!

### Step 6: Get Signing Secret

1. Click on the endpoint you just created
2. Scroll down to **"Signing secret"**
3. Click **"Reveal"** (it starts with `whsec_`)
4. Click the **copy icon**

### Step 7: Add to .env.local

1. Open your project in VSCode
2. Open `.env.local`
3. Find this line:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. Replace with your actual secret:
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnop
```

5. Save the file (Ctrl+S)
6. Restart dev server (Ctrl+C, then `pnpm dev`)

---

## Testing Locally with Stripe CLI

**Stripe CLI** is the recommended way to test webhooks on your local computer. It forwards webhook events from Stripe to your local server.

### Step 1: Install Stripe CLI

#### Windows

1. Go to https://stripe.com/docs/stripe-cli
2. Click **"Download for Windows"**
3. Run the installer
4. Follow the prompts
5. Restart your terminal

#### macOS

Open Terminal and run:

```bash
brew install stripe/stripe-cli/stripe
```

#### Ubuntu/Linux

Open Terminal and run:

```bash
curl -fsSL https://files.stripe.com/stripe-cli/install.sh | sh
```

### Step 2: Verify Installation

Open Terminal and run:

```bash
stripe --version
```

You should see output like:

```
stripe version 1.15.0
```

### Step 3: Login to Stripe

Run:

```bash
stripe login
```

This will:
1. Open a browser window
2. Ask you to authorize the CLI
3. Generate a restricted API key
4. Save it locally

### Step 4: Start Webhook Forwarding

In a **new terminal** (keep your dev server running), run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You should see output like:

```
> Ready! You are using Stripe API Version [2023-10-16]
> Listening for live events...
> Forwarding events to http://localhost:3000/api/stripe/webhook
> Events to forward: *
```

**Keep this terminal open!** It's now forwarding webhook events to your local server.

### Step 5: Get Your Webhook Signing Secret

In the output above, look for:

```
Your webhook signing secret is: whsec_test_secret_1234567890abcdefghijklmnop
```

Copy this secret.

### Step 6: Add Secret to .env.local

1. Open `.env.local` in VSCode
2. Find:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

3. Replace with the secret from Stripe CLI:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_secret_1234567890abcdefghijklmnop
```

4. Save the file (Ctrl+S)
5. Restart dev server (Ctrl+C, then `pnpm dev`)

### Step 7: Test Webhook

Now you can test webhooks locally!

#### Option A: Use Stripe CLI to Send Test Event

In a **third terminal**, run:

```bash
stripe trigger payment_intent.succeeded
```

You should see:

**In the Stripe CLI terminal:**
```
> event sent to http://localhost:3000/api/stripe/webhook
```

**In your dev server terminal:**
```
[2026-01-30T12:00:00.000Z] Webhook received: payment_intent.succeeded
[2026-01-30T12:00:00.100Z] Processing payment...
[2026-01-30T12:00:00.200Z] Payment processed successfully
```

#### Option B: Make a Real Test Payment

1. Go to `http://localhost:3000`
2. Create a listing with a price
3. Purchase it with test card `4242 4242 4242 4242`
4. Watch the Stripe CLI terminal for the webhook event

### Step 8: View Webhook Events

In the Stripe CLI terminal, you can see all events:

```bash
stripe logs tail
```

This shows all events in real-time.

---

## Testing on Production

Once you deploy to a publicly accessible URL (Manus or custom domain):

### Step 1: Add Production Endpoint to Stripe

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **"Add endpoint"**
3. Enter your production URL:
```
https://yourdomain.com/api/stripe/webhook
```
4. Select events
5. Click **"Add endpoint"**

### Step 2: Get Production Webhook Secret

1. Click on your endpoint
2. Find **"Signing secret"**
3. Click **"Reveal"**
4. Copy the secret

### Step 3: Update Environment Variables

Update your production `.env` file with:

```env
STRIPE_WEBHOOK_SECRET=whsec_live_secret_1234567890abcdefghijklmnop
```

### Step 4: Test with Real Payment

1. Go to your production site
2. Make a test payment with test card `4242 4242 4242 4242`
3. Check Stripe Dashboard → Webhooks → Recent events
4. You should see the event

---

## Troubleshooting

### "Endpoint URL is not reachable"

**Problem:** Stripe says it can't reach your endpoint

**Solutions:**

1. **Check URL is publicly accessible:**
   - Use `https://` (not `http://`)
   - Must be a public domain or Manus URL
   - NOT localhost or local IP

2. **Check server is running:**
   ```bash
   pnpm dev
   ```

3. **Check firewall:**
   - Make sure port 443 (HTTPS) is open
   - Check cloud provider firewall settings

4. **For local testing:**
   - Use Stripe CLI instead
   - Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### "Webhook events not being received"

**Problem:** Stripe sends events but your app doesn't receive them

**Solutions:**

1. **Check webhook secret:**
   - Make sure `STRIPE_WEBHOOK_SECRET` is in `.env.local`
   - Make sure it matches the secret in Stripe CLI or Dashboard
   - Restart dev server after updating

2. **Check Stripe CLI is running:**
   - Make sure terminal with `stripe listen` is still open
   - Look for "Listening for live events..." message

3. **Check event selection:**
   - Go to Stripe Dashboard → Webhooks
   - Click your endpoint
   - Make sure required events are selected

4. **Check server logs:**
   - Look for errors in VSCode terminal
   - Check for webhook processing errors

### "Response code 400 or 500"

**Problem:** Stripe gets an error response

**Solutions:**

1. **Check webhook handler code:**
   - Open `server/stripe/webhook.ts`
   - Look for errors in the code
   - Check TypeScript errors: `pnpm check`

2. **Check database:**
   - Make sure database is running
   - Make sure tables exist: `pnpm db:push`

3. **Check environment variables:**
   - Make sure all required env vars are set
   - Restart dev server

### "Stripe CLI won't login"

**Problem:** `stripe login` fails

**Solutions:**

1. **Check internet connection:**
   - Make sure you're connected to the internet
   - Try again in a few moments

2. **Check Stripe account:**
   - Make sure you have a Stripe account
   - Make sure you're logged into Stripe

3. **Reinstall Stripe CLI:**
   ```bash
   # Uninstall
   brew uninstall stripe  # macOS
   
   # Reinstall
   brew install stripe/stripe-cli/stripe
   ```

---

## Workflow Summary

### For Local Development

```
1. Start dev server:
   pnpm dev

2. In new terminal, start Stripe CLI:
   stripe listen --forward-to localhost:3000/api/stripe/webhook

3. Copy the webhook signing secret from Stripe CLI output

4. Add to .env.local:
   STRIPE_WEBHOOK_SECRET=whsec_test_secret_...

5. Restart dev server

6. Test by triggering events:
   stripe trigger payment_intent.succeeded
```

### For Production

```
1. Deploy to publicly accessible URL (Manus or custom domain)

2. Add endpoint to Stripe Dashboard:
   https://yourdomain.com/api/stripe/webhook

3. Get webhook signing secret from Dashboard

4. Add to production .env:
   STRIPE_WEBHOOK_SECRET=whsec_live_secret_...

5. Test with real payment
```

---

## Key Takeaways

- ✅ **Endpoint URL must be publicly accessible** (not localhost)
- ✅ **Use Stripe CLI for local testing** (recommended)
- ✅ **Use production URL for live webhooks** (Manus or custom domain)
- ✅ **Always keep webhook signing secret secure**
- ✅ **Test webhooks before going live**

Your Stripe webhooks are now configured! 🎉
