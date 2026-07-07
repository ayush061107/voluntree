from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models import models
from app.schemas import auth as auth_schemas

router = APIRouter()

@router.post("/register/volunteer", status_code=status.HTTP_201_CREATED)
def register_volunteer(user_in: auth_schemas.VolunteerRegister, db: Session = Depends(get_db)):
    """Registers a brand new individual volunteer account."""
    user = db.query(models.Volunteer).filter(models.Volunteer.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="This email is already registered as a volunteer.")
    
    hashed_password = get_password_hash(user_in.password)
    new_volunteer = models.Volunteer(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        location=user_in.location,
        skills="",      
        interests=""    
    )
    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)
    return {"message": "Volunteer account created successfully", "user_id": new_volunteer.id}


@router.post("/register/ngo", status_code=status.HTTP_201_CREATED)
def register_ngo(user_in: auth_schemas.NGORegister, db: Session = Depends(get_db)):
    """Registers a brand new Non-Governmental Organization account."""
    user = db.query(models.NGO).filter(models.NGO.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="This email is already registered as an NGO.")
    
    hashed_password = get_password_hash(user_in.password)
    new_ngo = models.NGO(
        email=user_in.email,
        hashed_password=hashed_password,
        org_name=user_in.org_name,
        location=user_in.location
    )
    db.add(new_ngo)
    db.commit()
    db.refresh(new_ngo)
    return {"message": "NGO account created successfully", "org_id": new_ngo.id}


@router.post("/login", response_model=auth_schemas.Token)
def login(login_data: auth_schemas.UserLogin, db: Session = Depends(get_db)):
    """Universal login endpoint checking both tables and issuing a secure role-based JWT."""
    # 1. Search the volunteer table
    volunteer = db.query(models.Volunteer).filter(models.Volunteer.email == login_data.email).first()
    if volunteer and verify_password(login_data.password, volunteer.hashed_password):
        token = create_access_token(subject=volunteer.id, role="volunteer")
        return {"access_token": token, "token_type": "bearer", "role": "volunteer"}
        
    # 2. Search the NGO table
    ngo = db.query(models.NGO).filter(models.NGO.email == login_data.email).first()
    if ngo and verify_password(login_data.password, ngo.hashed_password):
        token = create_access_token(subject=ngo.id, role="ngo")
        return {"access_token": token, "token_type": "bearer", "role": "ngo"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
    