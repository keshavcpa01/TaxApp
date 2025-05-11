from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)  # ✅ Unique username
    hashed_password = Column(String)

    # Optional: Relationship to access all 1099s submitted by this user
    forms = relationship("TaxForm1099NEC", back_populates="user")


class TaxForm1099NEC(Base):
    __tablename__ = "taxform_1099nec"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # ✅ Link to user
    user = relationship("User", back_populates="forms")

    # ✅ Payer fields
    payer_name = Column(String)
    payer_tin = Column(String)
    payer_address = Column(String)
    payer_city = Column(String)
    payer_state = Column(String)
    payer_zip = Column(String)
    payer_email = Column(String, nullable=True)

    # ✅ Recipient fields
    recipient_name = Column(String)
    recipient_tin = Column(String)
    recipient_phone = Column(String)
    recipient_address = Column(String)
    recipient_city = Column(String)
    recipient_state = Column(String)
    recipient_zip = Column(String)
    payment_date = Column(String)

    # ✅ Compensation and tax info
    nonemployee_compensation = Column(Numeric(10, 2))
    federal_income_tax_withheld = Column(Numeric(10, 2), default=0.00)
    state = Column(String, nullable=True)
    state_id = Column(String, nullable=True)
    state_income = Column(Numeric(10, 2), default=0.00)

    # ✅ Audit field
    created_at = Column(DateTime, default=datetime.now)
