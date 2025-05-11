from sqlalchemy.orm import Session
from . import models, schemas

def create_1099nec(db: Session, form_data: schemas.TaxForm1099NECCreate, username: str):
    new_form = models.TaxForm1099NEC(**form_data.dict(), username=username)
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form

def get_all_1099s(db: Session):
    return db.query(models.TaxForm1099NEC).all()

def create_multiple_1099s(db: Session, forms: list[schemas.TaxForm1099NECCreate], username: str):
    entries = [models.TaxForm1099NEC(**form.dict(), username=username) for form in forms]
    db.add_all(entries)
    db.commit()
    return entries
