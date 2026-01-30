# Complete Guide: Moving Swarm to VSCode

This guide provides comprehensive step-by-step instructions to move your Swarm project from Manus to your local machine and run it in Visual Studio Code.

**Estimated Time:** 30-45 minutes

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Step 1: Download Project from Manus](#step-1-download-project-from-manus)
3. [Step 2: Install Prerequisites](#step-2-install-prerequisites)
4. [Step 3: Extract and Organize Project](#step-3-extract-and-organize-project)
5. [Step 4: Install VSCode](#step-4-install-vscode)
6. [Step 5: Open Project in VSCode](#step-5-open-project-in-vscode)
7. [Step 6: Install Dependencies](#step-6-install-dependencies)
8. [Step 7: Configure Environment Variables](#step-7-configure-environment-variables)
9. [Step 8: Set Up Database](#step-8-set-up-database)
10. [Step 9: Start Development Server](#step-9-start-development-server)
11. [Step 10: Verify Installation](#step-10-verify-installation)
12. [Troubleshooting](#troubleshooting)
13. [Next Steps](#next-steps)

---

## System Requirements

Before starting, ensure your computer meets these requirements:

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **RAM** | 4 GB | 8 GB or more |
| **Disk Space** | 2 GB free | 5 GB free |
| **Internet** | Required | Required |
| **OS** | Windows 10+, macOS 10.15+, Linux | Windows 11, macOS 12+, Linux (Ubuntu 20+) |

**Operating System Support:**
- **Windows:** Windows 10 or later
- **macOS:** macOS 10.15 (Catalina) or later
- **Linux:** Ubuntu 20.04 or later, Fedora 30+, Debian 10+

---

## Step 1: Download Project from Manus

### 1.1 Access Manus Management UI

1. **Open your Manus project**
   - Go to your Manus dashboard: https://manus.im
   - Log in with your credentials
   - Select your "Swarm" project

2. **Navigate to Code Panel**
   - On the right side of the screen, you'll see the Management UI
   - Click the **"Code"** panel button
   - You'll see a file tree showing all project files

### 1.2 Download All Files

1. **Click "Download all files"**
   - Look for the download button in the Code panel
   - A ZIP file named `botmarket.zip` will download to your Downloads folder
   - Wait for the download to complete (usually 30-60 seconds)

2. **Verify the download**
   - Check your Downloads folder
   - You should see `botmarket.zip` (typically 5-15 MB)

### 1.3 Save the ZIP File

1. **Create a Projects folder** (optional but recommended)
   - **Windows:** Create `C:\Users\YourUsername\Projects\`
   - **macOS:** Create `~/Projects/`
   - **Linux:** Create `~/Projects/`

2. **Move the ZIP file**
   - Cut (Ctrl+X) or copy the `botmarket.zip` from Downloads
   - Paste it into your Projects folder

---

## Step 2: Install Prerequisites

You need three tools before proceeding: Node.js, pnpm, and Git (optional).

### 2.1 Install Node.js

**Node.js** is the JavaScript runtime that powers your development environment.

#### Windows:

1. **Download Node.js**
   - Go to https://nodejs.org/
   - Click the **"LTS"** (Long Term Support) button
   - This downloads the installer (`.msi` file)

2. **Run the installer**
   - Double-click the downloaded `.msi` file
   - Click **"Next"** through all screens
   - Accept the license agreement
   - Use default installation path: `C:\Program Files\nodejs\`
   - Click **"Install"** and wait for completion
   - Click **"Finish"**

3. **Restart your computer**
   - This ensures Node.js is added to your system PATH

#### macOS:

1. **Download Node.js**
   - Go to https://nodejs.org/
   - Click the **"LTS"** button
   - Download the `.pkg` file for macOS

2. **Run the installer**
   - Double-click the `.pkg` file
   - Follow the installation wizard
   - Enter your password when prompted
   - Click **"Install"**

3. **Restart your computer** (recommended)

#### Linux (Ubuntu/Debian):

1. **Open Terminal**
   - Press `Ctrl+Alt+T`

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Verify installation**
   ```bash
   node --version
   npm --version
   ```

### 2.2 Verify Node.js Installation

After installation, verify it worked:

#### Windows Command Prompt:

1. **Open Command Prompt**
   - Press `Windows Key + R`
   - Type `cmd`
   - Press Enter

2. **Check Node.js version**
   ```bash
   node --version
   ```
   - Should show: `v18.x.x` or higher (e.g., `v20.10.0`)

3. **Check npm version**
   ```bash
   npm --version
   ```
   - Should show: `9.x.x` or higher

#### macOS/Linux Terminal:

1. **Open Terminal**
   - **macOS:** Press `Cmd+Space`, type "Terminal", press Enter
   - **Linux:** Press `Ctrl+Alt+T`

2. **Check versions**
   ```bash
   node --version
   npm --version
   ```

### 2.3 Install pnpm (Package Manager)

**pnpm** is a faster, more efficient package manager than npm.

#### All Operating Systems:

1. **Open Terminal/Command Prompt**
   - **Windows:** Command Prompt or PowerShell
   - **macOS/Linux:** Terminal

2. **Install pnpm globally**
   ```bash
   npm install -g pnpm
   ```
   - This takes 1-2 minutes
   - You'll see progress output

3. **Verify installation**
   ```bash
   pnpm --version
   ```
   - Should show: `10.x.x` or higher (e.g., `10.15.1`)

### 2.4 Install Git (Optional but Recommended)

**Git** allows you to version control your code and collaborate with others.

#### Windows:

1. **Download Git**
   - Go to https://git-scm.com/download/win
   - Download the installer

2. **Run installer**
   - Double-click the installer
   - Click **"Next"** through all screens
   - Use default settings
   - Click **"Finish"**

#### macOS:

1. **Install Git**
   - Open Terminal
   - Run: `xcode-select --install`
   - Click **"Install"** when prompted

#### Linux:

1. **Install Git**
   ```bash
   sudo apt-get install git
   ```

---

## Step 3: Extract and Organize Project

### 3.1 Extract the ZIP File

#### Windows:

1. **Navigate to your Projects folder**
   - Open File Explorer
   - Go to `C:\Users\YourUsername\Projects\`

2. **Extract the ZIP**
   - Right-click `botmarket.zip`
   - Select **"Extract All..."**
   - Choose destination: `C:\Users\YourUsername\Projects\`
   - Click **"Extract"**
   - Wait for extraction to complete (30-60 seconds)

3. **Verify extraction**
   - You should now see a folder named `botmarket`
   - Inside should be: `client/`, `server/`, `drizzle/`, `package.json`, etc.

#### macOS:

1. **Navigate to Projects folder**
   - Open Finder
   - Press `Cmd+Shift+H` to go to home folder
   - Create `Projects` folder if it doesn't exist
   - Go into `Projects` folder

2. **Extract the ZIP**
   - Double-click `botmarket.zip`
   - macOS automatically extracts it
   - A `botmarket` folder appears

#### Linux:

1. **Open Terminal**
   - Press `Ctrl+Alt+T`

2. **Extract the ZIP**
   ```bash
   cd ~/Projects
   unzip botmarket.zip
   ```

3. **Verify extraction**
   ```bash
   ls -la botmarket/
   ```

### 3.2 Verify Project Structure

After extraction, verify the folder structure:

```
botmarket/
├── client/                    ← Frontend React code
│   ├── src/
│   │   ├── pages/            ← Page components
│   │   ├── components/       ← Reusable components
│   │   └── index.css         ← Global styles
│   └── public/               ← Static assets
├── server/                    ← Backend code
│   ├── routers.ts            ← API endpoints
│   ├── db.ts                 ← Database queries
│   └── _core/                ← Core server logic
├── drizzle/                   ← Database schema
│   └── schema.ts             ← Table definitions
├── package.json              ← Dependencies
├── pnpm-lock.yaml            ← Dependency lock file
├── tsconfig.json             ← TypeScript config
├── vite.config.ts            ← Build config
└── VSCODE_QUICKSTART.md      ← Quick start guide
```

If you see this structure, extraction was successful! ✅

---

## Step 4: Install VSCode

**Visual Studio Code** is the code editor where you'll write and edit code.

### 4.1 Download VSCode

1. **Go to VSCode website**
   - Visit https://code.visualstudio.com/

2. **Download for your OS**
   - Click the large blue **"Download"** button
   - It automatically detects your operating system
   - Choose the correct version:
     - **Windows:** `Windows` (64-bit or 32-bit)
     - **macOS:** `Mac` (Intel or Apple Silicon)
     - **Linux:** `Linux` (choose your distribution)

### 4.2 Install VSCode

#### Windows:

1. **Run the installer**
   - Double-click `VSCodeSetup-x64-*.exe`
   - Click **"I accept the agreement"**
   - Click **"Next"**
   - Use default installation path
   - Check **"Add to PATH"** (important!)
   - Click **"Install"**
   - Click **"Finish"**

2. **Launch VSCode**
   - Click **"Launch Visual Studio Code"**
   - Or search for "Visual Studio Code" in Start menu

#### macOS:

1. **Extract and install**
   - Double-click the downloaded `.zip` file
   - Drag `Visual Studio Code.app` to Applications folder
   - Wait for copy to complete

2. **Launch VSCode**
   - Open Applications folder
   - Double-click `Visual Studio Code`
   - Click **"Open"** if prompted

#### Linux:

1. **Install VSCode**
   ```bash
   sudo apt-get install code
   ```

2. **Launch VSCode**
   ```bash
   code
   ```

### 4.3 Verify VSCode Installation

1. **Open VSCode**
   - You should see the Welcome screen
   - Left sidebar with icons
   - File explorer panel

2. **Check VSCode version**
   - Click **"Help"** → **"About"**
   - Should show version 1.80+ or higher

---

## Step 5: Open Project in VSCode

### 5.1 Open the Botmarket Folder

#### Method 1: Using File Menu

1. **Click File menu**
   - Top left of VSCode window

2. **Select "Open Folder"**
   - A file browser opens

3. **Navigate to botmarket**
   - **Windows:** Go to `C:\Users\YourUsername\Projects\botmarket`
   - **macOS:** Go to `~/Projects/botmarket`
   - **Linux:** Go to `~/Projects/botmarket`

4. **Click "Select Folder"**
   - VSCode loads the project
   - This takes 30-60 seconds

#### Method 2: Using Command Line

1. **Open Terminal/Command Prompt**
   - **Windows:** Press `Windows Key + R`, type `cmd`, press Enter
   - **macOS/Linux:** Open Terminal

2. **Navigate to project**
   ```bash
   cd ~/Projects/botmarket
   ```
   (or `C:\Users\YourUsername\Projects\botmarket` on Windows)

3. **Open in VSCode**
   ```bash
   code .
   ```
   - VSCode opens with the project loaded

### 5.2 Verify Project Loaded

After opening, you should see:

1. **File Explorer (left sidebar)**
   - Shows all project folders and files
   - Can expand/collapse folders

2. **Welcome tab**
   - Shows "Welcome to Visual Studio Code"
   - You can close this tab

3. **Status Bar (bottom)**
   - Shows "No folder" changes to your project name
   - Shows branch name if Git is initialized

---

## Step 6: Install Dependencies

### 6.1 Open Terminal in VSCode

1. **Open integrated terminal**
   - Press `` Ctrl+` `` (backtick key)
   - Or go to **View** → **Terminal**
   - A terminal panel opens at the bottom

2. **Verify you're in the right directory**
   - Terminal should show: `botmarket>` or `botmarket $`
   - If not, type: `cd botmarket` and press Enter

### 6.2 Install All Dependencies

1. **Run pnpm install**
   ```bash
   pnpm install
   ```

2. **Wait for installation**
   - This takes 2-5 minutes depending on internet speed
   - You'll see progress output:
     ```
     Packages in scope: botmarket
     Lockfile is up-to-date, resolution step is skipped
     Packages: +500
     ++++++++++++++++++++++++++++++++++++++++++++++++++++
     Progress: resolved 500, reused 500, downloaded 0, added 500
     ```

3. **Verify completion**
   - Should end with: `done in Xs`
   - No error messages (red text)
   - Terminal prompt returns

### 6.3 What Was Installed?

The `pnpm install` command installed:

- **Frontend dependencies:** React, Tailwind CSS, shadcn/ui, tRPC client
- **Backend dependencies:** Express, tRPC server, Drizzle ORM
- **Development tools:** TypeScript, Vite, Vitest, Prettier

All dependencies are listed in `package.json`.

---

## Step 7: Configure Environment Variables

### 7.1 Create .env.local File

1. **In VSCode file explorer**
   - Right-click in the empty space (left sidebar)
   - Select **"New File"**
   - Name it: `.env.local`
   - Press Enter

2. **Verify file created**
   - You should see `.env.local` in the file explorer
   - It's highlighted in the editor

### 7.2 Add Environment Variables

Copy and paste this into your `.env.local` file:

```env
# Database (REQUIRED)
# Replace with your MySQL connection string
DATABASE_URL=mysql://username:password@localhost:3306/swarm

# Authentication (REQUIRED)
# Generate a secure secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-key-change-this-in-production

# Stripe (OPTIONAL - for payments)
# Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
NODE_ENV=development
PORT=3000
```

**Important Notes:**
- This is a LOCAL-ONLY version - no Manus services required
- You must provide your own MySQL database
- Stripe is optional but needed for payments
- Generate a secure JWT_SECRET for production

---

## Step 8: Set Up Database

### 8.1 Install MySQL

You need a MySQL database. Choose one option:

#### Option A: Local MySQL Server

1. **Download MySQL**
   - Go to https://dev.mysql.com/downloads/mysql/
   - Download MySQL Community Server
   - Install with default settings

2. **Create database**
   ```sql
   CREATE DATABASE swarm;
   CREATE USER 'swarm'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON swarm.* TO 'swarm'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update DATABASE_URL**
   ```
   DATABASE_URL=mysql://swarm:your_password@localhost:3306/swarm
   ```

#### Option B: Cloud MySQL (PlanetScale, Railway, etc.)

1. **Create account** at PlanetScale, Railway, or similar
2. **Create a MySQL database**
3. **Copy connection string** to DATABASE_URL

### 8.2 Push Database Schema

Run this command to create all tables:

```bash
pnpm db:push
```

You should see:
```
Pushing schema changes...
Changes applied successfully!
```

---

## Step 9: Start Development Server

### 9.1 Start the Server

```bash
pnpm dev
```

You should see:
```
Server running on http://localhost:3000/
```

### 9.2 Open in Browser

1. Open your web browser
2. Go to http://localhost:3000
3. You should see the Swarm landing page!

---

## Step 10: Verify Installation

### 10.1 Test Registration

1. Click **"Sign In"** in the top right
2. Click **"Create an account"**
3. Enter email, name, password
4. Click **"Register"**
5. You should be logged in!

### 10.2 Make Yourself Admin

Run this SQL query:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 10.3 Run Tests

```bash
pnpm test
```

All 19 tests should pass.

---

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct
- Ensure MySQL is running
- Check firewall allows port 3306

### "Module not found"
- Run `pnpm install` again
- Delete `node_modules` and reinstall

### "Port 3000 already in use"
- Kill the process: `npx kill-port 3000`
- Or change PORT in `.env.local`

### "JWT_SECRET is required"
- Make sure `.env.local` file exists with JWT_SECRET set

---

## What's Disabled (No Manus)

These features are disabled in the local version:

- LLM/AI chat
- Image generation
- Voice transcription
- Push notifications
- Maps integration

To re-enable, integrate with external APIs (OpenAI, Google Maps, etc.)

---

## Next Steps

1. **Explore the codebase** - Read DETAILED_GUIDE.md
2. **Customize the UI** - Edit files in `client/src/pages/`
3. **Add features** - Modify `server/routers.ts`
4. **Deploy** - Use Docker, Railway, or VPS

1. **Copy this template into `.env.local`:**

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# This connects to your MySQL database
# Format: mysql://username:password@host:port/database
# 
# For local development, you have options:
# 1. Use a local MySQL server
# 2. Use a cloud database (e.g., PlanetScale, AWS RDS)
# 3. Use a test database provided by your admin
#
# Ask your admin for the connection string if you don't have one

DATABASE_URL=mysql://root:password@localhost:3306/swarm

# ============================================
# STRIPE PAYMENT CONFIGURATION
# ============================================
# Get these from your Manus project Settings → Payment
# These are test keys for development (won't charge real money)

STRIPE_SECRET_KEY=sk_test_your_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret_here

# ============================================
# OAUTH & AUTHENTICATION
# ============================================
# These are provided by Manus platform
# Contact your admin if you don't have these

VITE_APP_ID=your_app_id_from_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# ============================================
# OWNER INFORMATION
# ============================================
# Your account details (the admin/owner)

OWNER_OPEN_ID=your_open_id_from_manus
OWNER_NAME=Your Full Name

# ============================================
# JWT SECRET
# ============================================
# Used for signing session tokens
# Can be any random string (at least 32 characters recommended)

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# ============================================
# FORGE API (Manus Built-in Services)
# ============================================
# These provide access to Manus services like LLM, storage, notifications
# Get these from your admin

BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key_here
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key_here
```

### 7.3 Fill in Your Values

1. **Get values from Manus**
   - Log in to Manus dashboard
   - Go to **Settings** → **Secrets**
   - Copy each value from the list
   - Paste into `.env.local`

2. **For DATABASE_URL:**
   - If you have a MySQL server running locally:
     ```
     DATABASE_URL=mysql://root:password@localhost:3306/swarm
     ```
   - If using a cloud database, use the connection string provided

3. **For Stripe keys:**
   - Go to Manus Settings → **Payment**
   - Copy the test keys (they start with `sk_test_` and `pk_test_`)

4. **For JWT_SECRET:**
   - Generate a random string (at least 32 characters)
   - Example: `your-super-secret-jwt-key-12345-change-in-prod`

### 7.4 Save the File

- Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS)
- The dot before `.env.local` disappears (indicating it's saved)

**Important:** Never commit `.env.local` to Git! It contains secrets.

---

## Step 8: Set Up Database

### 8.1 Ensure Database Connection

Before starting the server, verify your database is accessible:

1. **Check DATABASE_URL in .env.local**
   - Make sure it's filled in correctly
   - Format: `mysql://username:password@host:port/database`

2. **If using local MySQL:**
   - Ensure MySQL server is running
   - **Windows:** Check Services (services.msc)
   - **macOS:** Check System Preferences
   - **Linux:** Run `sudo systemctl status mysql`

3. **If using cloud database:**
   - Verify internet connection
   - Verify connection string is correct

### 8.2 Push Database Schema

1. **In VSCode terminal, run:**
   ```bash
   pnpm db:push
   ```

2. **What this does:**
   - Reads `drizzle/schema.ts` (your database tables)
   - Creates tables in your database
   - Generates migration files
   - Takes 10-30 seconds

3. **Verify success:**
   - Should show: `✓ Pushed database schema`
   - No error messages

### 8.3 Troubleshoot Database Issues

**If you get "Connection refused" error:**
- Check DATABASE_URL is correct
- Check MySQL server is running
- Try using `127.0.0.1` instead of `localhost`

**If you get "Access denied" error:**
- Check username and password in DATABASE_URL
- Verify MySQL user has correct permissions
- Try creating a new MySQL user:
  ```bash
  mysql -u root -p
  CREATE USER 'swarm'@'localhost' IDENTIFIED BY 'password123';
  GRANT ALL PRIVILEGES ON swarm.* TO 'swarm'@'localhost';
  FLUSH PRIVILEGES;
  ```

---

## Step 9: Start Development Server

### 9.1 Run the Development Server

1. **In VSCode terminal, run:**
   ```bash
   pnpm dev
   ```

2. **Wait for server to start**
   - Takes 5-10 seconds
   - You'll see output:
     ```
     > botmarket@1.0.0 dev
     > NODE_ENV=development tsx watch server/_core/index.ts

     [OAuth] Initialized with baseURL: https://api.manus.im
     Server running on http://localhost:3000/
     ```

3. **Server is now running!**
   - The terminal shows: `Server running on http://localhost:3000/`
   - Don't close this terminal (it keeps the server running)

### 9.2 Open in Browser

1. **Open your browser**
   - Chrome, Firefox, Safari, or Edge

2. **Go to localhost:3000**
   - Type in address bar: `http://localhost:3000`
   - Press Enter

3. **You should see the Swarm landing page**
   - Orange "Swarm" logo
   - Navigation menu: Marketplace, AI Builder, Pricing, Community, Affiliate
   - Hero section: "Build, Buy & Sell AI Solutions"
   - Two buttons: "Browse Marketplace" and "Start Building"

---

## Step 10: Verify Installation

### 10.1 Test Landing Page

1. **Check the landing page loads**
   - No errors in browser console
   - All text and images visible
   - Colors look correct (orange theme)

2. **Click "Browse Marketplace"**
   - Should show marketplace with listings
   - Listings have titles, descriptions, prices
   - Can see 12 sample listings

3. **Click "Start Building"**
   - Should show AI projects page
   - Can see "Create New Project" button
   - Shows empty projects list (or sample projects)

### 10.2 Check Terminal Output

In VSCode terminal, you should see:

```
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
[2026-01-29T10:30:45.123Z] GET / 200 - 45ms
[2026-01-29T10:30:46.456Z] GET /api/trpc/marketplace.getListings 200 - 123ms
```

- No red error messages
- Requests show `200` status (success)

### 10.3 Run Tests

1. **Open a new terminal** (keep dev server running)
   - Press `Ctrl+Shift+`` (backtick)
   - Or click the **"+"** button in terminal panel

2. **Run tests**
   ```bash
   pnpm test
   ```

3. **Expected output**
   ```
   Test Files  3 passed (3)
        Tests  13 passed (13)
   ```

✅ **Success! Your project is fully set up!**

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Port 3000 already in use"

**Error message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
Replace `<PID>` with the number shown.

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Then restart: `pnpm dev`

---

#### Issue: "Cannot find module 'react'"

**Error message:**
```
Error: Cannot find module 'react' from '/home/user/botmarket/client/src'
```

**Solution:**
```bash
pnpm install
pnpm dev
```

The dependencies weren't fully installed. Running `pnpm install` again fixes it.

---

#### Issue: "Database connection error"

**Error message:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**

1. **Check DATABASE_URL in .env.local**
   - Verify format: `mysql://user:pass@host:port/db`

2. **Verify MySQL is running**
   - **Windows:** Open Services, find MySQL, ensure it's running
   - **macOS:** Check System Preferences → MySQL
   - **Linux:** Run `sudo systemctl status mysql`

3. **Test connection manually**
   ```bash
   mysql -u root -p -h localhost
   ```

4. **If MySQL not installed:**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use cloud database (PlanetScale, AWS RDS)

---

#### Issue: "TypeScript errors in editor"

**Solution:**

1. **Close and reopen VSCode**
   - Sometimes the language server needs a restart

2. **Run TypeScript check**
   ```bash
   pnpm check
   ```

3. **If errors persist:**
   - Delete `node_modules` folder
   - Run `pnpm install` again
   - Run `pnpm dev`

---

#### Issue: "Blank page or 404 error"

**Error message:**
```
Cannot GET /
```

**Solution:**

1. **Check if server is running**
   - Terminal should show: `Server running on http://localhost:3000/`
   - If not, run `pnpm dev`

2. **Hard refresh browser**
   - **Windows/Linux:** `Ctrl+Shift+R`
   - **macOS:** `Cmd+Shift+R`

3. **Check browser console for errors**
   - Press `F12` to open Developer Tools
   - Click **Console** tab
   - Look for red error messages

---

#### Issue: "Stripe webhook error"

**Error message:**
```
Webhook returned 200 but response is not valid JSON
```

**Solution:**

1. **Verify webhook endpoint exists**
   - Should be: `http://localhost:3000/api/stripe/webhook`

2. **Check Stripe keys in .env.local**
   - Verify `STRIPE_SECRET_KEY` is filled
   - Verify `STRIPE_WEBHOOK_SECRET` is filled

3. **Restart server**
   ```bash
   # Stop: Ctrl+C in terminal
   pnpm dev
   ```

---

#### Issue: "Hot reload not working"

**Problem:** Changes to code don't automatically refresh the browser.

**Solution:**

1. **Check Vite is running**
   - Terminal should show: `Local: http://localhost:3000`

2. **Manual refresh**
   - Press `Ctrl+Shift+R` (hard refresh)

3. **Restart server**
   ```bash
   # Press Ctrl+C to stop
   pnpm dev
   ```

---

### Getting Help

If you encounter issues not listed above:

1. **Check the error message**
   - Read the full error in the terminal
   - Search the error on Google

2. **Check the logs**
   - Look at VSCode terminal output
   - Check browser console (F12)

3. **Read the guides**
   - `INTRODUCTION.md` - Project overview
   - `DETAILED_GUIDE.md` - Complete reference
   - `VSCODE_QUICKSTART.md` - Quick reference

4. **Ask for help**
   - Contact your admin or team
   - Share the full error message

---

## Next Steps

Now that your project is running, here's what to do next:

### 1. Explore the Codebase

1. **Open a page file**
   - In VSCode, go to `client/src/pages/Home.tsx`
   - Read through the code
   - Understand the structure

2. **Open a backend file**
   - Go to `server/routers.ts`
   - See how API endpoints are defined
   - Understand the tRPC pattern

3. **Open the database schema**
   - Go to `drizzle/schema.ts`
   - See all database tables
   - Understand the data structure

### 2. Make Your First Change

1. **Edit the landing page**
   - Open `client/src/pages/Home.tsx`
   - Change the hero text from "Build, Buy & Sell AI Solutions" to something else
   - Save the file (Ctrl+S)
   - Browser automatically refreshes
   - See your change live!

2. **Edit the colors**
   - Open `client/src/index.css`
   - Find the CSS variables at the top
   - Change `--color-primary` from orange to blue
   - Save and see the change instantly

### 3. Understand the Architecture

The project follows this pattern:

```
User Action (Browser)
    ↓
React Component (client/src/pages/*.tsx)
    ↓
tRPC Hook (trpc.feature.useQuery/useMutation)
    ↓
Backend Procedure (server/routers.ts)
    ↓
Database Query (server/db.ts)
    ↓
Database (MySQL)
    ↓
Response back to Browser
```

### 4. Learn the Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `client/src/pages/*.tsx` | UI pages | Change what users see |
| `client/src/index.css` | Global styles | Change colors, fonts, spacing |
| `server/routers.ts` | API endpoints | Add new features, change logic |
| `server/db.ts` | Database queries | Change how data is fetched |
| `drizzle/schema.ts` | Database tables | Add new data types |
| `.env.local` | Configuration | Change API keys, database URL |

### 5. Common Development Tasks

**To add a new page:**
1. Create `client/src/pages/NewPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add navigation link in `client/src/components/DashboardLayout.tsx`

**To add a new API endpoint:**
1. Add query helper in `server/db.ts`
2. Add procedure in `server/routers.ts`
3. Call from frontend using `trpc.feature.useQuery()`

**To add a new database table:**
1. Add table in `drizzle/schema.ts`
2. Run `pnpm db:push`
3. Add query helpers in `server/db.ts`

### 6. Useful Commands

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Format code (auto-fix style)
pnpm format

# Check for TypeScript errors
pnpm check

# Update database schema
pnpm db:push

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Useful VSCode Shortcuts

Master these shortcuts to code faster:

| Shortcut | Action |
|----------|--------|
| `Ctrl+`` | Open/close terminal |
| `Ctrl+S` | Save file |
| `Ctrl+/` | Comment/uncomment line |
| `Ctrl+F` | Find in file |
| `Ctrl+H` | Find and replace |
| `Ctrl+Shift+F` | Find in all files |
| `Alt+Up/Down` | Move line up/down |
| `Ctrl+D` | Select next occurrence |
| `F2` | Rename variable everywhere |
| `Ctrl+Space` | Show autocomplete |
| `Ctrl+Shift+P` | Open command palette |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+J` | Toggle terminal |

---

## Recommended VSCode Extensions

Install these extensions to improve your development experience:

1. **Tailwind CSS IntelliSense**
   - Search: "Tailwind CSS IntelliSense"
   - By: bradlc
   - Autocomplete for Tailwind classes

2. **ES7+ React/Redux/React-Native snippets**
   - Search: "ES7+ React/Redux"
   - By: dsznajder
   - Code snippets for React

3. **Prettier - Code formatter**
   - Search: "Prettier"
   - By: esbenp
   - Auto-format code on save

4. **Thunder Client** (optional)
   - Search: "Thunder Client"
   - By: rangav
   - Test API endpoints in VSCode

5. **GitLens** (optional)
   - Search: "GitLens"
   - By: eamodio
   - See Git history and blame

**To install extensions:**
1. Click Extensions icon (left sidebar)
2. Search for extension name
3. Click **"Install"**

---

## Project Structure Reference

```
botmarket/
├── client/                           ← Frontend (React)
│   ├── src/
│   │   ├── pages/                   ← Page components
│   │   │   ├── Home.tsx             ← Landing page
│   │   │   ├── Marketplace.tsx      ← Browse listings
│   │   │   ├── AIBuilder.tsx        ← AI projects
│   │   │   ├── Dashboard.tsx        ← User dashboard
│   │   │   ├── Pricing.tsx          ← Pricing page
│   │   │   └── ...
│   │   ├── components/              ← Reusable components
│   │   │   ├── DashboardLayout.tsx  ← Sidebar layout
│   │   │   ├── ui/                  ← shadcn/ui components
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── trpc.ts              ← tRPC client setup
│   │   ├── App.tsx                  ← Routes and layout
│   │   ├── main.tsx                 ← Entry point
│   │   └── index.css                ← Global styles
│   ├── public/                      ← Static assets
│   └── index.html                   ← HTML template
│
├── server/                          ← Backend (Node.js/Express)
│   ├── routers.ts                   ← API endpoints (tRPC)
│   ├── db.ts                        ← Database queries
│   ├── stripe/                      ← Stripe integration
│   │   ├── webhook.ts               ← Webhook handler
│   │   ├── checkout.ts              ← Checkout logic
│   │   └── subscription.ts          ← Subscription logic
│   ├── _core/                       ← Framework code
│   │   ├── index.ts                 ← Server entry point
│   │   ├── context.ts               ← tRPC context
│   │   ├── trpc.ts                  ← tRPC setup
│   │   ├── env.ts                   ← Environment variables
│   │   └── ...
│   └── *.test.ts                    ← Tests
│
├── drizzle/                         ← Database
│   ├── schema.ts                    ← Table definitions
│   └── migrations/                  ← Migration files
│
├── shared/                          ← Shared code
│   └── const.ts                     ← Constants
│
├── storage/                         ← S3 file storage
│   └── index.ts                     ← Storage helpers
│
├── .env.local                       ← Environment variables (local)
├── .env.example                     ← Environment template
├── package.json                     ← Dependencies
├── pnpm-lock.yaml                   ← Dependency lock
├── tsconfig.json                    ← TypeScript config
├── vite.config.ts                   ← Build config
├── vitest.config.ts                 ← Test config
├── tailwind.config.ts               ← Tailwind config
│
├── INTRODUCTION.md                  ← Quick overview
├── DETAILED_GUIDE.md                ← Complete reference
├── VSCODE_QUICKSTART.md             ← Quick start
└── MOVE_TO_VSCODE_FULL_GUIDE.md     ← This file
```

---

## Summary

You've successfully:

1. ✅ Downloaded the project from Manus
2. ✅ Installed Node.js, pnpm, and VSCode
3. ✅ Extracted and organized the project
4. ✅ Installed all dependencies
5. ✅ Configured environment variables
6. ✅ Set up the database
7. ✅ Started the development server
8. ✅ Verified the installation

**Your Swarm project is now running locally in VSCode!** 🎉

---

## Quick Reference Card

**Print this for quick access:**

```
STARTING DEVELOPMENT:
  cd ~/Projects/botmarket
  pnpm dev
  → Open http://localhost:3000

COMMON COMMANDS:
  pnpm dev      - Start development server
  pnpm test     - Run tests
  pnpm format   - Format code
  pnpm check    - Check TypeScript
  pnpm db:push  - Update database

KEY FILES:
  client/src/pages/*.tsx     - UI pages
  client/src/index.css       - Colors/styles
  server/routers.ts          - API endpoints
  drizzle/schema.ts          - Database tables
  .env.local                 - Configuration

KEYBOARD SHORTCUTS:
  Ctrl+`` - Terminal
  Ctrl+S  - Save
  Ctrl+/  - Comment
  F2      - Rename
  Ctrl+D  - Select next

TROUBLESHOOTING:
  Port in use?      → Kill process on port 3000
  Module not found? → pnpm install
  DB error?         → Check .env.local
  Blank page?       → Ctrl+Shift+R (hard refresh)
```

---

## Support

If you need help:

1. **Check the guides**
   - INTRODUCTION.md
   - DETAILED_GUIDE.md
   - VSCODE_QUICKSTART.md

2. **Check the troubleshooting section above**

3. **Check the terminal output**
   - Most errors are explained in the terminal

4. **Ask your admin or team**
   - Share the error message
   - Share the terminal output

---

**Congratulations! You're now a Swarm developer!** 🚀

Start building amazing AI solutions! 💡
