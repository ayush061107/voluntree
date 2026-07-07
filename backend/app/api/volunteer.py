from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import models
from app.schemas import volunteer as volunteer_schemas

router = APIRouter()

@router.get("/me", response_model=volunteer_schemas.VolunteerResponse)
def get_my_profile(current_user: models.Volunteer = Depends(get_current_user)):
    """Retrieves the profile data of the logged-in volunteer."""
    return current_user


@router.put("/me", response_model=volunteer_schemas.VolunteerResponse)
def update_my_profile(
    profile_data: volunteer_schemas.VolunteerUpdate,
    db: Session = Depends(get_db),
    current_user: models.Volunteer = Depends(get_current_user)
):
    """Updates the logged-in volunteer's custom profile variables."""
    # Loop over fields and apply updates dynamically if provided
    update_data = profile_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/dashboard", response_model=volunteer_schemas.VolunteerDashboard)
def get_volunteer_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: models.Volunteer = Depends(get_current_user)
):
    """Calculates active analytical metrics to display on the volunteer's main UI view."""
    # 1. Fetch total applications count
    apps_count = db.query(models.Application).filter(models.Application.volunteer_id == current_user.id).count()
    
    # 2. Fetch completed applications that generated a certificate
    completed_apps = db.query(models.Application).filter(
        models.Application.volunteer_id == current_user.id,
        models.Application.status == "Completed"
    ).all()
    
    certificates_count = len(completed_apps)
    
    # 3. Aggregate hours from connected certificates
    total_hours = 0
    for app in completed_apps:
        if app.certificate:
            total_hours += app.certificate.hours_logged
            
    # Simple MVP Impact Score Formula: Hours * 10 points + 50 points per finished project
    impact_score = (total_hours * 10) + (certificates_count * 50)

    return {
        "volunteer_hours": total_hours,
        "impact_score": impact_score,
        "certificates_count": certificates_count,
        "applications_count": apps_count
    }