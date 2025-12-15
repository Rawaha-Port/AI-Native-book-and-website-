from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    better_auth_id = Column(String(255), unique=True, nullable=True) # Assuming better_auth provides an ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    languages = Column(JSONB, nullable=False) # e.g., [{"language": "Python", "level": "Intermediate"}]
    frameworks = Column(JSONB, nullable=False) # e.g., ["React", "FastAPI"]
    experience_years = Column(String(50), nullable=True) # e.g., "3-5"
    devices = Column(JSONB, nullable=True) # e.g., ["MacBook Pro", "iPad"]
    architecture_familiarity = Column(JSONB, nullable=True) # e.g., ["Microservices", "Serverless"]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")
