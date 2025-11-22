from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
import json
import os
from pathlib import Path
import shutil
import uuid

# Initialize FastAPI app
app = FastAPI(title="Wine Notes API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Will restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directories
DATA_DIR = Path("data")
UPLOADS_DIR = DATA_DIR / "uploads"
DATA_FILE = DATA_DIR / "wines.json"

# Create directories
DATA_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

# Pydantic models - Python 3.13 compatible
class WineBase(BaseModel):
    name: str
    type: str
    region: str
    vintage: Optional[int] = Field(None, ge=1900, le=2100)
    rating: int = Field(ge=1, le=10)
    price: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = None
    photo: Optional[str] = None

class WineCreate(WineBase):
    pass

class Wine(WineBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Database functions
def load_wines() -> List[dict]:
    """Load wines from JSON file"""
    if not DATA_FILE.exists():
        return []
    
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('wines', [])
    except:
        return []

def save_wines(wines: List[dict]):
    """Save wines to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump({'wines': wines, 'last_updated': datetime.now().isoformat()}, f, indent=2)

# API Routes
@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "message": "Wine Notes API",
        "status": "running",
        "version": "2.0.0",
        "python": "3.13 compatible"
    }

@app.get("/api/wines", response_model=List[Wine])
def get_wines():
    """Get all wine notes"""
    wines = load_wines()
    return wines

@app.get("/api/wines/{wine_id}", response_model=Wine)
def get_wine(wine_id: str):
    """Get a specific wine note"""
    wines = load_wines()
    wine = next((w for w in wines if w['id'] == wine_id), None)
    if not wine:
        raise HTTPException(status_code=404, detail="Wine not found")
    return wine

@app.post("/api/wines", response_model=Wine)
def create_wine(wine: WineCreate):
    """Create a new wine note"""
    wines = load_wines()
    
    new_wine = {
        "id": str(uuid.uuid4()),
        **wine.model_dump(),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    wines.append(new_wine)
    save_wines(wines)
    
    return new_wine

@app.put("/api/wines/{wine_id}", response_model=Wine)
def update_wine(wine_id: str, wine: WineCreate):
    """Update a wine note"""
    wines = load_wines()
    
    wine_index = next((i for i, w in enumerate(wines) if w['id'] == wine_id), None)
    if wine_index is None:
        raise HTTPException(status_code=404, detail="Wine not found")
    
    updated_wine = {
        "id": wine_id,
        **wine.model_dump(),
        "created_at": wines[wine_index]['created_at'],
        "updated_at": datetime.now().isoformat()
    }
    
    wines[wine_index] = updated_wine
    save_wines(wines)
    
    return updated_wine

@app.delete("/api/wines/{wine_id}")
def delete_wine(wine_id: str):
    """Delete a wine note"""
    wines = load_wines()
    
    wine_index = next((i for i, w in enumerate(wines) if w['id'] == wine_id), None)
    if wine_index is None:
        raise HTTPException(status_code=404, detail="Wine not found")
    
    # Delete associated photo if exists
    wine = wines[wine_index]
    if wine.get('photo'):
        photo_path = UPLOADS_DIR / wine['photo'].split('/')[-1]
        if photo_path.exists():
            photo_path.unlink()
    
    wines.pop(wine_index)
    save_wines(wines)
    
    return {"message": "Wine deleted successfully"}

@app.post("/api/upload")
async def upload_photo(file: UploadFile = File(...)):
    """Upload a wine photo"""
    # Generate unique filename
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = UPLOADS_DIR / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": filename, "url": f"/api/uploads/{filename}"}

@app.get("/api/uploads/{filename}")
def get_upload(filename: str):
    """Serve uploaded photos"""
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

# For Railway deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)