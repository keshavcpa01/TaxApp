from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from backend.pdf_utils import generate_1099_pdf
import tempfile
import os
from backend.email_utils import send_confirmation_email


from backend import auth, security, models, crud, schemas
from backend.database import SessionLocal, engine
from backend.email_utils import send_confirmation_email

# Only run ONCE in dev. Never drop all on production.
# models.Base.metadata.drop_all(bind=engine)  # 🔥 CAUTION: This deletes all tables

# Create tables if they don’t exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS for Render + Local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://taxapp-frontend.onrender.com",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}

@app.get("/ping-db")
def ping_database(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return auth.create_user(db, user)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    token = security.create_access_token(data={"sub": str(user.id)})  # ✅ Fixed here
    return {"access_token": token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/submit-1099/", response_model=schemas.TaxForm1099NEC)
def submit_1099(form: schemas.TaxForm1099NECCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_1099nec(db=db, form_data=form, user_id=current_user.id)

@app.post("/submit-multiple-1099/")
def submit_multiple_1099(
    forms: List[schemas.TaxForm1099NECCreate],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        created_forms = [crud.create_1099nec(db, form_data=form, user_id=current_user.id) for form in forms]

        if forms and forms[0].payer_email:
            # Save PDF to temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
                generate_1099_pdf([form.dict() for form in forms], temp_pdf.name)

                # Send email with attachment
                send_confirmation_email(
                to_email=forms[0].payer_email,
                payer_name=forms[0].payer_name,
                count=len(created_forms),
                attachment_path=temp_pdf.name
                )

                os.unlink(temp_pdf.name)  # Clean up

        return created_forms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/submissions", response_model=List[schemas.TaxForm1099NEC])
def get_all_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_1099s(db, user_id=current_user.id)

@app.get("/submissions/recent", response_model=List[schemas.TaxForm1099NEC])
def get_recent_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return (
        db.query(models.TaxForm1099NEC)
        .filter(models.TaxForm1099NEC.user_id == current_user.id)
        .order_by(models.TaxForm1099NEC.created_at.desc())
        .limit(1)
        .all()
    )

@app.get("/test-email")
def test_email(to: str = Query(...)):
    send_confirmation_email(to_email=to, payer_name="Test Payer", count=1)
    return {"message": f"Email sent to {to}"}

@app.get("/debug-tables")
def debug_tables(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public';"))
    return {"tables": [row[0] for row in result]}

@app.get("/test-email-pdf")
def test_email_with_pdf(
    to: str = Query(..., description="Email address to send confirmation"),
):
    from backend.pdf_utils import generate_1099_pdf
    from backend.email_utils import send_confirmation_email
    import tempfile, os

    fake_data = [{
        "payer_name": "Test Payer",
        "payer_tin": "12-3456789",
        "payer_address": "123 Test Ave",
        "recipient_name": "John Doe",
        "recipient_tin": "987-65-4321",
        "recipient_address": "456 Sample St",
        "nonemployee_compensation": 5500.00,
        "federal_income_tax_withheld": 300.00,
        "state": "IL",
        "state_id": "IL12345",
        "state_income": 5500.00,
    }]

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            generate_1099_pdf(fake_data, temp_pdf.name)

            send_confirmation_email(
                to_email=to,
                payer_name="Test Payer",
                count=1,
                attachment_path=temp_pdf.name
            )

            os.unlink(temp_pdf.name)

        return {"message": f"📧 Test email sent to {to}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
