# 🔑 Complete Guide: Get Stripe API Keys

This guide shows you how to get Stripe API keys for your Swarm platform. You'll need these keys to accept payments.

**Time Required:** 10-15 minutes  
**Cost:** Free (Stripe charges only when you process real payments)

---

## Table of Contents

1. [What is Stripe?](#what-is-stripe)
2. [Create a Stripe Account](#create-a-stripe-account)
3. [Find Your API Keys](#find-your-api-keys)
4. [Test vs Live Keys](#test-vs-live-keys)
5. [Add Keys to Your Project](#add-keys-to-your-project)
6. [Test Your Integration](#test-your-integration)
7. [Troubleshooting](#troubleshooting)

---

## What is Stripe?

**Stripe** is a payment processor that lets you accept credit card payments online. It's one of the most popular payment platforms used by millions of websites.

**Why Stripe?**
- Easy to integrate
- Secure and PCI-compliant
- Supports multiple payment methods
- Free to set up (you only pay when processing payments)
- Great documentation

---

## Create a Stripe Account

### Step 1: Go to Stripe Website

1. Open your browser
2. Go to https://stripe.com
3. Click the **"Sign up"** button (top right)

### Step 2: Create Account

1. Enter your **email address**
2. Create a **password** (make it strong!)
3. Click **"Create account"**

### Step 3: Verify Email

1. Check your email inbox
2. Click the verification link from Stripe
3. You'll be taken back to Stripe

### Step 4: Complete Account Setup

1. Fill in your **business information**:
   - Business name: `Swarm` (or your company name)
   - Country: Select your country
   - Business type: Select `Technology` or `Software`

2. Fill in your **personal information**:
   - Full name
   - Email address
   - Phone number

3. Click **"Continue"**

### Step 5: Activate Account

1. Stripe will ask for **bank account information**
2. This is where payments will be deposited
3. Fill in your bank details
4. Click **"Continue"**

**Note:** You can skip this for now if you're just testing. You only need to add bank details when you're ready to accept real payments.

---

## Find Your API Keys

### Step 1: Go to Dashboard

1. Log in to https://dashboard.stripe.com
2. You should see the Stripe dashboard

### Step 2: Navigate to API Keys

1. In the left sidebar, click **"Developers"**
2. Click **"API keys"**

You should now see your API keys page.

---

## Test vs Live Keys

Stripe gives you **two sets of keys**:

| Type | Purpose | When to Use |
|------|---------|------------|
| **Test Keys** | For testing without real money | During development |
| **Live Keys** | For real payments | When you go live |

### Test Keys (Recommended for Development)

You should see two test keys:

1. **Publishable Key** (starts with `pk_test_`)
   - This is safe to share and put in your frontend code
   - Example: `pk_test_51234567890abcdefghijklmnop`

2. **Secret Key** (starts with `sk_test_`)
   - **NEVER** share this! Keep it secret
   - Only use in your backend code
   - Example: `sk_test_51234567890abcdefghijklmnop`

### Live Keys (For Real Payments)

When you're ready for real payments:

1. Click the **"Reveal live key"** button
2. You'll see two live keys:
   - **Publishable Key** (starts with `pk_live_`)
   - **Secret Key** (starts with `sk_live_`)

**⚠️ Important:** Never share your live secret key! Anyone with this key can charge your customers.

---

## Test Payment Cards

When using test keys, Stripe provides fake credit card numbers for testing:

| Card Number | Expiry | CVC | Result |
|------------|--------|-----|--------|
| `4242 4242 4242 4242` | Any future date | Any 3 digits | ✅ Successful payment |
| `4000 0000 0000 0002` | Any future date | Any 3 digits | ❌ Payment declined |
| `4000 0025 0000 3155` | Any future date | Any 3 digits | ❌ Requires authentication |

**Example:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`

---

## Add Keys to Your Project

### Step 1: Copy Your Test Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Under **"Standard keys"**, find:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
3. Click the **copy icon** next to each key

### Step 2: Add to .env.local

1. Open your project in VSCode
2. Open the `.env.local` file
3. Find these lines:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

4. Replace the values with your actual keys:

```env
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnop
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdefghijklmnop
```

5. Save the file (Ctrl+S)

### Step 3: Get Webhook Secret

For payment webhooks (to handle payment confirmations):

1. In Stripe Dashboard, go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - For local development: `http://localhost:3000/api/stripe/webhook`
   - For production: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Click on the endpoint you just created
7. Scroll down and find **"Signing secret"**
8. Click **"Reveal"**
9. Copy the secret (starts with `whsec_`)

### Step 4: Add Webhook Secret to .env.local

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Step 5: Restart Dev Server

1. In VSCode terminal, stop the dev server (Ctrl+C)
2. Start it again:

```bash
pnpm dev
```

---

## Test Your Integration

### Test 1: Create a Test Listing

1. Go to `http://localhost:3000`
2. Sign in with your test account
3. Create a new listing with a price
4. Add it to the marketplace

### Test 2: Purchase the Listing

1. Sign in with a different account (or log out and create a new one)
2. Find the listing you created
3. Click **"Buy Now"**
4. You should see the Stripe payment form

### Test 3: Make a Test Payment

1. Enter the test card: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., `12/25`)
3. CVC: Any 3 digits (e.g., `123`)
4. Name: Any name
5. Click **"Pay"**
6. You should see a success message!

### Test 4: Check Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Click **"Payments"** in the left sidebar
3. You should see your test payment listed
4. Click on it to see details

---

## Troubleshooting

### "Invalid API Key"

**Problem:** You get an error about invalid API key

**Solution:**
1. Check that you copied the key correctly (no extra spaces)
2. Make sure you're using the **test key** (starts with `pk_test_` or `sk_test_`)
3. Restart the dev server after updating `.env.local`

### "Webhook Secret Not Found"

**Problem:** Stripe webhook isn't working

**Solution:**
1. Make sure you added the webhook endpoint in Stripe Dashboard
2. Make sure `STRIPE_WEBHOOK_SECRET` is in `.env.local`
3. Make sure your webhook URL is correct
4. For local development, you might need to use a tunnel like ngrok

### "Payment Form Not Showing"

**Problem:** The Stripe payment form doesn't appear

**Solution:**
1. Check that `STRIPE_PUBLISHABLE_KEY` is in `.env.local`
2. Check browser console for errors (F12 → Console tab)
3. Make sure you're using the **publishable key** (starts with `pk_`)

### "Payment Declined"

**Problem:** Your test payment is declined

**Solution:**
1. Make sure you're using a valid test card (see table above)
2. Try the `4242 4242 4242 4242` card
3. Check that expiry date is in the future

---

## Next Steps

### For Development

1. Use **test keys** (starts with `pk_test_` and `sk_test_`)
2. Use **test cards** to simulate payments
3. Test all payment flows

### For Production

When you're ready to go live:

1. **Activate your Stripe account:**
   - Complete business verification
   - Add bank account for payouts
   - Review Stripe's terms

2. **Get live keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Scroll down to find live keys
   - Copy them

3. **Update environment variables:**
   ```env
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
   ```

4. **Update webhook endpoint:**
   - Add production URL to Stripe webhooks
   - Example: `https://swarm.example.com/api/stripe/webhook`

5. **Test with real payments:**
   - Process a small test payment
   - Verify it appears in your bank account

---

## Security Best Practices

### Do's ✅

- ✅ Keep your **secret key** private
- ✅ Store keys in `.env.local` (not in code)
- ✅ Use **test keys** during development
- ✅ Rotate keys regularly
- ✅ Use HTTPS in production
- ✅ Validate all payments on the server

### Don'ts ❌

- ❌ Don't commit `.env.local` to git
- ❌ Don't share your secret key
- ❌ Don't put secret key in frontend code
- ❌ Don't use live keys in development
- ❌ Don't hardcode API keys

---

## Useful Stripe Resources

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Documentation:** https://stripe.com/docs
- **Stripe API Reference:** https://stripe.com/docs/api
- **Stripe Testing:** https://stripe.com/docs/testing
- **Stripe Support:** https://support.stripe.com

---

## Summary

You now have Stripe API keys! 🎉

**What you've done:**
- ✅ Created a Stripe account
- ✅ Found your API keys
- ✅ Added keys to your project
- ✅ Set up webhooks
- ✅ Tested with test cards

**What's next:**
- Test payment flows
- Implement payment features
- Deploy to production
- Switch to live keys

Happy selling! 💳
