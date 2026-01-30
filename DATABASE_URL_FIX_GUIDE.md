# 🗄️ Fix "DATABASE_URL is required" Error

This guide helps you fix the error: **"DATABASE_URL is required to run drizzle commands"**

---

## Table of Contents

1. [What Does This Error Mean?](#what-does-this-error-mean)
2. [Quick Fix](#quick-fix)
3. [Set Up MySQL Locally](#set-up-mysql-locally)
4. [Set Up Cloud Database](#set-up-cloud-database)
5. [Create .env.local File](#create-envlocal-file)
6. [Verify DATABASE_URL](#verify-database_url)
7. [Run Drizzle Commands](#run-drizzle-commands)
8. [Troubleshooting](#troubleshooting)

---

## What Does This Error Mean?

**The error occurs when:**
- You run `pnpm db:push` or other database commands
- Your `.env.local` file doesn't have `DATABASE_URL` set
- Or the `DATABASE_URL` is missing/empty

**Why it happens:**
- Drizzle ORM needs to know where your database is
- It uses `DATABASE_URL` to connect to the database
- Without it, Drizzle can't run migrations or push schema changes

---

## Quick Fix

### Step 1: Check if .env.local Exists

1. Open your project in VSCode
2. Look in the left sidebar (file tree)
3. Do you see a file named `.env.local`?

**If YES:** Go to Step 2  
**If NO:** Go to "Create .env.local File" section below

### Step 2: Check if DATABASE_URL is Set

1. Open `.env.local` in VSCode
2. Look for a line that starts with `DATABASE_URL=`

**If you see it:** Go to Step 3  
**If you don't see it:** Add it (see section below)

### Step 3: Verify the URL Format

Make sure your `DATABASE_URL` looks like one of these:

**Local MySQL:**
```env
DATABASE_URL=mysql://username:password@localhost:3306/database_name
```

**Cloud Database (PlanetScale):**
```env
DATABASE_URL=mysql://username:password@aws.connect.psdb.cloud/database_name?sslaccept=strict
```

**Cloud Database (Railway):**
```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

### Step 4: Restart Dev Server

1. In VSCode terminal, stop the server (Ctrl+C)
2. Start it again: `pnpm dev`

### Step 5: Run Database Command

```bash
pnpm db:push
```

If it works, you're done! ✅

---

## Set Up MySQL Locally

If you don't have a database yet, follow these steps to create one locally.

### Step 1: Install MySQL

#### Windows

1. Go to https://dev.mysql.com/downloads/mysql/
2. Download **MySQL Community Server**
3. Run the installer
4. Choose **"Server Machine"** setup type
5. Keep default port **3306**
6. Configure as Windows Service
7. Set a root password (remember this!)
8. Click **"Execute"** to finish

#### macOS

1. Go to https://dev.mysql.com/downloads/mysql/
2. Download the DMG installer
3. Run it
4. Follow setup wizard
5. Set a root password
6. Complete installation

#### Ubuntu/Linux

Open Terminal and run:

```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

Follow the prompts to set root password.

### Step 2: Create Database and User

Open Terminal/Command Prompt and connect to MySQL:

```bash
mysql -u root -p
```

Enter your root password when prompted.

Now run these SQL commands:

```sql
CREATE DATABASE swarm;
CREATE USER 'swarm'@'localhost' IDENTIFIED BY 'swarm_password_123';
GRANT ALL PRIVILEGES ON swarm.* TO 'swarm'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**What this does:**
- Creates a database named `swarm`
- Creates a user named `swarm` with password `swarm_password_123`
- Gives the user permission to access the `swarm` database

### Step 3: Create DATABASE_URL

Your `DATABASE_URL` is:

```
mysql://swarm:swarm_password_123@localhost:3306/swarm
```

**Breaking it down:**
```
mysql://        ← Database type
swarm:          ← Username
swarm_password_123@  ← Password
localhost:3306  ← Server and port
/swarm          ← Database name
```

### Step 4: Add to .env.local

1. Open `.env.local` in VSCode
2. Find the `DATABASE_URL` line
3. Replace it with:

```env
DATABASE_URL=mysql://swarm:swarm_password_123@localhost:3306/swarm
```

4. Save the file (Ctrl+S)

### Step 5: Test Connection

In VSCode terminal, run:

```bash
pnpm db:push
```

If successful, you should see:

```
✓ Changes applied successfully
```

---

## Set Up Cloud Database

If you prefer not to install MySQL locally, use a cloud database service.

### Option 1: PlanetScale (Recommended - Free Tier)

**Why PlanetScale?**
- Free tier available
- Easy to set up
- MySQL-compatible
- Great for development

#### Step 1: Create Account

1. Go to https://planetscale.com
2. Click **"Sign up"**
3. Create account with email/password or GitHub

#### Step 2: Create Database

1. Click **"Create a new database"**
2. Name it: `swarm`
3. Choose region closest to you
4. Click **"Create database"**

#### Step 3: Get Connection String

1. Click on your database
2. Click **"Connect"** button
3. Select **"Node.js"** from dropdown
4. Copy the connection string

It will look like:

```
mysql://username:password@aws.connect.psdb.cloud/swarm?sslaccept=strict
```

#### Step 4: Add to .env.local

1. Open `.env.local`
2. Replace `DATABASE_URL` with the connection string:

```env
DATABASE_URL=mysql://username:password@aws.connect.psdb.cloud/swarm?sslaccept=strict
```

3. Save the file

#### Step 5: Test Connection

```bash
pnpm db:push
```

### Option 2: Railway

#### Step 1: Create Account

1. Go to https://railway.app
2. Sign up with GitHub or email

#### Step 2: Create MySQL Database

1. Click **"New Project"**
2. Click **"Provision MySQL"**
3. Wait for database to be created

#### Step 3: Get Connection String

1. Click on the MySQL service
2. Go to **"Connect"** tab
3. Copy the connection string

It will look like:

```
mysql://root:password@host:3306/railway
```

#### Step 4: Add to .env.local

```env
DATABASE_URL=mysql://root:password@host:3306/railway
```

#### Step 5: Test Connection

```bash
pnpm db:push
```

### Option 3: Render

#### Step 1: Create Account

1. Go to https://render.com
2. Sign up

#### Step 2: Create PostgreSQL Database

1. Click **"New +"**
2. Select **"PostgreSQL"**
3. Name it: `swarm`
4. Click **"Create Database"**

#### Step 3: Get Connection String

1. Go to your database
2. Copy the **"External Database URL"**

It will look like:

```
postgresql://user:password@host:5432/database
```

#### Step 4: Add to .env.local

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

#### Step 5: Test Connection

```bash
pnpm db:push
```

---

## Create .env.local File

If you don't have a `.env.local` file yet:

### Step 1: Create the File

1. In VSCode, right-click the project root folder (left sidebar)
2. Select **"New File"**
3. Name it: `.env.local`
4. Press Enter

### Step 2: Add Environment Variables

Copy and paste this into `.env.local`:

```env
# ===== DATABASE (REQUIRED) =====
DATABASE_URL=mysql://username:password@localhost:3306/swarm

# ===== AUTHENTICATION (REQUIRED) =====
JWT_SECRET=your-super-secret-key-change-this

# ===== STRIPE (OPTIONAL) =====
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# ===== SERVER SETTINGS =====
NODE_ENV=development
PORT=3000
```

### Step 3: Update DATABASE_URL

Replace `mysql://username:password@localhost:3306/swarm` with your actual database URL.

### Step 4: Generate JWT_SECRET

In terminal, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and replace `your-super-secret-key-change-this` with it.

### Step 5: Save File

Press Ctrl+S to save.

---

## Verify DATABASE_URL

### Check if .env.local is Loaded

1. In VSCode terminal, run:

```bash
pnpm dev
```

2. Look for this message in the output:

```
Server running on http://localhost:3000/
```

If you see it, the server started successfully! ✅

### Check DATABASE_URL Value

To see what `DATABASE_URL` is set to, run:

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL
```

**macOS/Linux:**
```bash
echo $DATABASE_URL
```

If it shows your database URL, it's working! ✅

If it's empty, your `.env.local` file isn't being loaded. Check:
1. File is named `.env.local` (not `.env.local.txt`)
2. File is in the project root folder
3. You restarted the terminal

---

## Run Drizzle Commands

Once `DATABASE_URL` is set, you can run these commands:

### Push Schema Changes

```bash
pnpm db:push
```

This creates/updates database tables based on your schema.

### Generate Migrations

```bash
pnpm db:generate
```

This creates migration files for your schema changes.

### View Database

```bash
pnpm db:studio
```

This opens a UI to view and edit your database.

### Expected Output

When successful, you should see:

```
✓ Changes applied successfully
✓ Migration created successfully
```

---

## Troubleshooting

### "DATABASE_URL is not set"

**Problem:** You still get the error after adding DATABASE_URL

**Solutions:**

1. **Restart terminal:**
   - Close VSCode terminal completely
   - Open a new terminal
   - Try again

2. **Check file name:**
   - Make sure file is named `.env.local` (not `.env` or `.env.local.txt`)
   - On Windows, files starting with `.` might be hidden

3. **Check file location:**
   - Make sure `.env.local` is in the project root folder
   - Not in a subfolder

4. **Check file content:**
   - Open `.env.local`
   - Make sure you see: `DATABASE_URL=mysql://...`
   - Make sure there's no `#` before it (that would comment it out)

### "Connection refused"

**Problem:** DATABASE_URL is set but connection fails

**Solutions:**

1. **Check database is running:**
   - Windows: Open Services and look for MySQL
   - macOS: Check System Preferences
   - Linux: Run `sudo systemctl status mysql`

2. **Check credentials:**
   - Username and password are correct
   - Database exists
   - User has permission to access database

3. **Check host and port:**
   - `localhost` should be `127.0.0.1`
   - Port should be `3306` for MySQL
   - Port should be `5432` for PostgreSQL

4. **Test connection manually:**
   ```bash
   mysql -u swarm -p -h localhost
   ```
   Enter password when prompted. If it connects, your credentials are correct.

### "Unknown database"

**Problem:** Error says database doesn't exist

**Solutions:**

1. **Create the database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE swarm;
   EXIT;
   ```

2. **Check database name:**
   - Make sure database name in URL matches actual database name
   - Database names are case-sensitive on Linux

### "Access denied for user"

**Problem:** Username or password is wrong

**Solutions:**

1. **Reset MySQL password:**
   ```bash
   mysql -u root -p
   ALTER USER 'swarm'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

2. **Update DATABASE_URL:**
   ```env
   DATABASE_URL=mysql://swarm:new_password@localhost:3306/swarm
   ```

3. **Restart server:**
   ```bash
   pnpm dev
   ```

### "SSL connection error"

**Problem:** SSL/TLS connection fails

**Solutions:**

1. **For PlanetScale, add SSL parameter:**
   ```env
   DATABASE_URL=mysql://user:pass@host/db?sslaccept=strict
   ```

2. **For other cloud databases:**
   - Check if SSL is required
   - Add `?ssl=true` to URL if needed

### "ELIFECYCLE Command failed"

**Problem:** Command exits with error code 1

**Solutions:**

1. **Check DATABASE_URL is set:**
   ```bash
   echo $DATABASE_URL  # macOS/Linux
   $env:DATABASE_URL  # Windows PowerShell
   ```

2. **Check .env.local file:**
   - Make sure it exists in project root
   - Make sure it's not empty
   - Make sure DATABASE_URL line is not commented out

3. **Restart everything:**
   ```bash
   # Close terminal
   # Reopen terminal
   # Try again
   pnpm db:push
   ```

---

## Summary

**To fix "DATABASE_URL is required":**

1. ✅ Create `.env.local` file in project root
2. ✅ Set `DATABASE_URL` to your database connection string
3. ✅ Restart terminal/VSCode
4. ✅ Run `pnpm db:push`

**DATABASE_URL format:**
```
mysql://username:password@host:port/database_name
```

**Quick options:**
- **Local:** `mysql://swarm:swarm_password_123@localhost:3306/swarm`
- **PlanetScale:** `mysql://user:pass@aws.connect.psdb.cloud/db?sslaccept=strict`
- **Railway:** `mysql://root:pass@host:3306/railway`

---

## Next Steps

1. ✅ Set up DATABASE_URL
2. ✅ Run `pnpm db:push`
3. ✅ Run `pnpm dev` to start server
4. ✅ Go to `http://localhost:3000` in browser

Happy coding! 🚀
