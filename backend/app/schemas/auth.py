from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    role: Optional[str] = None

class VolunteerRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    location: str

class NGORegister(BaseModel):
    email: EmailStr
    password: str
    org_name: str
    location: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str