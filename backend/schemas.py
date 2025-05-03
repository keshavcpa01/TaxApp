from pydantic import BaseModel

class TaxForm1099NECBase(BaseModel):
    payer_name: str
    payer_tin: str
    payer_address: str
    recipient_name: str
    recipient_tin: str
    recipient_address: str
    amount_paid: float

class TaxForm1099NECCreate(TaxForm1099NECBase):
    pass

class TaxForm1099NEC(TaxForm1099NECBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2+
