from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OpportunityBase(BaseModel):
    title: str
    description: str
    required_skills: str
    interests_category: str
    location: str
    availability_needed: Optional[str] = None

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityResponse(OpportunityBase):
    id: int
    ngo_id: int
    created_at: datetime

    class Config:
        from_attributes = True
