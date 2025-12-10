# src/models/user_profile.py
from pydantic import BaseModel
from typing import Dict, Any

class UserProfile(BaseModel):
    user_id: str
    profile_data: Dict[str, Any]
