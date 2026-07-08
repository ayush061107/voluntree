from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    
    # Status states: 'PENDING', 'ACCEPTED', 'REJECTED'
    status = Column(String(50), default="PENDING", nullable=False)
    applied_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships so we can easily fetch nested data later
    volunteer = relationship("Volunteer", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")