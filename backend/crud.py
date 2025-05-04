from sqlalchemy.orm import Session
from . import models, schemas

def create_1099nec(db: Session, form_data: schemas.TaxForm1099NECCreate):
    new_form = models.TaxForm1099NEC(**form_data.dict())
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form
