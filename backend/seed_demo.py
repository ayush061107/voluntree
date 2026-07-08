import sys, os
sys.path.append("/workspaces/voluntree/backend")

from app.core.database import SessionLocal, engine
from app.models.models import Base, NGO, Volunteer, Opportunity, Application
from app.core.security import get_password_hash

# Build fresh tables cleanly
Base.metadata.create_all(bind=engine)
db = SessionLocal()

try:
    hashed_pwd = get_password_hash("hackathon2026")
    
    # Ingest the real administrative NGO
    ngo = NGO(org_name="Habitat for Humanity", email="demo_admin@habitat.org", hashed_password=hashed_pwd, location="Remote")
    db.add(ngo)
    db.commit()
    db.refresh(ngo)

    # Ingest the target listings
    opps = [
        Opportunity(title="Remote Python Mentor", description="Guide junior developers building open-source tools.", interests_category="Technology", required_skills="Python, Git", location="Remote", ngo_id=ngo.id),
        Opportunity(title="Community Tree Planting", description="Help urban reforestation efforts locally.", interests_category="Environment", required_skills="None", location="Greenwood Park", ngo_id=ngo.id),
        Opportunity(title="After-School Math Tutor", description="Support elementary school pupils with algebra basics.", interests_category="Education", required_skills="Math, Patience", location="Downtown Center", ngo_id=ngo.id),
        Opportunity(title="Social Media Coordinator", description="Manage updates and campaigns for global outreach.", interests_category="Marketing", required_skills="Social Media, Canva", location="Remote", ngo_id=ngo.id),
    ]
    db.add_all(opps)
    db.commit()

    # Create the test applicant profiles
    v1 = Volunteer(full_name="Alex Rivera", email="alex@test.com", hashed_password=hashed_pwd, location="New York")
    v2 = Volunteer(full_name="Sam Taylor", email="sam@test.com", hashed_password=hashed_pwd, location="San Francisco")
    db.add(v1)
    db.add(v2)
    db.commit()
    db.refresh(v1)
    db.refresh(v2)

    # Place applications into the pipeline slots
    app1 = Application(opportunity_id=opps[0].id, volunteer_id=v1.id, status="Pending")
    app2 = Application(opportunity_id=opps[1].id, volunteer_id=v2.id, status="Pending")
    db.add_all([app1, app2])
    db.commit()
    
    print("✅ Seed Successful! Database initialized cleanly.")
except Exception as e:
    print(f"❌ Failed: {e}")
finally:
    db.close()
