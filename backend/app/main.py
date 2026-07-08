from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, volunteer, certificates, opportunities, applications, matching 

Base.metadata.create_all(bind=engine)
app = FastAPI(title=settings.PROJECT_NAME)

# Setting allow_credentials=False allows us to use global wildcard origins seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(volunteer.router, prefix=f"{settings.API_V1_STR}/volunteers", tags=["Volunteer Core"])
app.include_router(opportunities.router, prefix=f"{settings.API_V1_STR}/opportunities", tags=["Opportunities"])
app.include_router(applications.router, prefix=f"{settings.API_V1_STR}/applications", tags=["Applications"])
app.include_router(matching.router, prefix=settings.API_V1_STR, tags=["AI Matching"])
app.include_router(certificates.router, prefix=f"{settings.API_V1_STR}/certificates", tags=["Impact Tracking"])

@app.get("/")
def read_root():
    return {"status": "online"}
