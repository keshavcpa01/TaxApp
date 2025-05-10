from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import text
from . import auth, security  # make sure this is imported

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
        "https://taxapp-frontend.onrender.com",  # Replace with your actual frontend
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
def get_all_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_all_1099s(db)


@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return auth.create_user(db, user)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = security.create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/debug-tables")
def debug_tables(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public';"))
    return {"tables": [row[0] for row in result]}
