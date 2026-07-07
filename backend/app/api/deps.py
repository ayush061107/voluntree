from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models import models
from app.schemas import auth as auth_schemas

# Directs FastAPI to look for a bearer token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Decodes a token, validates expiry, and checks if the user is a Volunteer."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role != "volunteer":
            raise credentials_exception
        token_data = auth_schemas.TokenPayload(sub=int(user_id), role=role)
    except JWTError:
        raise credentials_exception
        
    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == token_data.sub).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")
    return volunteer
def get_current_ngo(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Decodes a token, validates expiry, and checks if the user is an NGO."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role != "ngo":
            raise credentials_exception
        token_data = auth_schemas.TokenPayload(sub=int(user_id), role=role)
    except JWTError:
        raise credentials_exception
        
    ngo = db.query(models.NGO).filter(models.NGO.id == token_data.sub).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")
    return ngo
