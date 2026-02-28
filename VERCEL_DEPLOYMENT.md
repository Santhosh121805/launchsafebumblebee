# Vercel Deployment Guide for LaunchSafe Bumblebee

## Frontend Deployment (Vercel) ✅

The frontend is ready to deploy to Vercel. Here are the steps:

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Setup Vercel deployment configuration"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select the `launchsafebumblebee` repository
5. Click "Import"

### Step 3: Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

```
VITE_BACKEND_URL=https://your-backend-url.com
VITE_CONTRACT_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
VITE_VAULT_ADDRESS=0x5B51Bd77152c2A4Da3574AC627f43Ec4B59eCAeD
VITE_FACTORY_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
```

### Step 4: Deploy
Click "Deploy" - Vercel handles everything automatically!

Your frontend will be live at: `https://your-project.vercel.app`

---

## Backend Deployment (Separate Service)

The backend and Telegram bot should be deployed separately. Here are options:

### Option A: Railway (Recommended - Easy)
1. Go to https://railway.app
2. Create account/login
3. Click "New Project"
4. Select "GitHub Repo"
5. Choose this repository
6. Set root directory to `backend`
7. Add environment variables:
   - MONGODB_URI
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_GROUP_ID
   - GEMINI_API_KEY
8. Deploy!

Your backend will be at: `https://your-project.up.railway.app`

### Option B: Render (Free Tier)
1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repo
5. Set runtime: Node
6. Set start command: `npm start`
7. Configure environment variables
8. Deploy!

### Option C: Heroku Alternative
Popular but now paid. Railway/Render are better free alternatives.

---

## Telegram Bot Deployment

Deploy bot separately (not on Vercel - it needs long-running process):

### With Railway/Render:
1. Create new project, select `agent` directory
2. Set start command: `node bumblebee.js`
3. Add same environment variables as backend
4. Deploy!

---

## Environment Variables Needed

### Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_CONTRACT_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
VITE_VAULT_ADDRESS=0x5B51Bd77152c2A4Da3574AC627f43Ec4B59eCAeD
VITE_FACTORY_ADDRESS=0xa5D8F9Ad375314D539C72A955dFb5DCB2C82f365
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bumblebee
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_GROUP_ID=-5199166513
GEMINI_API_KEY=your_key_here
NODE_ENV=production
PORT=3001
```

---

## Deployment Summary

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend | Vercel | ✅ Ready |
| Backend | Railway/Render | Needs separate deployment |
| Telegram Bot | Railway/Render | Needs separate deployment |
| Database | MongoDB Atlas | Already configured |
| Contracts | BNB Testnet | Already deployed |

---

## Quick Deploy Steps

### 1. Frontend to Vercel (5 minutes)
```bash
git add vercel.json .vercelignore
git commit -m "Add Vercel deployment config"
git push origin main
```
Then connect on vercel.com

### 2. Backend to Railway (10 minutes)
- Go to railway.app
- Connect GitHub repo
- Select `backend` directory
- Add env vars
- Deploy!

### 3. Bot to Railway (5 minutes)
- Create another Railway project
- Select `agent` directory  
- Add env vars
- Deploy!

---

## Post-Deployment Checklist

- [ ] Frontend loads on Vercel
- [ ] Update `VITE_BACKEND_URL` in Vercel with actual backend URL
- [ ] Backend is running and API endpoints work
- [ ] Telegram bot is running
- [ ] MongoDB connection confirmed
- [ ] Test token creation flow end-to-end

---

## Troubleshooting

**Frontend shows blank page:**
- Check browser console for errors
- Verify VITE_BACKEND_URL is correct
- Check Vercel logs

**Backend API 500 errors:**
- Check MongoDB connection
- Verify environment variables
- Check Railway logs

**Telegram bot not responding:**
- Verify TELEGRAM_BOT_TOKEN is correct
- Check bot token is active
- View agent logs on Railway/Render

---

## Support

For issues, check:
1. Vercel Logs: Dashboard → Project → Deployments → View Logs
2. Railway Logs: Project → View Logs
3. MongoDB Atlas: Cluster → Monitoring

Good luck! 🚀
