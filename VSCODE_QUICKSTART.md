# Swarm - VSCode Quick Start Guide

Follow this guide to get Swarm running in VSCode in 15 minutes.

---

## Step 1: Download Project from Manus (2 minutes)

1. **Go to Manus Management UI**
   - Open your Manus project dashboard
   - Click the **Code** panel (right side)
   - Click **"Download all files"** button
   - A ZIP file will download

2. **Extract the ZIP**
   - Right-click the ZIP file
   - Select "Extract All" (Windows) or "Extract" (Mac)
   - Choose where to save (e.g., `C:\Users\YourName\Projects\` or `~/Projects/`)

3. **You now have a folder called `botmarket`**

---

## Step 2: Install Prerequisites (5 minutes)

### 2.1 Install Node.js

1. Go to https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run the installer and follow prompts
4. Restart your computer

**Verify installation:**
```bash
node --version
# Should show: v18.x.x or higher
```

### 2.2 Install pnpm (Package Manager)

Open Command Prompt or Terminal and run:

```bash
npm install -g pnpm
```

**Verify installation:**
```bash
pnpm --version
# Should show: 10.x.x or higher
```

### 2.3 Install Git (Optional but recommended)

1. Go to https://git-scm.com/
2. Download and install
3. Use default settings

---

## Step 3: Open in VSCode (2 minutes)

1. **Install VSCode** (if not already)
   - Go to https://code.visualstudio.com/
   - Download and install

2. **Open the project**
   - Open VSCode
   - Click **File** → **Open Folder**
   - Navigate to your `botmarket` folder
   - Click **Select Folder**

3. **VSCode will load the project**
   - Wait for it to index files (30 seconds)
   - You'll see the file tree on the left

---

## Step 4: Install Dependencies (3 minutes)

1. **Open Terminal in VSCode**
   - Press `Ctrl + `` (backtick) or go to **View** → **Terminal**
   - You should see a terminal at the bottom

2. **Run install command**
   ```bash
   pnpm install
   ```
   - This downloads all npm packages
   - Takes 1-2 minutes
   - You'll see "done" when finished

---

## Step 5: Set Up Environment Variables (2 minutes)

1. **In VSCode, create `.env.local` file**
   - Right-click in the file explorer (left side)
   - Click **New File**
   - Name it `.env.local`

2. **Copy this content into `.env.local`:**

```env
# Database (required - ask your admin or use test database)
DATABASE_URL=mysql://root:password@localhost:3306/swarm

# Stripe (get from Manus Settings → Payment)
STRIPE_SECRET_KEY=sk_test_your_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_secret_here

# OAuth (provided by Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# Owner info (your account)
OWNER_OPEN_ID=your_open_id
OWNER_NAME=Your Name

# JWT Secret (any random string)
JWT_SECRET=your-secret-key-here-can-be-anything

# Forge API (provided by Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_key_here
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_key_here
```

3. **Fill in your values**
   - Ask your admin for the values
   - Or use test/placeholder values for now

---

## Step 6: Start the Development Server (1 minute)

1. **In the VSCode terminal, run:**

```bash
pnpm dev
```

2. **Wait for output:**
```
> botmarket@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

3. **Open in browser**
   - Click the URL: http://localhost:3000
   - Or manually type it in your browser
   - You should see the Swarm landing page!

---

## Step 7: Verify Everything Works (1 minute)

1. **Check the landing page loads**
   - You should see "Build, Buy & Sell AI Solutions"
   - Navigation bar at top
   - Two buttons: "Browse Marketplace" and "Start Building"

2. **Try clicking buttons**
   - Click "Browse Marketplace" → should show listings
   - Click "Start Building" → should show AI projects

3. **Check the terminal**
   - Should show no errors (red text)
   - Should show "[OAuth] Initialized"

✅ **Success! Your project is running!**

---

## Common Tasks While Developing

### Make Code Changes

1. Edit any file (e.g., `client/src/pages/Home.tsx`)
2. Save the file (Ctrl+S)
3. Browser automatically refreshes (hot reload)
4. See your changes instantly

### Run Tests

```bash
pnpm test
```

Should show:
```
Test Files  3 passed (3)
     Tests  13 passed (13)
```

### Format Code

```bash
pnpm format
```

Automatically fixes code style.

### Check for TypeScript Errors

```bash
pnpm check
```

Shows any type errors before running.

### Stop the Server

Press `Ctrl+C` in the terminal.

### Restart the Server

```bash
pnpm dev
```

---

## File Locations for Common Tasks

### Change Landing Page
- File: `client/src/pages/Home.tsx`
- Edit the hero section, buttons, text

### Change Marketplace
- File: `client/src/pages/Marketplace.tsx`
- Edit search, filters, listing display

### Change AI Builder
- File: `client/src/pages/AIProjectDetail.tsx`
- Edit training interface, data upload

### Change Colors/Theme
- File: `client/src/index.css`
- Edit CSS variables at the top

### Add New API Endpoint
- File: `server/routers.ts`
- Add new procedure in the router

### Add New Database Table
- File: `drizzle/schema.ts`
- Add new table definition
- Run `pnpm db:push`

---

## Troubleshooting

### "Command not found: pnpm"

**Solution:**
```bash
npm install -g pnpm
```

Then restart your terminal.

### "Port 3000 already in use"

**Solution (Windows):**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution (Mac/Linux):**
```bash
lsof -ti:3000 | xargs kill -9
```

Then run `pnpm dev` again.

### "Cannot find module 'react'"

**Solution:**
```bash
pnpm install
```

Then restart the server: `pnpm dev`

### "Database connection error"

**Solution:**
1. Check `.env.local` has correct `DATABASE_URL`
2. Verify MySQL is running
3. Check username and password are correct

### "TypeScript errors in editor"

**Solution:**
1. Close and reopen VSCode
2. Or run: `pnpm check`

### "Blank page or 404 error"

**Solution:**
1. Check terminal for errors
2. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check if server is still running

---

## Useful VSCode Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + `` | Open/close terminal |
| `Ctrl + S` | Save file |
| `Ctrl + /` | Comment/uncomment line |
| `Ctrl + F` | Find in file |
| `Ctrl + H` | Find and replace |
| `Ctrl + Shift + F` | Find in all files |
| `Alt + Up/Down` | Move line up/down |
| `Ctrl + D` | Select next occurrence |
| `F2` | Rename variable |
| `Ctrl + Space` | Show autocomplete |

---

## Recommended VSCode Extensions

Install these for better development experience:

1. **Tailwind CSS IntelliSense**
   - Search: "Tailwind CSS IntelliSense"
   - By: bradlc
   - Helps with Tailwind classes

2. **ES7+ React/Redux/React-Native snippets**
   - Search: "ES7+ React/Redux"
   - By: dsznajder
   - Code snippets for React

3. **Prettier - Code formatter**
   - Search: "Prettier"
   - By: esbenp
   - Auto-formats code

4. **Thunder Client** (optional)
   - Search: "Thunder Client"
   - By: rangav
   - Test API endpoints

---

## Next Steps

1. **Explore the codebase**
   - Open `client/src/pages/Home.tsx` and read the code
   - Open `server/routers.ts` and see API endpoints
   - Open `drizzle/schema.ts` and see database tables

2. **Make a small change**
   - Edit `client/src/pages/Home.tsx`
   - Change the hero text
   - See it update in the browser

3. **Read the full guides**
   - `INTRODUCTION.md` - Quick overview
   - `DETAILED_GUIDE.md` - Complete reference

4. **Start building features**
   - Follow the patterns in existing code
   - Use the guides as reference

---

## Getting Help

**If something doesn't work:**

1. Check the error message in the terminal
2. Search the error in Google
3. Check the troubleshooting section above
4. Read `DETAILED_GUIDE.md` for more info

**Common issues:**
- Port 3000 in use → Kill the process
- Dependencies missing → Run `pnpm install`
- Database error → Check `.env.local`
- TypeScript errors → Run `pnpm check`

---

## Summary

```bash
# 1. Extract ZIP file
# 2. Open folder in VSCode
# 3. Open terminal in VSCode
# 4. Run these commands:

pnpm install          # Install dependencies (1-2 minutes)
pnpm dev              # Start server (instant)

# 5. Open http://localhost:3000 in browser
# 6. Start coding!
```

**That's it! You're ready to develop.** 🚀

---

## File Structure Quick Reference

```
botmarket/
├── client/src/pages/        ← Edit UI pages here
├── client/src/index.css     ← Edit colors/theme here
├── server/routers.ts        ← Edit API endpoints here
├── drizzle/schema.ts        ← Edit database tables here
├── .env.local               ← Your environment variables
├── package.json             ← Dependencies
└── pnpm-lock.yaml           ← Dependency lock file
```

---

## Quick Command Reference

```bash
pnpm dev              # Start development server
pnpm test             # Run tests
pnpm format           # Format code
pnpm check            # Check TypeScript errors
pnpm build            # Build for production
pnpm db:push          # Update database schema
```

Happy coding! 🎉
