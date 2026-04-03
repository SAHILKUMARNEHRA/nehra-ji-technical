from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
import requests
import secrets
from app.database import get_db
from app.models.user import User
from app.models.login_event import LoginEvent
from app.schemas.user import UserCreate, User as UserSchema
from app.schemas.auth import (
    Login,
    Token,
    GoogleAuthRequest,
    ProfileUpdateRequest,
    ChangePasswordRequest,
)
from app.services.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


def record_login_event(db: Session, user: User, provider: str) -> None:
    event = LoginEvent(
        user_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        provider=provider,
    )
    db.add(event)
    db.commit()

@router.get("/google-client-id")
def get_google_client_id():
    return {"google_client_id": os.getenv("GOOGLE_CLIENT_ID", "")}

@router.post("/signup", response_model=UserSchema)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(login_data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    record_login_event(db, user, "password")
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.post("/admin-login", response_model=Token)
def admin_login(login_data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    record_login_event(db, user, "admin-password")
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.post("/google", response_model=Token)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        google_res = requests.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": payload.id_token},
            timeout=10,
        )
    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Unable to verify Google token")

    if google_res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    token_data = google_res.json()
    email = token_data.get("email")
    email_verified = str(token_data.get("email_verified", "")).lower() == "true"
    name = token_data.get("name") or (email.split("@")[0] if email else "Google User")
    aud = token_data.get("aud")

    expected_client_id = os.getenv("GOOGLE_CLIENT_ID")
    if expected_client_id and aud != expected_client_id:
        raise HTTPException(status_code=401, detail="Google client mismatch")

    if not email or not email_verified:
        raise HTTPException(status_code=400, detail="Google account email not verified")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            password=get_password_hash(secrets.token_urlsafe(32)),
            role="user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    record_login_event(db, user, "google")
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}


@router.get("/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserSchema)
def update_profile(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clean_name = payload.name.strip()
    if not clean_name:
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    if len(clean_name) > 80:
        raise HTTPException(status_code=400, detail="Name is too long")

    current_user.name = clean_name
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    current_user.password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
