from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from uuid import UUID, uuid4

# Load environment variables
load_dotenv()

# Database setup (should ideally be in a separate config/db file)
DATABASE_URL = os.getenv("NEON_DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("NEON_DATABASE_URL is not set in environment variables")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session (for API routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Import models
from src.models import User, UserProfile, Base # Assuming Base is needed for metadata






router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

# --- JWT Configuration ---
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # For example

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/signin")

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = verify_token(token, credentials_exception)
    user = db.query(User).filter(User.id == UUID(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


# --- Request/Response Models ---
class LanguageSkill(BaseModel):
    language: str
    level: str

class UserProfileCreate(BaseModel):
    languages: List[LanguageSkill] = []
    frameworks: List[str] = []
    experience_years: Optional[str] = None
    architecture_familiarity: List[str] = []

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    # Add other fields if needed, but avoid password_hash

class LoginResponse(BaseModel):
    user: UserResponse
    profile: Optional[UserProfileCreate] # Use UserProfileCreate as a base, adapt as needed
    token: str

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    profile_data: UserProfileCreate

# --- External Service Imports ---
from src.services.auth_service import auth_service as better_auth_wrapper, AuthDetails # Our wrapper for better-auth.com and AuthDetails

@router.post("/signup", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1. Validate credentials with Better Auth service
    try:
        better_auth_response = await better_auth_wrapper.sign_up(
            AuthDetails(email=user_data.email, password=user_data.password)
        )
        # Assuming better_auth_response contains a user ID from better-auth
        better_auth_id = better_auth_response.get("user", {}).get("id") # Adjust based on actual better-auth response
        if not better_auth_id:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Better Auth user ID not returned")

    except Exception as e:
        print(f"Error from better_auth_wrapper.sign_up: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # 2. Check if user already exists in our DB (by email, for safety)
    if db.query(User).filter(User.email == user_data.email).first():
        # This case should ideally be handled by Better Auth first, but good to have a fallback
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    # 3. Hash password (Better Auth handles this, but if we ever needed local storage...)
    # For now, we trust better-auth has done this. We only store better_auth_id.
    
    # 4. Create User in our database
    db_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash="***", # Placeholder, as password handling is externalized
        better_auth_id=better_auth_id
    )
    db.add(db_user)
    db.flush() # Flush to get db_user.id before creating profile

    # 5. Create UserProfile in our database
    db_profile = UserProfile(
        user_id=db_user.id,
        languages=[lang.dict() for lang in user_data.profile_data.languages],
        frameworks=user_data.profile_data.frameworks,
        experience_years=user_data.profile_data.experience_years,
        architecture_familiarity=user_data.profile_data.architecture_familiarity,
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_user)
    db.refresh(db_profile)

    # 6. Create our own access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    profile_data = UserProfileCreate(
        languages=db_profile.languages,
        frameworks=db_profile.frameworks,
        experience_years=db_profile.experience_years,
        architecture_familiarity=db_profile.architecture_familiarity,
    )

    return LoginResponse(
        user=UserResponse(id=str(db_user.id), email=db_user.email, full_name=db_user.full_name),
        profile=profile_data,
        token=access_token
    )

@router.post("/signin", response_model=LoginResponse)
async def signin(auth_details: AuthDetails, db: Session = Depends(get_db)):
    try:
        better_auth_response = await better_auth_wrapper.sign_in(auth_details)
        better_auth_id = better_auth_response.get("user", {}).get("id")
        session_token = better_auth_response.get("token") # Placeholder, adjust as per actual better-auth response

        if not better_auth_id or not session_token:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Better Auth user ID or token not returned")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    # 2. Retrieve user from our database
    db_user = db.query(User).filter(User.better_auth_id == better_auth_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found in our database")

    # 3. Create our own access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    # 4. Retrieve user profile
    db_profile_orm = db.query(UserProfile).filter(UserProfile.user_id == db_user.id).first()
    
    profile_data = None
    if db_profile_orm:
        profile_data = UserProfileCreate(
            languages=db_profile_orm.languages, # Assuming JSONB is automatically converted
            frameworks=db_profile_orm.frameworks,
            experience_years=db_profile_orm.experience_years,
            architecture_familiarity=db_profile_orm.architecture_familiarity,
        )

    return LoginResponse(
        user=UserResponse(id=str(db_user.id), email=db_user.email, full_name=db_user.full_name),
        profile=profile_data,
        token=access_token
    )

@router.post("/logout")
async def logout():
    return JSONResponse(content={"message": "Logged out successfully"})

# --- User Profile Endpoints ---
@router.get("/users/me", response_model=LoginResponse) # Use LoginResponse to return user and profile
async def read_users_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_profile_orm = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    profile_data = None
    if db_profile_orm:
        profile_data = UserProfileCreate(
            languages=db_profile_orm.languages,
            frameworks=db_profile_orm.frameworks,
            experience_years=db_profile_orm.experience_years,
            architecture_familiarity=db_profile_orm.architecture_familiarity,
        )
    return LoginResponse(
        user=UserResponse(id=str(current_user.id), email=current_user.email, full_name=current_user.full_name),
        profile=profile_data,
        token="" # Token not sent on /me endpoint
    )

@router.put("/users/me", response_model=LoginResponse)
async def update_users_me(
    profile_update: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

    db_profile.languages = [lang.dict() for lang in profile_update.languages]
    db_profile.frameworks = profile_update.frameworks
    db_profile.experience_years = profile_update.experience_years
    db_profile.architecture_familiarity = profile_update.architecture_familiarity
    db_profile.updated_at = datetime.utcnow() # Update timestamp

    db.commit()
    db.refresh(db_profile)

    return LoginResponse(
        user=UserResponse(id=str(current_user.id), email=current_user.email),
        profile=profile_update, # Return the updated profile data
        token=""
    )
