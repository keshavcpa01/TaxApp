print("🚀 THIS IS THE ACTIVE main.py FILE")
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import SessionLocal, engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Allow frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ React port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test route
@app.get("/ping")
def ping():
    return {"message": "pong"}

# Submit 1099-NEC route
@app.post("/submit-1099/", response_model=schemas.TaxForm1099NEC)
def submit_1099(form: schemas.TaxForm1099NECCreate, db: Session = Depends(get_db)):
    print("✅ Received POST /submit-1099/")  # <- THIS should log on terminal
    return crud.create_1099nec(db=db, form_data=form)


