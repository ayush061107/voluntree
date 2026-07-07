from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.models import models
from app.api import auth, volunteer, opportunities, applications, matching 

# Automatically creates all MySQL tables on application startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registrations
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(volunteer.router, prefix=f"{settings.API_V1_STR}/volunteers", tags=["Volunteer Core"])
app.include_router(opportunities.router, prefix=f"{settings.API_V1_STR}/opportunities", tags=["Opportunities"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["Applications"])
app.include_router(matching.router, prefix=settings.API_V1_STR, tags=["AI Matching"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings.PROJECT_NAME} MySQL-Backed API Engine."}