from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApplicationCreate(BaseModel):
    opportunity_id: int

class ApplicationUpdateStatus(BaseModel):
    status: str # 'Pending', 'Accepted', 'Rejected', 'Completed'

class ApplicationResponse(BaseModel):
    id: int
    volunteer_id: int
    opportunity_id: int
    status: str
    applied_at: datetime

    class Config:
        from_attributes = True
