from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas import application as schemas
from app.api.deps import get_current_user, get_current_ngo

router = APIRouter()

@router.post("/", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_to_opportunity(
    app_in: schemas.ApplicationCreate,
    current_user: models.Volunteer = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Allows an authenticated volunteer to apply for an active community opportunity."""
    if getattr(current_user, "role", None) == "ngo":
        raise HTTPException(status_code=403, detail="NGOs cannot apply for volunteer opportunities")

    opp = db.query(models.Opportunity).filter(models.Opportunity.id == app_in.opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    existing = db.query(models.Application).filter(
        models.Application.volunteer_id == current_user.id,
        models.Application.opportunity_id == app_in.opportunity_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this opportunity")

    new_app = models.Application(
        volunteer_id=current_user.id,
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

@router.get("/ngo/my-applications", response_model=List[schemas.ApplicationResponse])
def get_ngo_applications(
    current_user: models.NGO = Depends(get_current_ngo),
    db: Session = Depends(get_db)
):
    """Retrieves all incoming applications for opportunities managed by the logged-in NGO."""
    return db.query(models.Application).join(models.Opportunity).filter(
        models.Opportunity.ngo_id == current_user.id
    ).all()

@router.put("/{application_id}/status", response_model=schemas.ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: schemas.ApplicationUpdateStatus,
    current_user: models.NGO = Depends(get_current_ngo),
    db: Session = Depends(get_db)
):
    """Allows an NGO to Accept or Reject a specific volunteer application."""
    # Fetch application along with checking ownership via an explicit join condition
    application_data = db.query(models.Application, models.Opportunity.ngo_id)\
        .join(models.Opportunity, models.Application.opportunity_id == models.Opportunity.id)\
        .filter(models.Application.id == application_id).first()

    if not application_data:
        raise HTTPException(status_code=404, detail="Application record not found")

    application, ngo_id = application_data

    # Safe Guard check using the joined table record
    if ngo_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to modify this application")

    normalized_status = status_update.status.capitalize()
    if normalized_status not in ['Pending', 'Accepted', 'Approved', 'Rejected', 'Completed']:
        raise HTTPException(status_code=400, detail="Invalid status value.")

    application.status = normalized_status
    db.commit()
    db.refresh(application)
    return application
