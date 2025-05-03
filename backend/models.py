from sqlalchemy import Column, Integer, String, Float
from .database import Base

class TaxForm1099NEC(Base):
    __tablename__ = "taxform_1099nec"

    id = Column(Integer, primary_key=True, index=True)
    payer_name = Column(String)
    payer_tin = Column(String)
    payer_address = Column(String)
    recipient_name = Column(String)
    recipient_tin = Column(String)
    recipient_address = Column(String)
    amount_paid = Column(Float)
