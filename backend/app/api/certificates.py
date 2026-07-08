from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import models
from app.schemas import certificate as schemas
from app.api.deps import get_current_user, get_current_ngo

router = APIRouter()

@router.post("/log-hours", response_model=schemas.CertificateResponse, status_code=status.HTTP_201_CREATED)
def log_volunteer_hours(
    cert_in: schemas.CertificateCreate,
    current_user: models.NGO = Depends(get_current_ngo),
    db: Session = Depends(get_db)
):
    """Allows an NGO to verify hours and issue an impact certificate for a volunteer application."""
    if not hasattr(current_user, "org_name"):
        raise HTTPException(status_code=403, detail="Only NGOs can verify hours and issue certificates")

    application = db.query(models.Application).filter(models.Application.id == cert_in.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application record not found")

    if application.opportunity.ngo_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to log hours for this application")

    existing_cert = db.query(models.Certificate).filter(models.Certificate.application_id == cert_in.application_id).first()
    if existing_cert:
        raise HTTPException(status_code=400, detail="Hours have already been logged for this application")

    if cert_in.hours_logged <= 0:
        raise HTTPException(status_code=400, detail="Logged hours must be greater than zero")

    application.status = "Completed"

    new_certificate = models.Certificate(
        application_id=cert_in.application_id,
        hours_logged=cert_in.hours_logged
    )
    
    db.add(new_certificate)
    db.commit()
    db.refresh(new_certificate)
    return new_certificate

@router.get("/", response_model=List[schemas.CertificateResponse])
def get_my_certificates(
    current_user: models.Volunteer = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows a volunteer to view all their verified service certificates and hours."""
    # Guard: Ensure current logged in user profile role matches a volunteer session
    if getattr(current_user, "org_name", None) is not None:
        raise HTTPException(status_code=403, detail="NGOs do not hold individual volunteer certificates")

    return db.query(models.Certificate).join(models.Application).filter(
        models.Application.volunteer_id == current_user.id
    ).all()
