# 🛠️ What Does "Add to Path" Mean? Complete Guide

This guide explains what "Add to Path" means and how to do it for Stripe CLI and other command-line tools.

---

## Table of Contents

1. [What is the PATH?](#what-is-the-path)
2. [Why Add to PATH?](#why-add-to-path)
3. [How PATH Works](#how-path-works)
4. [Windows: Add Stripe CLI to PATH](#windows-add-stripe-cli-to-path)
5. [macOS: Add to PATH](#macos-add-to-path)
6. [Linux: Add to PATH](#linux-add-to-path)
7. [Verify Installation](#verify-installation)
8. [Troubleshooting](#troubleshooting)

---

## What is the PATH?

**PATH** is a list of folders on your computer where your operating system looks for executable programs.

### Real-World Analogy

Think of PATH like a **contact list for programs**:

```
When you type: stripe login
Your computer asks: "Where is the stripe program?"
It checks each folder in PATH until it finds it
Once found, it runs the program
```

### Example PATH

Your PATH might look like:

```
C:\Program Files\Node.js
C:\Program Files\Git\cmd
C:\Program Files\Stripe
C:\Windows\System32
```

When you type a command, Windows checks each folder in order:
1. Is `stripe.exe` in `C:\Program Files\Node.js`? No
2. Is `stripe.exe` in `C:\Program Files\Git\cmd`? No
3. Is `stripe.exe` in `C:\Program Files\Stripe`? **Yes!** Run it

---

## Why Add to PATH?

### Without Adding to PATH

If you download `stripe.exe` to `C:\Downloads\stripe.exe`, you have to type the full path:

```bash
C:\Downloads\stripe.exe login
```

This is tedious and error-prone.

### With Adding to PATH

After adding `C:\Downloads` to PATH, you can just type:

```bash
stripe login
```

Your computer automatically finds it in the PATH.

---

## How PATH Works

### Step-by-Step Example

```
1. You type: stripe --version
   ↓
2. Windows searches PATH folders in order
   ↓
3. Finds stripe.exe in C:\Program Files\Stripe
   ↓
4. Runs the program
   ↓
5. You see: stripe version 1.15.0
```

### Without PATH

```
1. You type: stripe --version
   ↓
2. Windows searches PATH folders
   ↓
3. Doesn't find stripe.exe anywhere
   ↓
4. Error: 'stripe' is not recognized
```

---

## Windows: Add Stripe CLI to PATH

### Option 1: Stripe CLI Installer (Easiest)

If you downloaded the Stripe CLI installer (`.msi` file):

1. Run the installer
2. Click through the setup wizard
3. **The installer automatically adds Stripe to PATH**
4. Restart your terminal
5. Test: Open Command Prompt and type `stripe --version`

**You're done!** No manual PATH editing needed.

### Option 2: Manual PATH Setup (If Using ZIP File)

If you downloaded the ZIP file instead:

#### Step 1: Extract the ZIP File

1. Download `stripe_cli_windows_x86_64.zip` from https://stripe.com/docs/stripe-cli
2. Right-click the ZIP file
3. Select **"Extract All..."**
4. Choose a folder (e.g., `C:\Program Files\Stripe`)
5. Click **"Extract"**
6. You should see `stripe.exe` in the folder

#### Step 2: Copy the Folder Path

1. Open the folder where you extracted `stripe.exe`
2. Click the address bar at the top
3. The full path will be highlighted (e.g., `C:\Program Files\Stripe`)
4. Right-click and copy it

**Example paths:**
- `C:\Program Files\Stripe`
- `C:\Users\YourName\Downloads\stripe`
- `C:\stripe`

#### Step 3: Open Environment Variables

**Method 1: Using Search (Easiest)**

1. Press **Windows key** on your keyboard
2. Type: `environment variables`
3. Click **"Edit the system environment variables"**
4. Skip to Step 4

**Method 2: Using Settings**

1. Press **Windows key + I** to open Settings
2. Search for **"environment"**
3. Click **"Edit the system environment variables"**
4. Skip to Step 4

**Method 3: Manual Navigation**

1. Right-click **"This PC"** or **"My Computer"** on desktop
2. Select **"Properties"**
3. Click **"Advanced system settings"** (left sidebar)
4. Skip to Step 4

#### Step 4: Edit PATH Variable

You should see the **"System Properties"** window:

1. Click the **"Environment Variables"** button (bottom right)
2. You'll see two sections: **"User variables"** and **"System variables"**
3. In the **"System variables"** section, find **"Path"**
4. Click on **"Path"** to select it
5. Click the **"Edit"** button

#### Step 5: Add Stripe Folder to PATH

A new window will open showing your PATH entries:

1. Click the **"New"** button
2. Paste the path to your Stripe folder (e.g., `C:\Program Files\Stripe`)
3. Click **"OK"**

**Example:**
```
C:\Program Files\Stripe
```

#### Step 6: Apply Changes

1. Click **"OK"** on the Environment Variables window
2. Click **"OK"** on the System Properties window
3. **Restart your computer** (or at least restart your terminal)

#### Step 7: Verify

1. Open a **new** Command Prompt or PowerShell
2. Type: `stripe --version`
3. You should see: `stripe version 1.15.0`

---

## macOS: Add to PATH

### Option 1: Using Homebrew (Easiest)

If you installed Stripe CLI with Homebrew:

```bash
brew install stripe/stripe-cli/stripe
```

**Homebrew automatically adds it to PATH.** No manual setup needed!

Test it:
```bash
stripe --version
```

### Option 2: Manual PATH Setup (If Using ZIP File)

If you downloaded the ZIP file:

#### Step 1: Extract ZIP File

1. Download `stripe_cli_macos_x86_64.zip` from https://stripe.com/docs/stripe-cli
2. Double-click the ZIP file (it auto-extracts)
3. You'll see a `stripe` executable
4. Move it to `/usr/local/bin/`:

```bash
sudo mv ~/Downloads/stripe /usr/local/bin/stripe
sudo chmod +x /usr/local/bin/stripe
```

#### Step 2: Verify

```bash
stripe --version
```

You should see: `stripe version 1.15.0`

**Done!** `/usr/local/bin` is already in your PATH by default.

### Option 3: Add Custom Location to PATH

If you want to keep Stripe in a custom folder:

#### Step 1: Create Folder

```bash
mkdir -p ~/stripe-cli
mv ~/Downloads/stripe ~/stripe-cli/
chmod +x ~/stripe-cli/stripe
```

#### Step 2: Add to PATH

Open Terminal and run:

```bash
nano ~/.zshrc
```

(If you use bash instead, use `~/.bash_profile`)

#### Step 3: Add This Line

Add this line at the end of the file:

```bash
export PATH="$PATH:$HOME/stripe-cli"
```

#### Step 4: Save and Exit

1. Press **Ctrl + X**
2. Press **Y** (for yes)
3. Press **Enter**

#### Step 5: Reload Shell

```bash
source ~/.zshrc
```

#### Step 6: Verify

```bash
stripe --version
```

---

## Linux: Add to PATH

### Option 1: Using Package Manager (Easiest)

#### Ubuntu/Debian

```bash
curl -fsSL https://files.stripe.com/stripe-cli/install.sh | sh
```

This automatically adds Stripe to PATH.

#### Fedora/RHEL

```bash
curl -fsSL https://files.stripe.com/stripe-cli/install.sh | sh
```

### Option 2: Manual PATH Setup (If Using ZIP File)

#### Step 1: Extract ZIP File

```bash
cd ~/Downloads
unzip stripe_cli_linux_x86_64.zip
sudo mv stripe /usr/local/bin/
sudo chmod +x /usr/local/bin/stripe
```

#### Step 2: Verify

```bash
stripe --version
```

**Done!** `/usr/local/bin` is already in PATH by default.

### Option 3: Add Custom Location to PATH

#### Step 1: Create Folder

```bash
mkdir -p ~/stripe-cli
mv ~/Downloads/stripe ~/stripe-cli/
chmod +x ~/stripe-cli/stripe
```

#### Step 2: Add to PATH

Open your shell config file:

```bash
nano ~/.bashrc
```

(Or `~/.zshrc` if using zsh)

#### Step 3: Add This Line

Add at the end:

```bash
export PATH="$PATH:$HOME/stripe-cli"
```

#### Step 4: Save and Exit

1. Press **Ctrl + X**
2. Press **Y**
3. Press **Enter**

#### Step 5: Reload Shell

```bash
source ~/.bashrc
```

#### Step 6: Verify

```bash
stripe --version
```

---

## Verify Installation

After adding to PATH, verify it works:

### Windows

Open Command Prompt or PowerShell and run:

```bash
stripe --version
```

**Expected output:**
```
stripe version 1.15.0
```

### macOS / Linux

Open Terminal and run:

```bash
stripe --version
```

**Expected output:**
```
stripe version 1.15.0
```

### If It Doesn't Work

1. **Restart your terminal** (close and reopen)
2. **Restart your computer** (if on Windows)
3. **Check the folder path** — make sure `stripe.exe` (Windows) or `stripe` (macOS/Linux) is actually in the folder
4. **Check PATH entry** — make sure you added the correct folder path

---

## Troubleshooting

### "stripe is not recognized" (Windows)

**Problem:** You get this error:
```
'stripe' is not recognized as an internal or external command
```

**Solutions:**

1. **Restart your terminal** — Close Command Prompt/PowerShell completely and reopen
2. **Restart your computer** — Changes to PATH require a restart
3. **Check PATH entry** — Make sure you added the correct folder
4. **Check file exists** — Make sure `stripe.exe` is in the folder you added

### "stripe: command not found" (macOS/Linux)

**Problem:** You get this error:
```
stripe: command not found
```

**Solutions:**

1. **Reload shell config:**
   ```bash
   source ~/.zshrc  # or ~/.bashrc
   ```

2. **Check file exists:**
   ```bash
   ls -la ~/stripe-cli/stripe
   ```

3. **Check file is executable:**
   ```bash
   chmod +x ~/stripe-cli/stripe
   ```

4. **Check PATH entry:**
   ```bash
   echo $PATH
   ```
   Look for your stripe folder in the output

### "Permission denied" (macOS/Linux)

**Problem:** You get this error:
```
Permission denied
```

**Solution:**

Make the file executable:

```bash
chmod +x /path/to/stripe
```

### "No such file or directory"

**Problem:** You get this error:
```
No such file or directory
```

**Solutions:**

1. **Check folder path** — Make sure the folder exists
2. **Check file name** — Make sure it's `stripe` (not `Stripe` or `stripe.exe`)
3. **Check PATH entry** — Make sure you added the exact folder path

---

## Quick Reference

### Windows

```
1. Download stripe_cli_windows_x86_64.zip
2. Extract to C:\Program Files\Stripe
3. Open Environment Variables
4. Add C:\Program Files\Stripe to PATH
5. Restart computer
6. Test: stripe --version
```

### macOS

```
1. brew install stripe/stripe-cli/stripe
   OR
   Download ZIP and move to /usr/local/bin/
2. Test: stripe --version
```

### Linux

```
1. curl -fsSL https://files.stripe.com/stripe-cli/install.sh | sh
   OR
   Download ZIP and move to /usr/local/bin/
2. Test: stripe --version
```

---

## What PATH Actually Contains

### View Your Current PATH

**Windows (PowerShell):**
```powershell
$env:Path
```

**macOS/Linux:**
```bash
echo $PATH
```

You'll see something like:

```
C:\Program Files\Node.js;C:\Program Files\Git\cmd;C:\Windows\System32;C:\Program Files\Stripe
```

(Paths are separated by `;` on Windows, `:` on macOS/Linux)

---

## Common Programs That Use PATH

When you install these programs, they're automatically added to PATH:

- **Node.js** → `node`, `npm`
- **Git** → `git`
- **Python** → `python`
- **Java** → `java`
- **Docker** → `docker`
- **Stripe CLI** → `stripe`

Once added to PATH, you can run them from any folder in your terminal.

---

## Summary

**PATH is a list of folders where your computer looks for programs.**

When you add a folder to PATH:
- ✅ You can run the program from anywhere in terminal
- ✅ You don't need to type the full path
- ✅ It works like built-in commands

**For Stripe CLI:**
- Windows: Add the folder containing `stripe.exe` to PATH
- macOS: Use Homebrew or add to `/usr/local/bin/`
- Linux: Use package manager or add to `/usr/local/bin/`

---

## Next Steps

1. ✅ Add Stripe CLI to PATH
2. ✅ Verify with `stripe --version`
3. ✅ Log in with `stripe login`
4. ✅ Start forwarding webhooks with `stripe listen --forward-to localhost:3000/api/stripe/webhook`

Happy coding! 🚀
