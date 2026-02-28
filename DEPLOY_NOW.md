# 🚀 DEPLOYMENT CHECKLIST

## ✅ Pre-Deployment Status

- [x] Frontend code ready (Vite/React/TypeScript)
- [x] vercel.json configured
- [x] .vercelignore configured
- [x] All files committed to GitHub
- [x] Environment variables documented
- [x] Backend API working locally
- [x] Database (MongoDB) configured
- [x] Smart contracts deployed

---

## 📋 DEPLOYMENT STEPS

### STEP 1: Deploy Frontend to Vercel (5 minutes)

1. Go to **https://vercel.com**
2. Click **"Sign up"** / **"Log in"** with GitHub
3. Click **"Add New..."** → **"Project"**
4. Find and select **`launchsafebumblebee`** repository
5. Click **"Import"**
6. Vercel will auto-detect settings from `vercel.json`
7. Click **"Deploy"**

**Result:** Your frontend URL will appear! Example: `https://launchsafebumblebee.vercel.app`

---

### STEP 2: Add Environment Variables to Vercel

After deployment succeeds:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these 4 variables:

```
VITE_BACKEND_URL → https://your-backend-url.com
VITE_CONTRACT_ADDRESS → 0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
VITE_VAULT_ADDRESS → 0x5B51Bd77152c2A4Da3574AC627f43Ec4B59eCAeD
VITE_FACTORY_ADDRESS → 0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
```

4. Click **"Save"**
5. Go to **"Deployments"** and click **"Redeploy"**

---

### STEP 3: Deploy Backend to Railway (10 minutes)

For backend + Telegram bot:

1. Go to **https://railway.app**
2. Click **"New Project"** → **"GitHub Repo"**
3. Select **`launchsafebumblebee`** repo
4. In "Root Directory", find and select **`backend`**
5. Click **"Deploy"**

**While deploying, add these environment variables:**

```
MONGODB_URI=mongodb+srv://ssanthoshs418_db_user:2vA04HxS1viuXtHT@bumblebee.vg70p9j.mongodb.net/?appName=bumblebee
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_GROUP_ID=-5199166513
GEMINI_API_KEY=your_key_here
NODE_ENV=production
```

**Result:** Railway gives you a backend URL! Example: `https://your-project.up.railway.app`

---

### STEP 4: Update Vercel with Backend URL

1. Go back to Vercel project
2. Settings → Environment Variables
3. Update `VITE_BACKEND_URL` with your Railway backend URL
4. Redeploy

---

### STEP 5: Deploy Telegram Bot (Optional - same as backend)

Create another Railway project:

1. Click **"New Project"** → **"GitHub Repo"**
2. Select repo, set root directory to **`agent`**
3. Add same environment variables
4. Deploy!

---

## 🎯 Quick Summary

| Step | Platform | Time | Status |
|------|----------|------|--------|
| 1. Frontend | Vercel | 5 min | Ready |
| 2. Env Variables | Vercel | 2 min | Ready |
| 3. Backend | Railway | 10 min | Ready |
| 4. Update Backend URL | Vercel | 2 min | Ready |
| 5. Telegram Bot | Railway | 5 min | Optional |

**Total deployment time: ~25 minutes**

---

## ✨ After Deployment

1. ✅ Visit your Vercel URL
2. ✅ Connect MetaMask wallet
3. ✅ Test token creation
4. ✅ Check Telegram bot responses
5. ✅ Verify real-time stats from backend

---

## 🔗 Important Links

- **GitHub Repo:** https://github.com/Santhosh121805/launchsafebumblebee
- **Vercel:** https://vercel.com
- **Railway:** https://railway.app
- **MongoDB:** https://cloud.mongodb.com

---

## 💡 Need Help?

- **Vercel Logs:** Project → Deployments → View Logs
- **Railway Logs:** Project → View Logs
- **VERCEL_DEPLOYMENT.md** file has detailed troubleshooting

---

## 🎉 You're Ready to Deploy!

All configuration is complete. Start with Step 1 above.

**Good luck! 🚀**
