# Swarm Platform - Developer Introduction & Code Modification Guide

Welcome to Swarm! This document explains the project structure and shows you exactly where to modify code for different features.

---

## Project Overview

**Swarm** is a full-stack AI marketplace and no-code builder platform built with:
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11 + MySQL/TiDB
- **Authentication**: Manus OAuth
- **Payments**: Stripe (checkout + subscriptions)
- **Storage**: AWS S3

The platform allows users to:
1. **Buy/Sell** AI functions, templates, apps, and datasets in the marketplace
2. **Build** custom AI models using the no-code AI Builder (image classification)
3. **Manage** projects, teams, and analytics in a centralized dashboard
4. **Monetize** through subscriptions (Free/Pro/Master) and marketplace sales

---

## Project Structure

```
botmarket/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components (routes)
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Marketplace.tsx     # Browse & search listings
│   │   │   ├── ListingDetail.tsx   # Single listing view
│   │   │   ├── AIBuilder.tsx       # AI project list
│   │   │   ├── AIProjectDetail.tsx # AI training interface
│   │   │   ├── ProjectDashboard.tsx # User projects + analytics
│   │   │   ├── CreateListing.tsx   # Publish to marketplace
│   │   │   ├── EditListing.tsx     # Edit marketplace items
│   │   │   ├── Pricing.tsx         # Subscription plans
│   │   │   ├── AdminPanel.tsx      # Admin moderation
│   │   │   ├── Profile.tsx         # User profile
│   │   │   ├── Teams.tsx           # Team management
│   │   │   ├── Community.tsx       # Forums & profiles
│   │   │   ├── CustomProject.tsx   # Custom project requests
│   │   │   ├── DataMarketplace.tsx # Dataset browsing
│   │   │   ├── Affiliate.tsx       # Referral program
│   │   │   └── Dashboard.tsx       # Main dashboard
│   │   ├── components/             # Reusable UI components
│   │   │   ├── DashboardLayout.tsx # Sidebar navigation
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── ...
│   │   ├── App.tsx                 # Route definitions
│   │   ├── index.css               # Global styles & theme
│   │   └── main.tsx                # React entry point
│   └── public/                     # Static assets
│
├── server/                          # Backend Node.js/Express
│   ├── routers.ts                  # All tRPC procedures (API endpoints)
│   ├── db.ts                       # Database query helpers
│   ├── stripe/                     # Stripe integration
│   │   ├── checkout.ts             # Marketplace purchases
│   │   ├── subscription.ts         # Plan upgrades/downgrades
│   │   ├── webhook.ts              # Payment webhooks
│   │   ├── products.ts             # Pricing configuration
│   │   └── webhook.test.ts         # Tests
│   ├── _core/                      # Framework internals (don't modify)
│   │   ├── index.ts                # Express server setup
│   │   ├── context.ts              # tRPC context (auth)
│   │   ├── trpc.ts                 # tRPC router definition
│   │   ├── env.ts                  # Environment variables
│   │   └── ...
│   └── *.test.ts                   # Test files
│
├── drizzle/                         # Database
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # Database migrations
│
├── shared/                          # Shared constants
│   └── const.ts                    # Shared values
│
├── storage/                         # S3 storage helpers
│   └── index.ts                    # Upload/download functions
│
├── package.json                     # Dependencies
├── drizzle.config.ts               # Database config
├── vite.config.ts                  # Frontend build config
└── tsconfig.json                   # TypeScript config
```

---

## How to Modify Different Features

### 1. **AI Builder (Image Classification)**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **UI/Training Interface** | `client/src/pages/AIProjectDetail.tsx` | Data upload form, labeling interface, training progress display |
| **Data Processing** | `client/src/pages/AIProjectDetail.tsx` | How uploaded ZIP files are processed and organized |
| **Model Training** | `server/routers.ts` → `ai.trainModel` procedure | Backend training logic and model storage |
| **Model Export** | `server/routers.ts` → `ai.exportModel` procedure | Export formats (ONNX, TensorFlow Lite, etc.) |
| **Project List** | `client/src/pages/AIBuilder.tsx` | Display of all AI projects |

**Example: Add a new AI model type (e.g., Object Detection)**

