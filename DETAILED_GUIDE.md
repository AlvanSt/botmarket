# Swarm Platform - Complete Detailed Guide & VSCode Setup

This comprehensive guide covers every file in the Swarm project and explains how to move it to VSCode for local development.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Complete File Structure](#complete-file-structure)
3. [Frontend Files - Detailed](#frontend-files---detailed)
4. [Backend Files - Detailed](#backend-files---detailed)
5. [Database Files - Detailed](#database-files---detailed)
6. [Configuration Files - Detailed](#configuration-files---detailed)
7. [Moving to VSCode - Step by Step](#moving-to-vscode---step-by-step)
8. [Running Locally](#running-locally)

---

## Project Overview

**Swarm** is a production-ready full-stack platform with:
- **Frontend**: React 19 with TypeScript, Tailwind CSS 4, shadcn/ui components
- **Backend**: Express.js with tRPC for type-safe APIs
- **Database**: MySQL with Drizzle ORM
- **Authentication**: Manus OAuth 2.0
- **Payments**: Stripe (checkout + subscriptions + webhooks)
- **Storage**: AWS S3 for file uploads
- **Testing**: Vitest for unit tests

---

## Complete File Structure

```
botmarket/
│
├── 📁 client/                              # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 pages/                      # Page Components (Routes)
│   │   │   ├── Home.tsx                   # Landing page with hero section
│   │   │   ├── Marketplace.tsx            # Browse, search, filter listings
│   │   │   ├── ListingDetail.tsx          # Single listing view + purchase
│   │   │   ├── AIBuilder.tsx              # List all AI projects
│   │   │   ├── AIProjectDetail.tsx        # AI training interface (upload/label/train)
│   │   │   ├── ProjectDashboard.tsx       # User projects + analytics
│   │   │   ├── CreateListing.tsx          # Publish to marketplace form
│   │   │   ├── EditListing.tsx            # Edit marketplace item
│   │   │   ├── Pricing.tsx                # Subscription plans + upgrade buttons
│   │   │   ├── AdminPanel.tsx             # Moderation interface
│   │   │   ├── Profile.tsx                # User profile settings
│   │   │   ├── Teams.tsx                  # Team management + roles
│   │   │   ├── Community.tsx              # Forums, profiles, challenges
│   │   │   ├── CustomProject.tsx          # Custom project requests
│   │   │   ├── DataMarketplace.tsx        # Browse datasets
│   │   │   ├── Affiliate.tsx              # Referral program dashboard
│   │   │   ├── Dashboard.tsx              # Main user dashboard
│   │   │   ├── PurchaseSuccess.tsx        # After marketplace purchase
│   │   │   ├── SubscriptionSuccess.tsx    # After plan upgrade
│   │   │   ├── NotFound.tsx               # 404 page
│   │   │   └── Analytics.tsx              # Analytics dashboard (merged into Projects)
│   │   │
│   │   ├── 📁 components/                 # Reusable UI Components
│   │   │   ├── DashboardLayout.tsx        # Sidebar + navigation wrapper
│   │   │   ├── DashboardLayoutSkeleton.tsx # Loading skeleton
│   │   │   ├── ErrorBoundary.tsx          # Error handling wrapper
│   │   │   ├── Map.tsx                    # Google Maps integration
│   │   │   ├── AIChatBox.tsx              # Chat interface (if needed)
│   │   │   ├── 📁 ui/                     # shadcn/ui components
│   │   │   │   ├── button.tsx             # Reusable button
│   │   │   │   ├── card.tsx               # Card container
│   │   │   │   ├── input.tsx              # Text input
│   │   │   │   ├── select.tsx             # Dropdown select
│   │   │   │   ├── dialog.tsx             # Modal dialog
│   │   │   │   ├── tabs.tsx               # Tab navigation
│   │   │   │   ├── badge.tsx              # Status badge
│   │   │   │   ├── progress.tsx           # Progress bar
│   │   │   │   ├── slider.tsx             # Range slider
│   │   │   │   ├── checkbox.tsx           # Checkbox input
│   │   │   │   ├── radio-group.tsx        # Radio buttons
│   │   │   │   ├── form.tsx               # Form wrapper
│   │   │   │   ├── label.tsx              # Form label
│   │   │   │   ├── alert.tsx              # Alert message
│   │   │   │   ├── toast.tsx              # Toast notification
│   │   │   │   ├── sonner.tsx             # Toast provider
│   │   │   │   ├── tooltip.tsx            # Tooltip
│   │   │   │   ├── popover.tsx            # Popover menu
│   │   │   │   ├── dropdown-menu.tsx      # Dropdown menu
│   │   │   │   ├── sheet.tsx              # Side sheet
│   │   │   │   ├── separator.tsx          # Divider line
│   │   │   │   ├── scroll-area.tsx        # Scrollable area
│   │   │   │   └── ...more components
│   │   │   └── ...other components
│   │   │
│   │   ├── 📁 contexts/                   # React Contexts
│   │   │   └── ThemeContext.tsx           # Dark/light theme provider
│   │   │
│   │   ├── 📁 hooks/                      # Custom React Hooks
│   │   │   ├── useAuth.ts                 # Get current user + auth state
│   │   │   └── useTheme.ts                # Theme switching
│   │   │
│   │   ├── 📁 lib/                        # Utility Functions
│   │   │   └── trpc.ts                    # tRPC client configuration
│   │   │
│   │   ├── 📁 _core/                      # Framework Internals (Don't modify)
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts             # Auth hook implementation
│   │   │   └── ...
│   │   │
│   │   ├── App.tsx                        # Main app component + routes
│   │   ├── main.tsx                       # React entry point
│   │   ├── index.css                      # Global styles + theme variables
│   │   └── vite-env.d.ts                  # Vite type definitions
│   │
│   ├── 📁 public/                         # Static Assets
│   │   ├── favicon.ico                    # Browser tab icon
│   │   ├── robots.txt                     # SEO robots file
│   │   └── ...other static files
│   │
│   ├── index.html                         # HTML entry point
│   └── tsconfig.json                      # TypeScript config for frontend
│
├── 📁 server/                              # Express Backend Application
│   ├── routers.ts                         # **MAIN FILE** - All tRPC API endpoints
│   ├── db.ts                              # Database query helpers
│   │
│   ├── 📁 stripe/                         # Stripe Integration
│   │   ├── products.ts                    # Pricing plans configuration
│   │   ├── checkout.ts                    # Marketplace purchase checkout
│   │   ├── subscription.ts                # Plan upgrade/downgrade
│   │   ├── webhook.ts                     # Stripe webhook handler
│   │   └── webhook.test.ts                # Webhook tests
│   │
│   ├── 📁 _core/                          # Framework Internals (Don't modify unless extending)
│   │   ├── index.ts                       # Express server setup + routes
│   │   ├── context.ts                     # tRPC context (auth injection)
│   │   ├── trpc.ts                        # tRPC router + procedures
│   │   ├── env.ts                         # Environment variables
│   │   ├── cookies.ts                     # Session cookie handling
│   │   ├── llm.ts                         # LLM integration helper
│   │   ├── notification.ts                # Owner notifications
│   │   ├── voiceTranscription.ts          # Voice-to-text
│   │   ├── imageGeneration.ts             # Image generation
│   │   ├── map.ts                         # Google Maps integration
│   │   └── systemRouter.ts                # System procedures
│   │
│   ├── auth.logout.test.ts                # Auth tests
│   ├── teams.test.ts                      # Team feature tests
│   ├── seed-marketplace.ts                # Seed data script
│   └── tsconfig.json                      # TypeScript config for backend
│
├── 📁 drizzle/                             # Database Layer
│   ├── schema.ts                          # **MAIN FILE** - All table definitions
│   ├── 📁 migrations/                     # Database migration history
│   │   ├── 0001_*.sql                     # Initial schema
│   │   ├── 0002_*.sql                     # Add features
│   │   ├── 0003_*.sql                     # More features
│   │   └── 0004_*.sql                     # Latest changes
│   └── drizzle.config.ts                  # Drizzle configuration
│
├── 📁 shared/                              # Shared Code
│   └── const.ts                           # Shared constants (COOKIE_NAME, etc.)
│
├── 📁 storage/                             # S3 Storage
│   └── index.ts                           # Upload/download helpers
│
├── 📁 .manus-logs/                         # Debug Logs (Auto-generated)
│   ├── devserver.log                      # Server startup logs
│   ├── browserConsole.log                 # Client-side console
│   ├── networkRequests.log                # HTTP requests
│   └── sessionReplay.log                  # User interactions
│
├── 📁 dist/                                # Production Build (Auto-generated)
│   └── ...compiled files
│
├── 📁 node_modules/                        # Dependencies (Don't commit)
│
├── 📁 .git/                                # Git repository
│
├── 📄 package.json                         # **IMPORTANT** - Dependencies + scripts
├── 📄 pnpm-lock.yaml                       # Dependency lock file
├── 📄 tsconfig.json                        # Root TypeScript config
├── 📄 vite.config.ts                       # Vite build configuration
├── 📄 drizzle.config.ts                    # Drizzle ORM configuration
├── 📄 tailwind.config.ts                   # Tailwind CSS configuration
├── 📄 postcss.config.js                    # PostCSS configuration
├── 📄 .env.example                         # Example environment variables
├── 📄 .gitignore                           # Git ignore rules
├── 📄 .prettierrc                          # Code formatting rules
├── 📄 README.md                            # Project README
├── 📄 INTRODUCTION.md                      # Quick start guide
├── 📄 DETAILED_GUIDE.md                    # This file
└── 📄 todo.md                              # Feature tracking
```

---

## Frontend Files - Detailed

### Pages (client/src/pages/)

#### **Home.tsx**
**Purpose**: Landing page with hero section, feature overview, and CTAs

**Key Components**:
- Hero section with "Build, Buy & Sell AI Solutions" headline
- Feature cards showing marketplace, AI builder, pricing, community, affiliate
- Navigation bar with login/dashboard buttons
- Footer with links

**When to modify**:
- Change hero text or images
- Add new feature cards
- Update CTAs or links
- Change color scheme

**Related files**: `client/src/index.css` (colors)

---

#### **Marketplace.tsx**
**Purpose**: Browse, search, filter, and discover listings

**Key Components**:
- Search bar with keyword extraction
- Category tabs (Functions, Templates, Apps, Data)
- Advanced filters (price range, rating, free only)
- Trending section
- Popular section
- Listing cards with preview

**When to modify**:
- Add new filter options
- Change search behavior
- Add new categories
- Modify listing card display

**Related files**:
- `server/routers.ts` → `listings.search`, `listings.getTrending`
- `drizzle/schema.ts` → `listings` table

---

#### **ListingDetail.tsx**
**Purpose**: View single listing with full details, reviews, and purchase button

**Key Components**:
- Listing title, description, price
- Preview images carousel
- **Demo video player** (new field: demoVideoUrl)
- Seller profile
- Reviews section
- Purchase button (opens Stripe checkout)
- Back button

**When to modify**:
- Add demo video player
- Change review display
- Add related listings
- Modify purchase flow

**Related files**:
- `server/routers.ts` → `listings.getBySlug`
- `drizzle/schema.ts` → `listings` table (demoVideoUrl field)

---

#### **AIBuilder.tsx**
**Purpose**: List all AI projects for current user

**Key Components**:
- New project button
- AI projects list/grid
- Project cards with status
- Delete/edit options

**When to modify**:
- Change project card layout
- Add project filters
- Add sorting options
- Modify new project flow

**Related files**:
- `server/routers.ts` → `ai.listProjects`
- `drizzle/schema.ts` → `aiProjects` table

---

#### **AIProjectDetail.tsx**
**Purpose**: Complete AI model training interface (upload → process → label → train)

**Key Components**:
- **Upload Tab**: ZIP file upload with format guidance
- **Process Tab**: Extract and organize training data
- **Label Tab**: Review and confirm class labels
- **Train Tab**: Model training progress
- **Model Info**: Display trained model details
- Purchased data integration (use datasets in training)
- Back button

**When to modify**:
- Add new model types (object detection, etc.)
- Change training algorithm
- Add model export options
- Modify labeling interface

**Related files**:
- `server/routers.ts` → `ai.trainModel`, `ai.getProject`
- `drizzle/schema.ts` → `aiProjects` table

---

#### **ProjectDashboard.tsx**
**Purpose**: Central hub showing all projects (listings + AI + purchases) with analytics

**Key Components**:
- Project tabs (All, Listings, AI, Purchases)
- Project list/grid with filtering
- **Analytics Tab**: Revenue, sales, traffic charts
- Bulk actions
- Version control history
- Team collaboration info

**When to modify**:
- Add new analytics metrics
- Change project filtering
- Add new tabs
- Modify analytics charts

**Related files**:
- `server/routers.ts` → `projects.list`, `projects.getAnalytics`
- `drizzle/schema.ts` → `listings`, `aiProjects`, `purchases` tables

---

#### **CreateListing.tsx**
**Purpose**: Form to publish new item to marketplace

**Key Components**:
- Title, description, short description
- Category selector (function, template, app, dataset)
- Price input
- File upload (ZIP or CSV)
- **Demo video upload** (new)
- Preview images upload
- Tags input
- Language, framework, version
- Submit button with validation

**When to modify**:
- Add new fields
- Change validation rules
- Add demo video upload
- Modify file upload handling

**Related files**:
- `server/routers.ts` → `listings.create`
- `drizzle/schema.ts` → `listings` table
- `storage/index.ts` → `storagePut()`

---

#### **EditListing.tsx**
**Purpose**: Edit existing marketplace listing

**Key Components**:
- Pre-filled form with current listing data
- Same fields as CreateListing
- Update button
- Delete button
- Back button

**When to modify**:
- Add new editable fields
- Change validation
- Add version history display

**Related files**:
- `server/routers.ts` → `listings.update`
- `drizzle/schema.ts` → `listings` table

---

#### **Pricing.tsx**
**Purpose**: Display subscription plans with upgrade/downgrade options

**Key Components**:
- Current plan display
- Free plan card
- Pro plan card ($7.99/month)
- Master plan card ($24.99/month)
- Feature comparison table
- Upgrade/Downgrade buttons
- Stripe checkout integration

**When to modify**:
- Change plan prices
- Add new plan tiers
- Modify feature list
- Change plan names

**Related files**:
- `server/stripe/products.ts` → Plan configuration
- `server/stripe/subscription.ts` → Checkout logic
- `server/routers.ts` → `subscription.createCheckout`

---

#### **AdminPanel.tsx**
**Purpose**: Moderation interface for admins to review and approve listings

**Key Components**:
- Pending listings table
- Listing preview
- Approve/Reject buttons
- Rejection reason textarea
- User management
- Statistics dashboard

**When to modify**:
- Add new moderation rules
- Change approval workflow
- Add new admin features

**Related files**:
- `server/routers.ts` → `admin.*` procedures
- `drizzle/schema.ts` → `listings`, `adminActions` tables

---

#### **Profile.tsx**
**Purpose**: User profile settings and seller information

**Key Components**:
- Avatar upload
- Name, email display
- Bio textarea
- Website URL
- Seller profile fields
- Earnings display
- Account settings

**When to modify**:
- Add new profile fields
- Change avatar upload
- Add new settings

**Related files**:
- `server/routers.ts` → `auth.updateProfile`
- `drizzle/schema.ts` → `users` table

---

#### **Teams.tsx**
**Purpose**: Team management with role-based permissions

**Key Components**:
- Team list
- Add member form
- Member list with roles
- Role selector (Owner, Admin, Editor, Viewer)
- Remove member button
- Team activity feed

**When to modify**:
- Add new roles
- Change permissions
- Modify team structure

**Related files**:
- `server/routers.ts` → `teams.*` procedures
- `drizzle/schema.ts` → `teams`, `teamMembers` tables

---

#### **Community.tsx**
**Purpose**: Forums, developer profiles, challenges, tutorials

**Key Components**:
- Developer profiles showcase
- Forum discussions
- Challenges/competitions
- Learning tutorials
- Community stats

**When to modify**:
- Add new community features
- Change profile display
- Add new sections

**Related files**:
- `server/routers.ts` → `community.*` procedures

---

#### **CustomProject.tsx**
**Purpose**: Request custom AI project development (Master plan only)

**Key Components**:
- Project request form
- Budget input (minimum $500)
- Timeline selector
- Description textarea
- Submit button
- Plan restriction message (Free users blocked)

**When to modify**:
- Change minimum budget
- Add new request fields
- Modify plan restrictions

**Related files**:
- `server/routers.ts` → `customProjects.create`
- `drizzle/schema.ts` → `customProjects` table

---

#### **DataMarketplace.tsx**
**Purpose**: Browse and purchase datasets

**Key Components**:
- Dataset search and filter
- Data quality scores
- Licensing options display
- Dataset preview
- Purchase button
- Data provider info

**When to modify**:
- Add new data categories
- Change quality scoring
- Add new licensing options

**Related files**:
- `server/routers.ts` → `datasets.*` procedures
- `drizzle/schema.ts` → `datasets` table

---

#### **Affiliate.tsx**
**Purpose**: Referral program dashboard

**Key Components**:
- Referral link display
- Commission rate display
- Referral stats (clicks, signups, earnings)
- Referral history table
- Payout information

**When to modify**:
- Change commission structure
- Add new stats
- Modify referral tracking

**Related files**:
- `server/routers.ts` → `affiliate.*` procedures
- `drizzle/schema.ts` → `affiliates`, `referrals` tables

---

#### **Dashboard.tsx**
**Purpose**: Main user dashboard

**Key Components**:
- Quick stats (earnings, projects, purchases)
- Recent activity
- Quick action buttons
- Navigation to other features

**When to modify**:
- Add new dashboard widgets
- Change stats displayed
- Add quick actions

---

#### **PurchaseSuccess.tsx**
**Purpose**: Confirmation page after marketplace purchase

**Key Components**:
- Success message
- Download button for purchased file
- Order details
- Continue shopping button

**When to modify**:
- Change success message
- Add download options
- Modify layout

---

#### **SubscriptionSuccess.tsx**
**Purpose**: Confirmation page after plan upgrade

**Key Components**:
- Success message
- New plan details
- Feature list
- Back to dashboard button

**When to modify**:
- Change success message
- Add plan details display

---

### Components (client/src/components/)

#### **DashboardLayout.tsx**
**Purpose**: Sidebar navigation wrapper for authenticated pages

**Key Components**:
- Collapsible sidebar
- Menu items (Dashboard, Projects, Marketplace, AI Builder, Teams, etc.)
- User profile dropdown
- Logout button
- Resizable sidebar

**Menu Items**:
```
- Dashboard
- Projects
- Marketplace
- Data Market
- AI Builder
- Teams
- Affiliate
- Custom Project
- Profile
```

**When to modify**:
- Add/remove menu items
- Change sidebar styling
- Add new navigation sections

**Related files**: None (standalone component)

---

#### **ErrorBoundary.tsx**
**Purpose**: Catch React errors and display fallback UI

**When to modify**:
- Change error message
- Add error logging
- Modify fallback UI

---

#### **Map.tsx**
**Purpose**: Google Maps integration (if needed for location features)

**When to modify**:
- Add map features (markers, directions, etc.)
- Change map styling

---

### Contexts (client/src/contexts/)

#### **ThemeContext.tsx**
**Purpose**: Manage dark/light theme switching

**When to modify**:
- Add new theme options
- Change theme colors

---

### Hooks (client/src/hooks/)

#### **useAuth.ts**
**Purpose**: Get current user and auth state

**Returns**:
```ts
{
  user: User | null,
  loading: boolean,
  isAuthenticated: boolean,
  logout: () => void
}
```

**When to modify**:
- Add new auth methods
- Change auth logic

---

### Global Styles (client/src/index.css)

**Purpose**: Global CSS variables, theme colors, and utility classes

**Key Sections**:
- CSS variables for colors (primary, secondary, accent, etc.)
- Dark/light theme definitions
- Global font settings
- Tailwind directives
- Custom utilities

**When to modify**:
- Change color scheme
- Update theme colors
- Add new utilities
- Change fonts

**Example color variables**:
```css
--primary: 38 92% 50%      /* Orange */
--secondary: 0 0% 100%     /* White */
--accent: 38 92% 50%       /* Orange */
--background: 60 33% 97%   /* Light cream */
--foreground: 0 0% 0%      /* Black */
```

---

## Backend Files - Detailed

### Main API File (server/routers.ts)

**Purpose**: **ALL API endpoints** - This is where you add/modify backend functionality

**Structure**:
```ts
export const appRouter = router({
  // Authentication
  auth: router({
    me: publicProcedure.query(...),
    logout: publicProcedure.mutation(...),
  }),

  // Listings (Marketplace)
  listings: router({
    search: publicProcedure.query(...),
    getBySlug: publicProcedure.query(...),
    create: protectedProcedure.mutation(...),
    update: protectedProcedure.mutation(...),
    delete: protectedProcedure.mutation(...),
  }),

  // Purchases
  purchases: router({
    getMyPurchases: protectedProcedure.query(...),
    create: protectedProcedure.mutation(...),
  }),

  // AI Projects
  ai: router({
    listProjects: protectedProcedure.query(...),
    getProject: protectedProcedure.query(...),
    createProject: protectedProcedure.mutation(...),
    trainModel: protectedProcedure.mutation(...),
  }),

  // Projects (Dashboard)
  projects: router({
    list: protectedProcedure.query(...),
    getAnalytics: protectedProcedure.query(...),
  }),

  // Stripe Subscriptions
  subscription: router({
    createCheckout: protectedProcedure.mutation(...),
  }),

  // Teams
  teams: router({
    create: protectedProcedure.mutation(...),
    addMember: protectedProcedure.mutation(...),
  }),

  // Admin
  admin: router({
    approveListing: adminProcedure.mutation(...),
    rejectListing: adminProcedure.mutation(...),
  }),

  // ... more routers
});
```

**When to modify**:
- Add new API endpoints
- Change existing logic
- Add new procedures
- Modify validation

**Related files**:
- `server/db.ts` → Query helpers
- `drizzle/schema.ts` → Database tables

---

### Database Helpers (server/db.ts)

**Purpose**: Query functions that interact with the database

**Key Functions**:
```ts
// User queries
async function upsertUser(user: InsertUser): Promise<void>
async function getUserByOpenId(openId: string)

// Listing queries
async function createListing(data: InsertListing)
async function getListingBySlug(slug: string)
async function searchListings(query: string, filters: any)
async function updateListing(id: number, data: Partial<Listing>)

// Purchase queries
async function createPurchase(data: InsertPurchase)
async function getUserPurchases(userId: number)

// AI Project queries
async function createAIProject(data: InsertAIProject)
async function getAIProject(id: number)
async function getUserAIProjects(userId: number)

// Team queries
async function createTeam(data: InsertTeam)
async function addTeamMember(teamId: number, userId: number, role: string)

// ... more functions
```

**When to modify**:
- Add new query functions
- Change query logic
- Add new filters
- Optimize queries

**Related files**:
- `drizzle/schema.ts` → Table definitions
- `server/routers.ts` → Uses these functions

---

### Stripe Integration (server/stripe/)

#### **products.ts**
**Purpose**: Define subscription plans and pricing

```ts
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: ["Browse marketplace", "Limited AI projects"],
  },
  pro: {
    name: "Creator",
    price: 799, // $7.99 in cents
    features: ["Unlimited projects", "Team collaboration"],
  },
  master: {
    name: "Master",
    price: 2499, // $24.99 in cents
    features: ["All Pro features", "Custom projects", "Priority support"],
  },
};
```

**When to modify**:
- Change plan prices
- Add new plans
- Modify features list

---

#### **checkout.ts**
**Purpose**: Handle marketplace purchase checkout

**Flow**:
1. User clicks "Purchase" on listing
2. Frontend calls `stripe.checkout.createCheckout`
3. Backend creates Stripe session
4. Returns checkout URL
5. Frontend opens in new tab
6. User completes payment
7. Stripe webhook confirms purchase

**When to modify**:
- Change checkout flow
- Add new fields
- Modify pricing logic

---

#### **subscription.ts**
**Purpose**: Handle plan upgrade/downgrade

**Flow**:
1. User selects new plan on Pricing page
2. Frontend calls `subscription.createCheckout`
3. Backend creates Stripe subscription session
4. User completes payment
5. Webhook updates user's subscription tier

**When to modify**:
- Change subscription flow
- Add proration logic
- Modify plan switching

---

#### **webhook.ts**
**Purpose**: Handle Stripe webhook events

**Events Handled**:
- `checkout.session.completed` → Create purchase
- `customer.subscription.updated` → Update subscription
- `customer.subscription.deleted` → Cancel subscription
- `charge.refunded` → Process refunds

**When to modify**:
- Add new event handlers
- Change event processing
- Add new logic

---

### Framework Internals (server/_core/)

**⚠️ Generally don't modify these unless extending the framework**

#### **index.ts**
**Purpose**: Express server setup and route registration

**Includes**:
- Express app initialization
- Middleware setup
- tRPC route registration
- Stripe webhook route (raw body parsing)
- Static file serving

**When to modify**:
- Add new middleware
- Add new routes
- Change server config

---

#### **context.ts**
**Purpose**: tRPC context - injects authenticated user into procedures

**Provides**:
```ts
{
  user: User | null,  // Current authenticated user
  req: Request,
  res: Response,
}
```

**When to modify**:
- Add new context data
- Change auth logic

---

#### **trpc.ts**
**Purpose**: Define tRPC procedures (public, protected, admin)

**Procedure Types**:
```ts
publicProcedure      // Anyone can call
protectedProcedure   // Must be authenticated
adminProcedure       // Must be admin user
```

**When to modify**:
- Add new procedure types
- Change permission logic

---

#### **env.ts**
**Purpose**: Environment variables with type safety

**Exported Variables**:
```ts
export const ENV = {
  databaseUrl: string,
  jwtSecret: string,
  stripeSecretKey: string,
  stripePublishableKey: string,
  oauthServerUrl: string,
  ownerOpenId: string,
  ownerName: string,
  // ... more
};
```

**When to modify**:
- Add new env variables
- Change validation

---

### Tests (server/*.test.ts)

#### **auth.logout.test.ts**
**Purpose**: Test logout functionality

**When to modify**:
- Add new auth tests
- Change test logic

---

#### **teams.test.ts**
**Purpose**: Test team features

**When to modify**:
- Add new team tests

---

#### **stripe/webhook.test.ts**
**Purpose**: Test Stripe webhook handling

**When to modify**:
- Add new webhook tests

---

## Database Files - Detailed

### Schema (drizzle/schema.ts)

**Purpose**: Define all database tables and their relationships

**Tables Included**:

#### **users**
```ts
{
  id: int (primary key),
  openId: string (unique),
  name: string,
  email: string,
  role: enum ("user" | "admin"),
  bio: string,
  avatarUrl: string,
  website: string,
  subscriptionTier: enum ("free" | "pro" | "master"),
  stripeCustomerId: string,
  totalEarnings: decimal,
  totalSales: int,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

#### **listings**
```ts
{
  id: int (primary key),
  sellerId: int (foreign key),
  title: string,
  slug: string (unique),
  description: string,
  category: enum ("function" | "template" | "application" | "dataset"),
  price: decimal,
  fileUrl: string,
  fileKey: string,
  previewImages: json (array),
  demoVideoUrl: string,      // NEW FIELD
  demoVideoKey: string,      // NEW FIELD
  status: enum ("draft" | "pending" | "approved" | "rejected"),
  viewCount: int,
  downloadCount: int,
  purchaseCount: int,
  avgRating: decimal,
  reviewCount: int,
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

#### **purchases**
```ts
{
  id: int (primary key),
  buyerId: int (foreign key),
  listingId: int (foreign key),
  sellerId: int (foreign key),
  amount: decimal,
  platformFee: decimal,
  sellerEarnings: decimal,
  stripePaymentId: string,
  status: enum ("pending" | "completed" | "refunded"),
  refundedAt: timestamp,
  createdAt: timestamp,
}
```

#### **aiProjects**
```ts
{
  id: int (primary key),
  userId: int (foreign key),
  title: string,
  description: string,
  modelType: enum ("imageClassification"),
  status: enum ("draft" | "training" | "trained" | "deployed"),
  trainingProgress: int (0-100),
  modelAccuracy: decimal,
  datasetSize: int,
  modelUrl: string,
  modelKey: string,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

#### **teams**
```ts
{
  id: int (primary key),
  name: string,
  ownerId: int (foreign key),
  description: string,
  createdAt: timestamp,
}
```

#### **teamMembers**
```ts
{
  id: int (primary key),
  teamId: int (foreign key),
  userId: int (foreign key),
  role: enum ("owner" | "admin" | "editor" | "viewer"),
  joinedAt: timestamp,
}
```

#### **reviews**
```ts
{
  id: int (primary key),
  listingId: int (foreign key),
  buyerId: int (foreign key),
  rating: int (1-5),
  accuracy: int (1-5),
  usability: int (1-5),
  documentation: int (1-5),
  support: int (1-5),
  comment: string,
  createdAt: timestamp,
}
```

#### **customProjects**
```ts
{
  id: int (primary key),
  requesterId: int (foreign key),
  title: string,
  description: string,
  budget: decimal,
  timeline: string,
  status: enum ("open" | "assigned" | "completed"),
  createdAt: timestamp,
}
```

#### **datasets**
```ts
{
  id: int (primary key),
  providerId: int (foreign key),
  title: string,
  description: string,
  category: enum ("images" | "audio" | "text" | "timeseries" | "tabular"),
  price: decimal,
  dataSize: int,
  recordCount: int,
  qualityScore: decimal (0-100),
  license: enum ("commercial" | "academic" | "personal"),
  previewUrl: string,
  dataUrl: string,
  createdAt: timestamp,
}
```

**When to modify**:
- Add new tables
- Add new fields to existing tables
- Change field types
- Add new relationships

**After modifying**:
- Run `pnpm db:push` to migrate

---

### Migrations (drizzle/migrations/)

**Purpose**: Track database schema changes over time

**Files**:
- `0001_*.sql` - Initial schema
- `0002_*.sql` - Add listings, purchases
- `0003_*.sql` - Add AI projects, teams
- `0004_*.sql` - Add demo video fields

**When to modify**:
- Generally don't edit manually
- Let Drizzle generate them via `pnpm db:push`

---

## Configuration Files - Detailed

### **package.json**

**Purpose**: Define dependencies and scripts

**Key Scripts**:
```json
{
  "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
  "build": "vite build && esbuild ...",
  "start": "NODE_ENV=production node dist/index.js",
  "test": "vitest run",
  "db:push": "drizzle-kit generate && drizzle-kit migrate"
}
```

**When to modify**:
- Add new dependencies
- Add new scripts
- Change versions

---

### **vite.config.ts**

**Purpose**: Frontend build configuration

**Key Settings**:
- React plugin
- Tailwind CSS plugin
- Build output directory
- Dev server settings

**When to modify**:
- Change build settings
- Add new plugins
- Change dev server port

---

### **tsconfig.json**

**Purpose**: TypeScript configuration

**Key Settings**:
- Compiler options
- Module resolution
- Path aliases (@/ for src/)

**When to modify**:
- Add new path aliases
- Change compiler options

---

### **drizzle.config.ts**

**Purpose**: Drizzle ORM configuration

**Key Settings**:
- Database connection
- Schema location
- Migration directory

**When to modify**:
- Change database
- Change schema location

---

### **tailwind.config.ts**

**Purpose**: Tailwind CSS configuration

**Key Settings**:
- Color theme
- Spacing scale
- Plugins (shadcn/ui)

**When to modify**:
- Change colors
- Add new utilities
- Add new plugins

---

### **.env.example**

**Purpose**: Example environment variables

**When to modify**:
- Add new env variables
- Update documentation

---

---

## Moving to VSCode - Step by Step

### Step 1: Export the Project from Manus

1. Go to the Manus Management UI
2. Click **Code** panel
3. Click **Download all files**
4. Extract the ZIP file to your desired location

### Step 2: Install Prerequisites

**On your local machine, install:**

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **pnpm** (package manager)
   ```bash
   npm install -g pnpm
   ```
   - Verify: `pnpm --version`

3. **Git** (version control)
   - Download from https://git-scm.com/
   - Verify: `git --version`

4. **VSCode** (code editor)
   - Download from https://code.visualstudio.com/

### Step 3: Open Project in VSCode

1. Open VSCode
2. File → Open Folder
3. Select the `botmarket` folder
4. VSCode will index the project

### Step 4: Install Dependencies

Open terminal in VSCode (Ctrl+` or View → Terminal)

```bash
# Navigate to project directory
cd botmarket

# Install dependencies
pnpm install
```

This downloads all npm packages listed in `package.json`.

### Step 5: Set Up Environment Variables

1. Create `.env.local` file in project root
2. Copy from `.env.example`
3. Fill in your values:

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
OWNER_OPEN_ID=your-open-id
OWNER_NAME=Your Name
```

### Step 6: Set Up Database

```bash
# Push schema to database
pnpm db:push
```

This creates all tables in your MySQL database.

### Step 7: Start Development Server

```bash
# Start dev server
pnpm dev
```

Output:
```
> botmarket@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

Open http://localhost:3000 in your browser.

### Step 8: Run Tests

```bash
# Run all tests
pnpm test
```

Expected output:
```
Test Files  3 passed (3)
     Tests  13 passed (13)
```

### Step 9: VSCode Extensions (Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - By dsznajder.es7-react-js-snippets

2. **Tailwind CSS IntelliSense**
   - By bradlc.vscode-tailwindcss

3. **TypeScript Vue Plugin (Volar)**
   - By Vue.volar

4. **Prettier - Code formatter**
   - By esbenp.prettier-vscode

5. **ESLint**
   - By dbaeumer.vscode-eslint

6. **Thunder Client** (for API testing)
   - By rangav.vscode-thunder-client

### Step 10: Configure VSCode Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Running Locally - Common Commands

### Development

```bash
# Start dev server (with hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Format code
pnpm format

# Type check
pnpm check
```

### Database

```bash
# Generate migrations and apply
pnpm db:push

# View database in GUI (if using better-sqlite3)
pnpm db:studio
```

### Debugging

**In VSCode:**
1. Add breakpoint (click line number)
2. Run → Start Debugging (F5)
3. Step through code

**In Browser Console:**
```js
// Access tRPC client
window.trpc

// Call API
await window.trpc.listings.search.query({ query: "test" })
```

---

## File Modification Workflow

### To Add a New Feature:

1. **Update Database** (if needed)
   - Edit `drizzle/schema.ts`
   - Run `pnpm db:push`

2. **Add Backend API**
   - Edit `server/routers.ts`
   - Add query/mutation procedure

3. **Add Frontend UI**
   - Create/edit page in `client/src/pages/`
   - Call API with `trpc.*.useQuery/useMutation`

4. **Test**
   - Run `pnpm test`
   - Test in browser at http://localhost:3000

5. **Format & Commit**
   - Run `pnpm format`
   - Commit to git

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Verify MySQL is running
# Test connection: mysql -u user -p -h host
```

### TypeScript Errors
```bash
# Check types
pnpm check

# Fix types
pnpm format
```

### Dependencies Issue
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Summary

**Key Files to Remember**:
- `server/routers.ts` → All API endpoints
- `drizzle/schema.ts` → Database tables
- `client/src/pages/` → UI pages
- `client/src/index.css` → Global styles
- `package.json` → Dependencies & scripts

**Common Workflows**:
- Add feature → Update schema → Add API → Add UI → Test
- Change styling → Edit `index.css` or component Tailwind classes
- Fix bug → Find file → Make change → Test → Commit

**Development Loop**:
```
1. Make code changes
2. Save file (auto-reload)
3. Test in browser
4. Run tests: pnpm test
5. Format: pnpm format
6. Commit to git
```

Happy coding! 🚀
