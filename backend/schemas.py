from pydantic import BaseModel, EmailStr
from typing import Optional
from decimal import Decimal

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TaxForm1099NECCreate(BaseModel):
    payer_name: str
    payer_tin: str
    payer_address: str
    payer_city: str
    payer_state: str
    payer_zip: str
    payer_email: Optional[EmailStr] = None

    recipient_name: str
    recipient_tin: str
    recipient_address: str
    recipient_city: str
    recipient_state: str
    recipient_zip: str
    payment_date: Optional[str] = None

    nonemployee_compensation: Decimal
    federal_income_tax_withheld: Optional[Decimal] = 0.00
    state: Optional[str] = None
    state_id: Optional[str] = None
    state_income: Optional[Decimal] = 0.00

class TaxForm1099NEC(TaxForm1099NECCreate):
    id: int
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
