from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Base Properties shared across schemas
class ApplicationBase(BaseModel):
    opportunity_id: int

# Schema used when a volunteer submits an application
class ApplicationCreate(ApplicationBase):
    pass

# Schema used by NGOs to update the status ('Pending', 'Accepted', 'Rejected', 'Completed')
class ApplicationUpdateStatus(BaseModel):
    status: str

# Minimal opportunity nested layout for response cleanliness
class OpportunityMiniResponse(BaseModel):
    id: int
    title: str
    location: str
    
    class Config:
        from_attributes = True

# Complete return object for applications
class ApplicationResponse(BaseModel):
    id: int
    volunteer_id: int
    opportunity_id: int
    status: str
    applied_at: datetime
    opportunity: OpportunityMiniResponse

    class Config:
        from_attributes = True