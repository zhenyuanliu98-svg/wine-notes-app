# 🚀 Complete Railway Deployment Guide

## Overview
This guide will help you deploy your Wine Notes app to Railway step by step.
- **Backend**: Railway (Python/FastAPI)
- **Frontend**: Vercel (React)
- **Time**: ~20 minutes
- **Cost**: FREE

---

## ✅ Step 1: Prepare Your Code

### 1.1 Test Locally First
```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

```bash
# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 - Make sure it works!

---

## ✅ Step 2: Push to GitHub

### 2.1 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click the **"+"** → **"New repository"**
3. Name: `wine-notes-app`
4. Keep it **Public**
5. DON'T initialize with README
6. Click **"Create repository"**

### 2.2 Push Your Code
```bash
# In your wine-app-railway folder
git init
git add .
git commit -m "Initial commit - Wine Notes App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wine-notes-app.git
git push -u origin main
```

---

## ✅ Step 3: Deploy Backend to Railway

### 3.1 Sign Up / Sign In
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub

### 3.2 Deploy from GitHub
1. Click **"Deploy from GitHub repo"**
2. Select your `wine-notes-app` repository
3. Railway will start deploying automatically

### 3.3 Configure Settings
1. Click on your deployment
2. Go to **"Settings"** tab
3. Under **"Service"**, configure:
   - **Root Directory**: `backend`
   - **Start Command**: `python main.py`
   - **Build Command**: `pip install -r requirements.txt`

### 3.4 Set Environment Variables
1. Go to **"Variables"** tab
2. Click **"Raw Editor"**
3. Add:
```
PORT=8000
```

### 3.5 Generate Domain
1. Go to **"Settings"** tab
2. Under **"Networking"**, click **"Generate Domain"**
3. Copy your URL (like: `wine-notes-app-production.up.railway.app`)

### 3.6 Test Your Backend
Visit: `https://your-app.up.railway.app`
You should see: `{"message":"Wine Notes API","status":"running","version":"2.0.0"}`

---

## ✅ Step 4: Deploy Frontend to Vercel

### 4.1 Prepare Frontend
1. Create a file `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.up.railway.app
```
(Use your actual Railway URL)

2. Commit and push:
```bash
git add .
git commit -m "Add production API URL"
git push
```

### 4.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `wine-notes-app` repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.up.railway.app`
7. Click **"Deploy"**

### 4.3 Get Your App URL
After deployment, Vercel gives you a URL like:
`https://wine-notes-app.vercel.app`

---

## ✅ Step 5: Final Configuration

### 5.1 Update Backend CORS
1. In Railway, go to your backend service
2. Go to **"Variables"** tab
3. Add:
```
ALLOWED_ORIGINS=https://wine-notes-app.vercel.app
```
(Use your actual Vercel URL)

### 5.2 Update Backend Code (if needed)
Edit `backend/main.py` line 16:
```python
allow_origins=["https://wine-notes-app.vercel.app", "http://localhost:5173"]
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

---

## 🎉 Step 6: You're Live!

Your app is now deployed! Share the Vercel URL with friends:
`https://wine-notes-app.vercel.app`

---

## 📝 Troubleshooting

### Backend not working?
1. Check Railway logs: Dashboard → Your Service → **"Observability"** → Logs
2. Common issues:
   - Wrong root directory (should be `backend`)
   - Missing start command
   - Port not set

### Frontend can't connect to backend?
1. Check browser console (F12)
2. Verify `VITE_API_URL` is correct in Vercel settings
3. Check CORS settings in backend

### "Module not found" errors?
Make sure `requirements.txt` has all packages:
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.9.0
python-multipart==0.0.12
python-dotenv==1.0.1
```

---

## 🔄 Updating Your App

After making changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

Both Railway and Vercel auto-deploy on push!

---

## 💡 Tips

1. **Free Tier Limits**:
   - Railway: $5 credit/month (enough for this app)
   - Vercel: Unlimited for personal projects

2. **Custom Domain**:
   - Both Railway and Vercel support custom domains
   - Buy a domain (~$10/year) and connect it

3. **Database Upgrade**:
   - When ready, add PostgreSQL to Railway
   - Just click "New" → "Database" → "PostgreSQL"

---

## 🚨 Important Security Note

The current version stores all wines in one shared JSON file. For production with multiple users, you should:
1. Add proper authentication
2. Use a real database (PostgreSQL)
3. Implement user sessions

But for personal use or testing, this works great!

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Check logs in both dashboards

Good luck! 🍷