from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.core.database import Base

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(Text, unique=True, nullable=False, index=True)
    hashed_password = Column(Text, nullable=False)
    org_name = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(Text, nullable=False)
    website = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # If an NGO is deleted, its posted opportunities are automatically deleted
    opportunities = relationship("Opportunity", back_populates="ngo", cascade="all, delete-orphan")


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(Text, unique=True, nullable=False, index=True)
    hashed_password = Column(Text, nullable=False)
    full_name = Column(Text, nullable=False)
    skills = Column(Text, nullable=True)          # Comma-separated tags for matching
    interests = Column(Text, nullable=True)       # Comma-separated tags for matching
    location = Column(Text, nullable=False)
    availability = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("Application", back_populates="volunteer", cascade="all, delete-orphan")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id", ondelete="CASCADE"), nullable=False)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False)
    interests_category = Column(Text, nullable=False)
    location = Column(Text, nullable=False)
    availability_needed = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ngo = relationship("NGO", back_populates="opportunities")
    applications = relationship("Application", back_populates="opportunity", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum('Pending', 'Accepted', 'Rejected', 'Completed', name='application_status'), default='Pending')
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)

    volunteer = relationship("Volunteer", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")
    certificate = relationship("Certificate", uselist=False, back_populates="application", cascade="all, delete-orphan")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    hours_logged = Column(Integer, default=0, nullable=False)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="certificate")