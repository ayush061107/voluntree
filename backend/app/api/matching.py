from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import models

router = APIRouter(prefix="/matching")

def calculate_match_score(volunteer: models.Volunteer, opportunity: models.Opportunity) -> float:
    """Computes a match percentage score based on overlapping interest and skill tags."""
    score = 0.0
    
    # 1. Evaluate Interest Matches (Weight: 60%)
    if volunteer.interests and opportunity.interests_category:
        # Normalize and split user interests into a set
        v_interests = {i.strip().lower() for i in volunteer.interests.split(",") if i.strip()}
        # Check if opportunity category hits one of the interests
        opp_category = opportunity.interests_category.strip().lower()
        if opp_category in v_interests:
            score += 60.0

    # 2. Evaluate Skill Matches (Weight: 40%)
    if volunteer.skills and opportunity.required_skills:
        v_skills = {s.strip().lower() for s in volunteer.skills.split(",") if s.strip()}
        opp_skills = {s.strip().lower() for s in opportunity.required_skills.split(",") if s.strip()}
        
        overlap = v_skills.intersection(opp_skills)
        if opp_skills:
            # Fraction of required skills met by volunteer multiplied by weight factor
            skill_ratio = len(overlap) / len(opp_skills)
            score += skill_ratio * 40.0
            
    return round(score, 2)

@router.get("/recommendations", response_model=List[Dict[str, Any]])
def get_recommendations(
    current_user: models.Volunteer = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyzes profile tags and returns active opportunities ranked by compatibility score."""
    opportunities = db.query(models.Opportunity).all()
    recommendations = []
    
    for opp in opportunities:
        score = calculate_match_score(current_user, opp)
        
        # Only suggest opportunities with some structural affinity
        if score > 0:
            recommendations.append({
                "id": opp.id,
                "ngo_id": opp.ngo_id,
                "title": opp.title,
                "description": opp.description,
                "interests_category": opp.interests_category,
                "required_skills": opp.required_skills,
                "location": opp.location,
                "match_score": f"{score}%"
            })
            
    # Sort recommendations by highest score descending
    recommendations.sort(key=lambda x: float(x["match_score"].replace("%", "")), reverse=True)
    return recommendations
