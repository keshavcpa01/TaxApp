print("🚀 FastAPI backend is running")

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text

from . import models, crud, schemas
from .database import SessionLocal, engine, Base

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI()

# CORS: Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://frontend-lyrv.onrender.com",  # Replace with your actual frontend
        "http://localhost:3000"  # Optional: for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root route
@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}

# Ping DB route
@app.get("/ping-db")
def ping_database(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}

# Submit 1099-NEC
@app.post("/submit-1099/", response_model=schemas.TaxForm1099NEC)
def submit_1099(form: schemas.TaxForm1099NECCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_1099nec(db=db, form_data=form)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/submissions", response_model=List[schemas.TaxForm1099NEC])
def get_all_submissions(db: Session = Depends(get_db)):
    return crud.get_all_1099s(db)
