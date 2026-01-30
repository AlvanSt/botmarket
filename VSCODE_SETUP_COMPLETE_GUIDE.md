# 🚀 Complete Guide: Move Swarm to VSCode

This is a comprehensive step-by-step guide to download, set up, and run the Swarm platform on your local machine using VSCode.

**Total Setup Time:** 30-45 minutes  
**Difficulty Level:** Beginner-friendly

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Step 1: Install Prerequisites](#step-1-install-prerequisites)
3. [Step 2: Download Swarm Project](#step-2-download-swarm-project)
4. [Step 3: Extract the Project](#step-3-extract-the-project)
5. [Step 4: Open in VSCode](#step-4-open-in-vscode)
6. [Step 5: Install Dependencies](#step-5-install-dependencies)
7. [Step 6: Set Up Environment Variables](#step-6-set-up-environment-variables)
8. [Step 7: Set Up MySQL Database](#step-7-set-up-mysql-database)
9. [Step 8: Initialize Database](#step-8-initialize-database)
10. [Step 9: Start Development Server](#step-9-start-development-server)
11. [Step 10: Verify Installation](#step-10-verify-installation)
12. [Troubleshooting](#troubleshooting)
13. [Common Commands](#common-commands)

---

## System Requirements

Before starting, make sure your computer has:

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **RAM** | 4 GB | 8 GB or more |
| **Disk Space** | 2 GB | 5 GB or more |
| **OS** | Windows 10+, macOS 10.14+, Ubuntu 18.04+ | Latest version |
| **Internet** | Required for installation | Required for installation |

---

## Step 1: Install Prerequisites

You need to install three tools before starting:

### 1.1 Install Node.js

**What is Node.js?** Node.js is a JavaScript runtime that lets you run JavaScript on your computer.

#### Windows

1. Go to https://nodejs.org/
2. Click the **LTS** (Long Term Support) button - it's the larger one
3. Run the installer
4. Click **Next** through all screens
5. Check the box for **"Automatically install necessary tools"**
6. Click **Install**
7. Restart your computer when done

#### macOS

1. Go to https://nodejs.org/
2. Click the **LTS** button
3. Run the installer
4. Follow the prompts
5. Restart your computer

#### Ubuntu/Linux

Open Terminal and run:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**

Open Terminal/Command Prompt and run:

```bash
node --version
npm --version
```

You should see version numbers like `v20.10.0` and `10.2.3`.

---

### 1.2 Install pnpm

**What is pnpm?** pnpm is a faster package manager than npm.

Open Terminal/Command Prompt and run:

```bash
npm install -g pnpm
```

**Verify Installation:**

```bash
pnpm --version
```

You should see a version number like `8.15.0`.

---

### 1.3 Install VSCode

**What is VSCode?** VSCode is a code editor where you'll write and edit code.

1. Go to https://code.visualstudio.com/
2. Click the **Download** button for your OS
3. Run the installer
4. Follow the prompts
5. Launch VSCode

**Recommended VSCode Extensions:**

After opening VSCode, install these extensions:

1. **ES7+ React/Redux/React-Native snippets** - Search "ES7+" in Extensions
2. **Prettier - Code formatter** - Search "Prettier" in Extensions
3. **Thunder Client** - Search "Thunder Client" (for testing APIs)

To install extensions:
- Click the Extensions icon (left sidebar)
- Search for the extension name
- Click **Install**

---

## Step 2: Download Swarm Project

You have two options to get the project:

### Option A: Download from Manus (Recommended)

1. Go to your Manus project dashboard
2. Look for the **"Code"** or **"Download"** button
3. Click **"Download All Files"**
4. A ZIP file will download (usually named `botmarket.zip`)
5. Save it to your **Downloads** folder

### Option B: Clone from GitHub

If you have the GitHub repository URL:

```bash
git clone https://github.com/your-username/swarm.git
cd swarm
```

Then skip to **Step 4: Open in VSCode**.

---

## Step 3: Extract the Project

### Windows

1. Open **File Explorer**
2. Go to your **Downloads** folder
3. Right-click on `botmarket.zip`
4. Select **"Extract All..."**
5. Choose where to extract (e.g., `C:\Users\YourName\Projects\`)
6. Click **Extract**
7. A folder named `botmarket` will appear

### macOS

1. Open **Finder**
2. Go to **Downloads**
3. Double-click `botmarket.zip`
4. It will automatically extract
5. A folder named `botmarket` will appear

### Ubuntu/Linux

Open Terminal and run:

```bash
cd ~/Downloads
unzip botmarket.zip
cd botmarket
```

---

## Step 4: Open in VSCode

### 4.1 Open the Folder

1. Open **VSCode**
2. Click **File** → **Open Folder**
3. Navigate to the `botmarket` folder you extracted
4. Click **Open**

You should see the project structure in the left sidebar.

### 4.2 Open Terminal in VSCode

1. Click **Terminal** → **New Terminal** (or press `` Ctrl+` ``)
2. A terminal will appear at the bottom of VSCode
3. You should see a prompt like `botmarket>`

---

## Step 5: Install Dependencies

In the VSCode terminal, run:

```bash
pnpm install
```

This will download and install all the project dependencies. It may take 2-5 minutes.

**Expected Output:**

```
packages in 3.5s
added 1,234 packages
```

---

## Step 6: Set Up Environment Variables

Environment variables are secret settings that the app needs to run.

### 6.1 Create .env.local File

1. In VSCode, right-click on the project root folder (left sidebar)
2. Select **"New File"**
3. Name it `.env.local`
4. Press Enter

### 6.2 Add Environment Variables

Copy and paste this into `.env.local`:

```env
# ===== DATABASE (REQUIRED) =====
# Replace with your MySQL connection string
DATABASE_URL=mysql://username:password@localhost:3306/swarm

# ===== AUTHENTICATION (REQUIRED) =====
# Generate a secure secret - run this in terminal:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-key-change-this-in-production

# ===== STRIPE (OPTIONAL - for payments) =====
# Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ===== SERVER SETTINGS =====
NODE_ENV=development
PORT=3000
```

### 6.3 Generate Secure JWT_SECRET

1. In the VSCode terminal, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. You'll see a long random string like:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

3. Copy this string
4. In `.env.local`, replace `your-super-secret-key-change-this-in-production` with this string

**Example:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## Step 7: Set Up MySQL Database

You need a MySQL database. Choose one option:

### Option A: Local MySQL Server (Recommended for Development)

#### Windows

1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Run the installer
3. Choose **"Server Machine"** setup type
4. Keep default port **3306**
5. Configure MySQL as a Windows Service
6. Set password for root user (remember this!)
7. Click **Execute** to complete installation

#### macOS

1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Run the DMG installer
3. Follow the setup wizard
4. Choose your MySQL version
5. Set a password for root user
6. Complete installation

#### Ubuntu/Linux

Open Terminal and run:

```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

Follow the prompts to set root password.

### Option B: Cloud MySQL (Easier, No Local Installation)

Use one of these services:

**PlanetScale** (Recommended - Free tier available)
1. Go to https://planetscale.com
2. Sign up for free account
3. Create a new database
4. Copy the connection string
5. Use it as DATABASE_URL

**Railway**
1. Go to https://railway.app
2. Sign up
3. Create MySQL database
4. Copy connection string
5. Use it as DATABASE_URL

**Render**
1. Go to https://render.com
2. Sign up
3. Create PostgreSQL database
4. Copy connection string
5. Use it as DATABASE_URL

---

### 7.1 Create Local Database (If Using Local MySQL)

1. Open Terminal/Command Prompt
2. Connect to MySQL:

```bash
mysql -u root -p
```

3. Enter your MySQL root password when prompted

4. Run these SQL commands:

```sql
CREATE DATABASE swarm;
CREATE USER 'swarm'@'localhost' IDENTIFIED BY 'swarm_password_123';
GRANT ALL PRIVILEGES ON swarm.* TO 'swarm'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

5. Update `.env.local`:

```env
DATABASE_URL=mysql://swarm:swarm_password_123@localhost:3306/swarm
```

---

## Step 8: Initialize Database

Now create all the database tables.

In VSCode terminal, run:

```bash
pnpm db:push
```

**Expected Output:**

```
Pushing schema changes...
✓ Changes applied successfully
```

If you see errors, check:
- DATABASE_URL is correct in `.env.local`
- MySQL is running
- Database exists

---

## Step 9: Start Development Server

In VSCode terminal, run:

```bash
pnpm dev
```

**Expected Output:**

```
Server running on http://localhost:3000/
```

The server is now running! Leave this terminal open.

---

## Step 10: Verify Installation

### 10.1 Open in Browser

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to `http://localhost:3000`
3. You should see the Swarm landing page with:
   - Orange "Swarm" logo
   - "Build, Buy & Sell AI Solutions" headline
   - "Browse Marketplace" and "Start Building" buttons

### 10.2 Test Registration

1. Click **"Sign In"** (top right)
2. Click **"Create an account"**
3. Fill in:
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `TestPassword123!`
4. Click **"Register"**
5. You should be logged in!

### 10.3 Make Yourself Admin

1. Open a **new terminal** (don't close the dev server terminal)
2. Run:

```bash
mysql -u swarm -p swarm_password_123 swarm
```

3. Run this SQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
EXIT;
```

4. Refresh the browser - you should now see the **"Admin Panel"** link in the dashboard

### 10.4 Run Tests

In the new terminal, run:

```bash
pnpm test
```

**Expected Output:**

```
✓ 19 tests passed
```

All tests should pass!

---

## Troubleshooting

### "Cannot find module 'pnpm'"

**Solution:**
```bash
npm install -g pnpm
```

### "Cannot connect to database"

**Check:**
1. Is MySQL running? (Check Services on Windows, Activity Monitor on macOS)
2. Is DATABASE_URL correct in `.env.local`?
3. Does the database exist? Run `SHOW DATABASES;` in MySQL

### "Port 3000 already in use"

**Solution:**
```bash
npx kill-port 3000
```

Or change PORT in `.env.local`:
```env
PORT=3001
```

### "JWT_SECRET is required"

**Solution:**
- Make sure `.env.local` file exists
- Make sure JWT_SECRET is set with a value
- Restart the dev server

### "Module not found"

**Solution:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "TypeScript errors"

**Solution:**
```bash
pnpm check
```

This will show all TypeScript errors. Fix them by following the error messages.

---

## Common Commands

Here are commands you'll use frequently:

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm test` | Run tests |
| `pnpm check` | Check TypeScript errors |
| `pnpm db:push` | Update database schema |
| `pnpm format` | Format code with Prettier |
| `pnpm build` | Build for production |

---

## Project Structure

Here's what each folder contains:

```
botmarket/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities
│   │   └── App.tsx        # Main app file
│   └── public/            # Static files
│
├── server/                # Backend (Express + tRPC)
│   ├── routers.ts         # API endpoints
│   ├── db.ts              # Database queries
│   ├── auth/              # Authentication
│   ├── stripe/            # Stripe integration
│   └── storage/           # File storage
│
├── drizzle/               # Database schema
│   └── schema.ts          # Table definitions
│
├── shared/                # Shared code
│   └── const.ts           # Constants
│
├── .env.local             # Environment variables (YOU CREATE THIS)
├── package.json           # Dependencies
└── DETAILED_GUIDE.md      # Code documentation
```

---

## Making Your First Change

Let's make a simple change to verify everything works:

### 1. Edit the Landing Page

1. In VSCode, open `client/src/pages/Home.tsx`
2. Find the line with `"Build, Buy & Sell"`
3. Change it to `"Build, Buy & Sell AI Solutions"`
4. Save the file (Ctrl+S)

### 2. See Changes Live

1. Go to `http://localhost:3000` in your browser
2. The page should automatically update!
3. You should see your new text

This is **Hot Module Replacement (HMR)** - changes appear instantly without restarting.

---

## Next Steps

### 1. Explore the Codebase

- Read `DETAILED_GUIDE.md` for complete file documentation
- Read `INTRODUCTION.md` for feature overview

### 2. Add Features

- Edit `server/routers.ts` to add new API endpoints
- Edit `client/src/pages/` to add new pages
- Edit `drizzle/schema.ts` to add database tables

### 3. Deploy to Production

When ready to deploy:

1. **Build the project:**
   ```bash
   pnpm build
   ```

2. **Deploy to hosting:**
   - Railway (https://railway.app)
   - Render (https://render.com)
   - Vercel (https://vercel.com)
   - AWS (https://aws.amazon.com)
   - DigitalOcean (https://digitalocean.com)

---

## Getting Help

If you get stuck:

1. **Check Troubleshooting section** above
2. **Read error messages carefully** - they usually tell you what's wrong
3. **Check DETAILED_GUIDE.md** for code documentation
4. **Search online** for the error message

---

## Summary

You now have Swarm running locally! 🎉

**What you've done:**
- ✅ Installed Node.js, pnpm, VSCode
- ✅ Downloaded and extracted the project
- ✅ Installed dependencies
- ✅ Set up environment variables
- ✅ Created MySQL database
- ✅ Started development server
- ✅ Verified everything works

**What's next:**
- Make changes to the code
- Add new features
- Deploy to production

Happy coding! 🚀
