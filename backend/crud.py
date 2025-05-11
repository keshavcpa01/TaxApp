from sqlalchemy.orm import Session
from backend import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = user.password  # Replace with actual hashing
    db_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_1099nec(db: Session, form_data: schemas.TaxForm1099NECCreate, user_id: int):
    new_form = models.TaxForm1099NEC(**form_data.dict(), user_id=user_id)
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form

def get_user_1099s(db: Session, user_id: int):
    return db.query(models.TaxForm1099NEC).filter(models.TaxForm1099NEC.user_id == user_id).all()
