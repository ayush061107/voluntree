from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Schema used when an NGO logs hours and issues a certificate
class CertificateCreate(BaseModel):
    application_id: int
    hours_logged: int

# Schema used to display individual certificate details
class CertificateResponse(BaseModel):
    id: int
    application_id: int
    hours_logged: int
    issued_at: datetime

    class Config:
        from_attributes = True