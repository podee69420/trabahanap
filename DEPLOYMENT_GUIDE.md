# 🚀 Complete Deployment Guide - Trabahanap

Follow this guide to deploy your Trabahanap website for FREE on Render.

## 📋 Pre-Deployment Checklist

- [ ] Code is complete and tested locally
- [ ] All files are in your `trabahanap` folder
- [ ] You have a GitHub account
- [ ] You have a Render account

---

## ⏱️ STEP 1: Prepare Your GitHub Repository (5 mins)

### 1.1 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Log in to your account
3. Click **"+"** → **"New repository"**
4. **Repository name**: `trabahanap`
5. **Description**: "Job posting platform for Baliwag, Bulacan"
6. Choose **"Public"** (required for free Render deployment)
7. Click **"Create repository"**

### 1.2 Push Your Code to GitHub
In your project folder (in terminal/command prompt):

```bash
# Navigate to your project
cd trabahanap

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Trabahanap job posting website"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/trabahanap.git

# Rename branch to main (Render prefers this)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### 1.3 Verify on GitHub
1. Go to your repository on GitHub
2. You should see all your files uploaded
3. The README.md should display on the repository page

---

## 🔗 STEP 2: Deploy to Render (10 mins)

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"**
4. Click **"Authorize render-oss"**
5. Complete the signup

### 2.2 Deploy Web Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select your **`trabahanap`** repository
3. Connect (if prompted)

### 2.3 Configure Deployment Settings

Fill in these fields:

| Setting | Value |
|---------|-------|
| **Name** | `trabahanap` |
| **Environment** | `Node` |
| **Region** | `Singapore` (or closest to you) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Watch the deployment logs (takes 2-3 minutes)
3. When you see "✓ Your service is live", it's done!

### 2.5 Get Your Live URL
Your website is now live at:
```
https://trabahanap.onrender.com
```

(The actual name will be slightly different - check your Render dashboard)

---

## 💾 STEP 3: Setup Data Persistence (Important!)

By default, Render deletes your database when the service restarts. Follow these steps to keep your data:

### 3.1 Add Environment Variable
1. In your Render dashboard
2. Go to your `trabahanap` service
3. Click **"Environment"** (left menu)
4. Click **"Add Environment Variable"**
5. Set:
   - **Key**: `DB_PATH`
   - **Value**: `/var/data/trabahanap.db`
6. Click **"Add"**

### 3.2 Update server.js
1. In VS Code, open `server.js`
2. Find this line (around line 11):
   ```javascript
   const db = new sqlite3.Database('./trabahanap.db', (err) => {
   ```
3. Replace with:
   ```javascript
   const dbPath = process.env.DB_PATH || './trabahanap.db';
   const db = new sqlite3.Database(dbPath, (err) => {
   ```
4. Save file
5. Push to GitHub:
   ```bash
   git add server.js
   git commit -m "Add database path configuration"
   git push
   ```

Your Render service will auto-redeploy!

---

## ✅ STEP 4: Test Your Live Website

1. Go to your live URL (from Render dashboard)
2. Click **"📝 Post Profile"**
3. Fill in a test profile:
   - **Name**: Test User
   - **Barangay**: Baliwag Poblacion
   - **Address**: Test Address
   - **Email**: test@example.com
4. Click **"✅ Submit Profile"**
5. Click **"👥 View Jobs"**
6. Your profile should appear in the bulletin board

✅ **Congratulations! Your website is live and working!**

---

## 🔄 STEP 5: Making Updates

Whenever you want to update your website:

1. **Make changes** in VS Code
2. **Test locally**:
   ```bash
   node server.js
   # Visit http://localhost:3000
   ```
3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update: [describe what you changed]"
   git push
   ```
4. **Render auto-deploys** (check logs in Render dashboard)
5. **Your live website updates** automatically!

---

## 🎯 Common Deployment Issues

### Issue: "Service failed to start"
**Solution**: Check build logs in Render dashboard
1. Click your service
2. Click "Logs" (right side)
3. Scroll up to see error messages
4. Common: Missing npm install - ensure `npm install` is build command

### Issue: Database shows "No profiles yet" after update
**Solution**: Make sure you set the DB_PATH environment variable (Step 3.1)

### Issue: "Cannot POST /api/job-seekers"
**Solution**: Make sure `server.js` is running correctly
1. Check Render logs for errors
2. Verify all files were pushed to GitHub
3. Check if `public/` folder exists on GitHub

### Issue: Website loads but buttons don't work
**Solution**: Browser cache issue
1. Open browser DevTools: `F12` or `Ctrl+Shift+I`
2. Go to "Application" tab
3. Clear cache and cookies
4. Refresh page

---

## 🌐 Custom Domain (Optional)

To add your own domain name instead of `trabahanap.onrender.com`:

1. In Render, go to your service
2. Click **"Settings"**
3. Scroll to **"Custom Domains"**
4. Add your domain name
5. Follow DNS setup instructions
6. Wait 24-48 hours for propagation

---

## 📊 Monitoring Your Live Website

### View Traffic
1. Render dashboard → Your service
2. Click **"Metrics"**
3. See CPU, memory, requests

### View Logs
1. Click **"Logs"**
2. Scroll to see real-time activity
3. Useful for debugging errors

### Database Backups
SQLite on Render is stored in `/var/data/`
- It persists across redeploys
- Manual backup: Download via SFTP (advanced)

---

## 💰 Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Bandwidth** | 100 GB/month |
| **Storage** | 1 GB |
| **Compute** | Shared CPU |
| **Sleep** | Service sleeps after 15 mins inactivity |

For a small job board in Baliwag, this is **more than enough!**

---

## 🚀 You're Live!

Your Trabahanap website is now live and ready for job seekers in Baliwag to use!

**Share your link**: `https://trabahanap.onrender.com`

---

**Questions? Check the README.md or visit Render docs: https://render.com/docs**