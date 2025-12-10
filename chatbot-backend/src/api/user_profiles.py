# src/api/user_profiles.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any

# Adjust the import path based on your project structure
from ..models.user_profile import UserProfile
from ..services import user_service
from ..services.firebase import verify_id_token

router = APIRouter()

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    uid = verify_id_token(token)
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"uid": uid}


@router.post("/user-profiles/{user_id}", status_code=status.HTTP_201_CREATED)
async def create_or_update_profile(
    user_id: str,
    profile: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this profile")
        
    success = user_service.create_or_update_user_profile(user_id, profile)
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create or update profile")
    return {"message": "Profile created or updated successfully"}


@router.get("/user-profiles/{user_id}", response_model=UserProfile)
async def get_profile(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    if user_id != current_user["uid"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this profile")

    profile_data = user_service.get_user_profile(user_id)
    if profile_data is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    
    return UserProfile(user_id=user_id, profile_data=profile_data)
