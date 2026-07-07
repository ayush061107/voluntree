from pydantic import BaseModel, EmailStr
from typing import Optional, List

# Form shape when a volunteer updates their profile metrics
class VolunteerUpdate(BaseModel):
    full_name: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None       # e.g., "Python, Graphic Design, Teaching"
    interests: Optional[str] = None    # e.g., "Education, Environment, Animals"
    availability: Optional[str] = None # e.g., "Weekends, 5 hours/week"

# Outbound profile layout sent to the frontend view
class VolunteerResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    location: str
    skills: Optional[str]
    interests: Optional[str]
    availability: Optional[str]

    class Config:
        from_attributes = True

# Outbound dashboard summary container
class VolunteerDashboard(BaseModel):
    volunteer_hours: int
    impact_score: int
    certificates_count: int
    applications_count: int