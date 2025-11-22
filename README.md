# 🍷 Wine Notes App

A beautiful, simple web app to track and remember your favorite wines. Built with Python (FastAPI) and React.

## Features

- ✨ Add, edit, and delete wine entries
- 📸 Upload photos of wine bottles
- ⭐ Rate wines from 1-10
- 📝 Add detailed tasting notes
- 🔍 View your entire collection
- 📱 Mobile-friendly design
- 🚀 Ready for Railway deployment

## Tech Stack

- **Backend**: Python 3.13, FastAPI, Pydantic 2.9
- **Frontend**: React 18, Vite
- **Deployment**: Railway (backend) + Vercel (frontend)

## Quick Start

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

## Deployment

See [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md) for complete step-by-step deployment instructions.

## Project Structure

```
wine-app-railway/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── data/               # JSON storage + uploads
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # React app
│   │   └── App.css         # Styles
│   ├── package.json
│   └── vite.config.js
├── railway.json            # Railway configuration
├── .gitignore
└── DEPLOY_RAILWAY.md       # Deployment guide
```

## Python 3.13 Compatibility

This app is specifically designed to work with Python 3.13 and newer versions. Key compatibility features:
- Pydantic 2.9.0 (3.13 compatible)
- Modern FastAPI with proper type hints
- No deprecated packages

## License

MIT - Use this however you want!