// Seed data for Swarm marketplace
// Run with: npx tsx server/seed-marketplace.ts

import { drizzle } from "drizzle-orm/mysql2";
import { listings, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const SEED_LISTINGS = [
  // CODE/FUNCTION STORE
  {
    title: "Image Resize & Optimize",
    slug: "image-resize-optimize-func",
    description: `A powerful image processing function that handles resizing, compression, and format conversion.

## Features
- Resize images to any dimension while maintaining aspect ratio
- Compress images with configurable quality settings
- Convert between PNG, JPEG, WebP, and AVIF formats
- Batch processing support
- Memory-efficient streaming for large files

## Usage
\`\`\`javascript
import { resizeImage } from './image-resize';

const result = await resizeImage({
  input: './photo.jpg',
  width: 800,
  quality: 85,
  format: 'webp'
});
\`\`\`

## Requirements
- Node.js 18+
- Sharp library (included)`,
    shortDescription: "Resize, compress, and convert images with ease. Supports PNG, JPEG, WebP, AVIF.",
    category: "function" as const,
    tags: ["image", "resize", "compress", "webp", "optimization"],
    price: "9.99",
    isFree: false,
    language: "TypeScript",
    framework: "Node.js",
    version: "2.1.0",
    status: "approved" as const,
    viewCount: 1250,
    downloadCount: 342,
    purchaseCount: 156,
    avgRating: "4.75",
    reviewCount: 28,
  },
  {
    title: "PDF Generator & Merger",
    slug: "pdf-generator-merger-func",
    description: `Generate professional PDFs from HTML/Markdown and merge multiple PDFs into one.

## Features
- Convert HTML to PDF with CSS styling support
- Markdown to PDF conversion
- Merge multiple PDFs into a single document
- Add watermarks and page numbers
- Custom headers and footers
- Table of contents generation

## Usage
\`\`\`javascript
import { generatePDF, mergePDFs } from './pdf-tools';

// Generate from HTML
const pdf = await generatePDF({
  html: '<h1>Report</h1><p>Content here...</p>',
  options: { format: 'A4', margin: '1cm' }
});

// Merge PDFs
const merged = await mergePDFs(['doc1.pdf', 'doc2.pdf']);
\`\`\``,
    shortDescription: "Generate PDFs from HTML/Markdown and merge multiple PDFs. Professional quality output.",
    category: "function" as const,
    tags: ["pdf", "document", "html", "merge", "generator"],
    price: "14.99",
    isFree: false,
    language: "TypeScript",
    framework: "Node.js",
    version: "1.8.0",
    status: "approved" as const,
    viewCount: 890,
    downloadCount: 234,
    purchaseCount: 98,
    avgRating: "4.60",
    reviewCount: 19,
  },
  {
    title: "Data Validation Library",
    slug: "data-validation-lib",
    description: `Comprehensive data validation library with schema definition and error reporting.

## Features
- Type-safe schema definitions
- Custom validation rules
- Detailed error messages
- Async validation support
- Nested object validation
- Array validation with item rules

## Usage
\`\`\`javascript
import { schema, validate } from './validator';

const userSchema = schema({
  email: { type: 'email', required: true },
  age: { type: 'number', min: 18, max: 120 },
  tags: { type: 'array', items: { type: 'string' } }
});

const result = validate(data, userSchema);
\`\`\``,
    shortDescription: "Type-safe data validation with custom rules, async support, and detailed errors.",
    category: "function" as const,
    tags: ["validation", "schema", "typescript", "forms", "api"],
    price: "0.00",
    isFree: true,
    language: "TypeScript",
    framework: "Universal",
    version: "3.2.1",
    status: "approved" as const,
    viewCount: 2340,
    downloadCount: 1567,
    purchaseCount: 0,
    avgRating: "4.90",
    reviewCount: 67,
  },
  {
    title: "CSV Parser & Exporter",
    slug: "csv-parser-exporter",
    description: `Fast and reliable CSV parsing and export with streaming support for large files.

## Features
- Parse CSV files with automatic type detection
- Stream large files without memory issues
- Export data to CSV with custom formatting
- Handle different delimiters and encodings
- Skip rows, filter columns
- Progress callbacks for large files`,
    shortDescription: "Parse and export CSV files with streaming support. Handles millions of rows.",
    category: "function" as const,
    tags: ["csv", "parser", "export", "data", "streaming"],
    price: "7.99",
    isFree: false,
    language: "JavaScript",
    framework: "Node.js",
    version: "2.0.0",
    status: "approved" as const,
    viewCount: 678,
    downloadCount: 189,
    purchaseCount: 72,
    avgRating: "4.50",
    reviewCount: 14,
  },

  // TEMPLATE STORE
  {
    title: "SaaS Dashboard Starter",
    slug: "saas-dashboard-starter-template",
    description: `Complete SaaS dashboard template with authentication, billing, and team management.

## Included Features
- User authentication (OAuth, email/password)
- Stripe subscription billing
- Team management with roles
- Admin dashboard
- User settings page
- Responsive design
- Dark/light mode

## Tech Stack
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- tRPC for API
- Drizzle ORM
- Stripe integration`,
    shortDescription: "Full-featured SaaS starter with auth, billing, teams, and admin panel.",
    category: "template" as const,
    tags: ["saas", "dashboard", "react", "stripe", "authentication"],
    price: "49.99",
    isFree: false,
    language: "TypeScript",
    framework: "React",
    version: "1.5.0",
    status: "approved" as const,
    viewCount: 3450,
    downloadCount: 567,
    purchaseCount: 234,
    avgRating: "4.85",
    reviewCount: 45,
  },
  {
    title: "E-commerce Store Template",
    slug: "ecommerce-store-template",
    description: `Modern e-commerce template with product catalog, cart, and checkout.

## Features
- Product catalog with categories
- Shopping cart with persistence
- Checkout flow with Stripe
- Order management
- Inventory tracking
- Customer reviews
- Search and filtering`,
    shortDescription: "Complete e-commerce solution with cart, checkout, and order management.",
    category: "template" as const,
    tags: ["ecommerce", "shop", "cart", "stripe", "products"],
    price: "39.99",
    isFree: false,
    language: "TypeScript",
    framework: "Next.js",
    version: "2.1.0",
    status: "approved" as const,
    viewCount: 2890,
    downloadCount: 456,
    purchaseCount: 189,
    avgRating: "4.70",
    reviewCount: 38,
  },

  // APPLICATION STORE
  {
    title: "Invoice Generator Pro",
    slug: "invoice-generator-pro-app",
    description: `Professional invoice generation application with PDF export and client management.

## Features
- Create professional invoices
- Client database management
- Automatic tax calculations
- Multiple currency support
- PDF export with custom branding
- Payment tracking
- Recurring invoices
- Email invoices directly`,
    shortDescription: "Create professional invoices with PDF export, client management, and payment tracking.",
    category: "application" as const,
    tags: ["invoice", "billing", "pdf", "business", "finance"],
    price: "29.99",
    isFree: false,
    language: "TypeScript",
    framework: "React",
    version: "3.0.0",
    status: "approved" as const,
    viewCount: 1890,
    downloadCount: 345,
    purchaseCount: 156,
    avgRating: "4.80",
    reviewCount: 32,
  },
  {
    title: "Task Manager Bot",
    slug: "task-manager-bot-app",
    description: `AI-powered task management bot that helps organize and prioritize your work.

## Features
- Natural language task input
- Smart priority suggestions
- Due date reminders
- Project organization
- Team collaboration
- Progress tracking
- Daily/weekly summaries`,
    shortDescription: "AI-powered task management with smart prioritization and team collaboration.",
    category: "application" as const,
    tags: ["tasks", "productivity", "ai", "collaboration", "bot"],
    price: "19.99",
    isFree: false,
    language: "Python",
    framework: "FastAPI",
    version: "1.2.0",
    status: "approved" as const,
    viewCount: 1234,
    downloadCount: 278,
    purchaseCount: 112,
    avgRating: "4.55",
    reviewCount: 21,
  },
  {
    title: "File Organizer Tool",
    slug: "file-organizer-tool",
    description: `Automatically organize files by type, date, or custom rules.

## Features
- Organize by file type
- Date-based organization
- Custom rule engine
- Duplicate detection
- Batch renaming
- Undo support
- Watch folders`,
    shortDescription: "Automatically organize files with custom rules, duplicate detection, and batch renaming.",
    category: "application" as const,
    tags: ["files", "organizer", "automation", "productivity", "utility"],
    price: "0.00",
    isFree: true,
    language: "Python",
    framework: "CLI",
    version: "2.0.0",
    status: "approved" as const,
    viewCount: 4567,
    downloadCount: 2345,
    purchaseCount: 0,
    avgRating: "4.65",
    reviewCount: 89,
  },

  // DATA MARKETPLACE
  {
    title: "Product Images Dataset",
    slug: "product-images-dataset",
    description: `High-quality product images dataset for e-commerce AI training.

## Dataset Details
- 50,000+ product images
- 20 categories (electronics, clothing, furniture, etc.)
- Multiple angles per product
- Clean backgrounds
- Consistent lighting
- 1024x1024 resolution

## Use Cases
- Product classification
- Visual search
- Image generation training
- Quality assessment models`,
    shortDescription: "50,000+ high-quality product images across 20 categories for AI training.",
    category: "dataset" as const,
    tags: ["images", "products", "ecommerce", "classification", "training"],
    price: "79.99",
    isFree: false,
    language: "N/A",
    framework: "N/A",
    version: "1.0.0",
    status: "approved" as const,
    viewCount: 890,
    downloadCount: 123,
    purchaseCount: 45,
    avgRating: "4.70",
    reviewCount: 12,
  },
  {
    title: "Customer Reviews Dataset",
    slug: "customer-reviews-dataset",
    description: `Labeled customer review dataset for sentiment analysis training.

## Dataset Details
- 100,000+ reviews
- Sentiment labels (positive, negative, neutral)
- Star ratings (1-5)
- Multiple product categories
- Cleaned and preprocessed
- Train/test split included

## Use Cases
- Sentiment analysis
- Review classification
- Opinion mining
- Customer feedback analysis`,
    shortDescription: "100,000+ labeled customer reviews for sentiment analysis and NLP training.",
    category: "dataset" as const,
    tags: ["reviews", "sentiment", "nlp", "text", "classification"],
    price: "49.99",
    isFree: false,
    language: "N/A",
    framework: "N/A",
    version: "2.1.0",
    status: "approved" as const,
    viewCount: 1234,
    downloadCount: 189,
    purchaseCount: 67,
    avgRating: "4.60",
    reviewCount: 18,
  },
  {
    title: "Sample Audio Dataset",
    slug: "sample-audio-dataset",
    description: `Free sample audio dataset for sound classification experiments.

## Dataset Details
- 1,000 audio clips
- 10 sound categories
- WAV format, 16kHz
- 3-5 seconds each
- Labeled and cleaned

## Categories
Environmental sounds, music genres, speech samples, animal sounds, and more.`,
    shortDescription: "Free sample audio dataset with 1,000 clips across 10 categories.",
    category: "dataset" as const,
    tags: ["audio", "sound", "classification", "free", "sample"],
    price: "0.00",
    isFree: true,
    language: "N/A",
    framework: "N/A",
    version: "1.0.0",
    status: "approved" as const,
    viewCount: 2345,
    downloadCount: 1890,
    purchaseCount: 0,
    avgRating: "4.40",
    reviewCount: 34,
  },
];

async function seedMarketplace() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);
  
  console.log("🌱 Seeding Swarm marketplace...");

  // First, get or create a system seller account
  let systemSeller = await db.select().from(users).where(eq(users.openId, "system-seller")).limit(1);
  
  let sellerId: number;
  if (systemSeller.length === 0) {
    console.log("Creating system seller account...");
    await db.insert(users).values({
      openId: "system-seller",
      name: "Swarm Official",
      email: "official@swarm.ai",
      role: "admin",
    });
    const newSeller = await db.select().from(users).where(eq(users.openId, "system-seller")).limit(1);
    sellerId = newSeller[0].id;
  } else {
    sellerId = systemSeller[0].id;
  }

  console.log(`Using seller ID: ${sellerId}`);

  // Insert listings
  for (const listing of SEED_LISTINGS) {
    try {
      // Check if listing already exists
      const existing = await db.select().from(listings).where(eq(listings.slug, listing.slug)).limit(1);
      
      if (existing.length > 0) {
        console.log(`⏭️  Skipping existing: ${listing.title}`);
        continue;
      }

      await db.insert(listings).values({
        ...listing,
        sellerId,
        publishedAt: new Date(),
      });
      console.log(`✅ Created: ${listing.title}`);
    } catch (error) {
      console.error(`❌ Failed to create ${listing.title}:`, error);
    }
  }

  console.log("\n🎉 Seeding complete!");
  process.exit(0);
}

seedMarketplace().catch(console.error);