1. Update database schema: `drizzle/schema.ts`
   ```ts
   modelType: mysqlEnum("modelType", ["imageClassification", "objectDetection"]),
   ```

2. Push schema: `pnpm db:push`

3. Update AI Builder UI: `client/src/pages/AIProjectDetail.tsx`
   - Add model type selector

4. Update backend: `server/routers.ts`
   - Add new training logic in `ai.trainModel`

---

### 2. **Marketplace (Buy/Sell Listings)**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **Browse Listings** | `client/src/pages/Marketplace.tsx` | Search, filtering, sorting, display |
| **Listing Detail** | `client/src/pages/ListingDetail.tsx` | Product info, purchase button, reviews, demo video |
| **Create Listing** | `client/src/pages/CreateListing.tsx` | Form fields, validation, file upload |
| **Edit Listing** | `client/src/pages/EditListing.tsx` | Update existing listings |
| **Listing API** | `server/routers.ts` → `listings.*` procedures | Backend logic for CRUD operations |
| **Database** | `drizzle/schema.ts` → `listings` table | Add new fields (e.g., demoVideoUrl, tags) |

**Example: Add a new listing category (e.g., "Plugins")**

1. Update schema: `drizzle/schema.ts`
   ```ts
   category: mysqlEnum("category", ["function", "template", "application", "dataset", "plugin"]),
   ```

2. Push schema: `pnpm db:push`

3. Update Marketplace UI: `client/src/pages/Marketplace.tsx`
   - Add "Plugins" tab in category filter

4. Update Create Listing: `client/src/pages/CreateListing.tsx`
   - Add "Plugin" option in category dropdown

---

### 3. **Projects Dashboard (Analytics & Management)**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **Dashboard UI** | `client/src/pages/ProjectDashboard.tsx` | Layout, tabs, analytics charts |
| **Analytics Charts** | `client/src/pages/ProjectDashboard.tsx` | Revenue, sales, traffic data visualization |
| **Project Queries** | `server/db.ts` → `getUserProjects()` | What data to fetch |
| **Project API** | `server/routers.ts` → `projects.*` procedures | Backend project operations |

**Example: Add a new analytics metric (e.g., Conversion Rate)**

1. Update ProjectDashboard: `client/src/pages/ProjectDashboard.tsx`
   ```tsx
   // Add new chart section
   <Card>
     <CardHeader>Conversion Rate</CardHeader>
     <LineChart data={conversionData} />
   </Card>
   ```

2. Calculate in backend: `server/routers.ts`
   ```ts
   const conversionRate = (purchaseCount / viewCount) * 100;
   ```

---

### 4. **Payments & Stripe Integration**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **Checkout** | `server/stripe/checkout.ts` | Marketplace purchase flow |
| **Subscriptions** | `server/stripe/subscription.ts` | Plan upgrades/downgrades |
| **Webhooks** | `server/stripe/webhook.ts` | Handle payment events |
| **Pricing Page** | `client/src/pages/Pricing.tsx` | Display plans and upgrade buttons |
| **Products Config** | `server/stripe/products.ts` | Plan names, prices, features |

**Example: Change subscription pricing**

1. Update products: `server/stripe/products.ts`
   ```ts
   export const PLANS = {
     pro: { price: 999, name: "Pro" },  // $9.99
     master: { price: 2999, name: "Master" },  // $29.99
   };
   ```

2. Update Pricing UI: `client/src/pages/Pricing.tsx`
   - Prices will automatically reflect

---

### 5. **Authentication & User Profiles**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **User Profile** | `client/src/pages/Profile.tsx` | Profile fields, avatar, bio |
| **User Data** | `drizzle/schema.ts` → `users` table | Add new user fields |
| **Auth Context** | `server/_core/context.ts` | How user data is passed to frontend |
| **User API** | `server/routers.ts` → `auth.*` procedures | User operations |

**Example: Add a "Portfolio URL" field to user profiles**

1. Update schema: `drizzle/schema.ts`
   ```ts
   portfolioUrl: varchar("portfolioUrl", { length: 512 }),
   ```

2. Push schema: `pnpm db:push`

3. Update Profile UI: `client/src/pages/Profile.tsx`
   - Add input field for portfolio URL

4. Update API: `server/routers.ts`
   - Add `updateProfile` mutation to save the field

---

