from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas import opportunity as schemas

router = APIRouter()

@router.post("/", response_model=schemas.OpportunityResponse, status_code=status.HTTP_201_CREATED)
def create_opportunity(
    opp_in: schemas.OpportunityCreate, 
    ngo_id: int, # Temporary parameter until we attach your get_current_user dependency
    db: Session = Depends(get_db)
):
    """Allows a registered NGO to post a new volunteering opportunity."""
    ngo = db.query(models.NGO).filter(models.NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO account not found")

    new_opp = models.Opportunity(
        ngo_id=ngo_id,
        title=opp_in.title,
        description=opp_in.description,
        required_skills=opp_in.required_skills,
        interests_category=opp_in.interests_category,
        location=opp_in.location,
        availability_needed=opp_in.availability_needed
    )
    db.add(new_opp)
    db.commit()
    db.refresh(new_opp)
    return new_opp

@router.get("/", response_model=List[schemas.OpportunityResponse])
def list_opportunities(db: Session = Depends(get_db)):
    """Returns a full list of all available volunteer opportunities across the platform."""
    return db.query(models.Opportunity).all()
