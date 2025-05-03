from sqlalchemy.orm import Session
from . import models, schemas

def create_1099nec(db: Session, form_data: schemas.TaxForm1099NECCreate):
    db_form = models.TaxForm1099NEC(**form_data.model_dump())
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form