### 6. **Admin Panel (Moderation)**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **Admin UI** | `client/src/pages/AdminPanel.tsx` | Moderation interface, approval workflow |
| **Admin API** | `server/routers.ts` → `admin.*` procedures | Backend moderation logic |
| **Access Control** | `server/routers.ts` → `adminProcedure` | Who can access admin features |

**Example: Add a new moderation rule**

1. Update Admin Panel: `client/src/pages/AdminPanel.tsx`
   - Add new rule checkbox or input

2. Update backend: `server/routers.ts`
   ```ts
   admin.approveListing: adminProcedure.mutation(async ({ input, ctx }) => {
     // Add new validation logic here
   }),
   ```

---

### 7. **Teams & Collaboration**

**Where to modify:**

| Component | File | What to change |
|-----------|------|-----------------|
| **Team UI** | `client/src/pages/Teams.tsx` | Team members, roles, permissions |
| **Team API** | `server/routers.ts` → `teams.*` procedures | Team operations |
| **Database** | `drizzle/schema.ts` → `teams`, `teamMembers` tables | Team structure |

**Example: Add a new team role (e.g., "Reviewer")**

1. Update schema: `drizzle/schema.ts`
   ```ts
   role: mysqlEnum("role", ["owner", "admin", "editor", "viewer", "reviewer"]),
   ```

2. Push schema: `pnpm db:push`

3. Update Teams UI: `client/src/pages/Teams.tsx`
   - Add "Reviewer" option in role dropdown

4. Update permissions: `server/routers.ts`
   - Define what reviewers can do

---

## Common Tasks

### Add a New Page/Route

1. Create new file: `client/src/pages/NewFeature.tsx`
2. Add route in `client/src/App.tsx`:
   ```tsx
   <Route path="/new-feature" component={NewFeature} />
   ```
3. Add navigation link in `client/src/components/DashboardLayout.tsx`

### Add a New Database Table

1. Update schema: `drizzle/schema.ts`
   ```ts
   export const newTable = mysqlTable("newTable", {
     id: int("id").autoincrement().primaryKey(),
     // ... fields
   });
   ```
2. Push: `pnpm db:push`
3. Add query helpers: `server/db.ts`
4. Add API procedures: `server/routers.ts`

### Add a New API Endpoint

1. Create procedure in `server/routers.ts`:
   ```ts
   newFeature: router({
     getData: protectedProcedure.query(async ({ ctx }) => {
       // Your logic here
     }),
   }),
   ```
2. Call from frontend:
   ```tsx
   const { data } = trpc.newFeature.getData.useQuery();
   ```

### Modify Styling

1. Global styles: `client/src/index.css`
2. Component styles: Use Tailwind classes directly in JSX
3. Theme colors: Edit CSS variables in `client/src/index.css`

---

## Running & Testing

**Start development server:**
```bash
pnpm dev
```

**Run tests:**
```bash
pnpm test
```

**Build for production:**
```bash
pnpm build
```

**Push database changes:**
```bash
pnpm db:push
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `server/routers.ts` | **All API endpoints** - Add/modify features here |
| `drizzle/schema.ts` | **Database structure** - Add tables/fields here |
| `client/src/pages/*.tsx` | **UI pages** - Modify user interfaces here |
| `server/db.ts` | **Database queries** - Add query helpers here |
| `server/stripe/*.ts` | **Payment logic** - Modify Stripe integration here |
| `client/src/index.css` | **Global styling** - Theme colors and fonts |

---

## Environment Variables

All required env vars are automatically injected:
- `DATABASE_URL` - MySQL connection
- `STRIPE_SECRET_KEY` - Stripe API key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `JWT_SECRET` - Session signing
- `OAUTH_SERVER_URL` - Manus OAuth endpoint

No manual setup needed - they're configured in the platform.

---

## Support & Next Steps

**To add demo videos to listings:**
- Modify: `client/src/pages/CreateListing.tsx` (add video upload form)
- Modify: `client/src/pages/ListingDetail.tsx` (display video player)
- Modify: `server/routers.ts` (add video upload endpoint)
- Modify: `drizzle/schema.ts` (add demoVideoUrl field - already done!)

**To add new AI model types:**
- See "AI Builder" section above

**To customize marketplace categories:**
- See "Marketplace" section above

Happy coding! 🚀
