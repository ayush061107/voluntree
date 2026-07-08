import os
import sys

# Initialize environment fallbacks before loading settings
os.environ["SECRET_KEY"] = "super-secret-development-key-1234567890"
sys.path.insert(0, os.path.abspath("/workspaces/voluntree/backend"))

from app.core.database import SessionLocal, engine
from app.models.models import Opportunity, NGO, Volunteer

db = SessionLocal()

try:
    print("Checking for required user relationships...")
    
    # Ensure at least one NGO exists to own the opportunities
    ngo = db.query(NGO).first()
    if not ngo:
        print("Creating a seed NGO organization entry...")
        ngo = NGO(
            email="contact@greenearth.org",
            hashed_password="fakehashpassword123",
            org_name="Green Earth Foundation",
            location="Remote"
        )
        db.add(ngo)
        db.commit()
        db.refresh(ngo)

    # Let's count existing opportunities
    opp_count = db.query(Opportunity).count()
    print(f"Current total opportunities in DB: {opp_count}")
    
    if opp_count == 0:
        print("Seeding diverse community opportunities...")
        
        seed_opportunities = [
            Opportunity(
                ngo_id=ngo.id,
                title="AI & Python Developer Mentor",
                description="Help high school students code their first full-stack application! Looking for someone who can teach basic Python concepts, algorithms, and help debug structural logic error tracebacks.",
                interests_category="Technology",
                required_skills="Python, Git, Development",
                location="Remote"
            ),
            Opportunity(
                ngo_id=ngo.id,
                title="Community Garden Infrastructure Builder",
                description="Join us this Saturday to help build modern urban community garden frames, planting arrays, and distribute organic soil to neighborhood families.",
                interests_category="Environment",
                required_skills="Manual Labor, Teamwork",
                location="On-site"
            ),
            Opportunity(
                ngo_id=ngo.id,
                title="UI/UX Designer for Non-Profit Portal",
                description="Transform our legacy civic volunteer portal layout into an optimized, highly interactive frontend experience using modern layout workflows and component systems.",
                interests_category="Technology",
                required_skills="Design, UI/UX, React",
                location="Remote"
            )
        ]
        
        db.add_all(seed_opportunities)
        db.commit()
        print("Successfully seeded 3 rich opportunities into the database!")
    else:
        print("Opportunities already present. No seeding necessary.")

except Exception as e:
    print(f"Error seeding database: {e}")
    db.rollback()
finally:
    db.close()
