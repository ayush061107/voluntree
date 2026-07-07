from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas import application as schemas

router = APIRouter()

@router.post("/", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_opportunity(
    app_in: schemas.ApplicationCreate,
    volunteer_id: int, # Temporary parameter until dependencies are fully linked
    db: Session = Depends(get_db)
):
    """Allows an authenticated volunteer to apply for an active community opportunity."""
    # Check if opportunity exists
    opp = db.query(models.Opportunity).filter(models.Opportunity.id == app_in.opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    # Prevent duplicate applications
    existing = db.query(models.Application).filter(
        models.Application.volunteer_id == volunteer_id,
        models.Application.opportunity_id == app_in.opportunity_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this opportunity")

    new_app = models.Application(
        volunteer_id=volunteer_id,
        opportunity_id=app_in.opportunity_id,
        status="Pending"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/volunteer/{volunteer_id}", response_model=List[schemas.ApplicationResponse])
def get_volunteer_applications(volunteer_id: int, db: Session = Depends(get_db)):
    """Retrieves all historical applications submitted by a specific volunteer account."""
    return db.query(models.Application).filter(models.Application.volunteer_id == volunteer_id).all()
