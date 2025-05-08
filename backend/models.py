from sqlalchemy import Column, Integer, String, Numeric
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class TaxForm1099NEC(Base):
    __tablename__ = "taxform_1099nec"

    id = Column(Integer, primary_key=True, index=True)

    # Payer information
    payer_name = Column(String, nullable=False)
    payer_tin = Column(String, nullable=False)
    payer_address = Column(String, nullable=False)
    payer_city = Column(String, nullable=False)
    payer_state = Column(String, nullable=False)
    payer_zip = Column(String, nullable=False)

    # Recipient information
    recipient_name = Column(String, nullable=False)
    recipient_tin = Column(String, nullable=False)
    recipient_address = Column(String, nullable=False)
    recipient_city = Column(String, nullable=False)
    recipient_state = Column(String, nullable=False)
    recipient_zip = Column(String, nullable=False)

    # 1099-NEC amounts
    nonemployee_compensation = Column(Numeric(10, 2), nullable=False)  # Box 1
    federal_income_tax_withheld = Column(Numeric(10, 2), nullable=True)  # Box 4
    state = Column(String, nullable=True)  # Box 5
    state_id = Column(String, nullable=True)  # Box 6
    state_income = Column(Numeric(10, 2), nullable=True)  # Box 7
