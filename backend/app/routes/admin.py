from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets
from app.database import get_db
from app.models.message import Message
from app.models.suggestion import Suggestion
from app.models.user import User
from app.models.login_event import LoginEvent
from app.schemas.message import Message as MessageSchema
from app.schemas.suggestion import Suggestion as SuggestionSchema
from app.schemas.user import User as UserSchema
from app.schemas.login_event import LoginEvent as LoginEventSchema
from app.services.auth import get_current_admin
from app.services.auth import get_password_hash
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/messages", response_model=List[MessageSchema])
def get_messages(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Message).all()

@router.get("/suggestions", response_model=List[SuggestionSchema])
def get_suggestions(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Suggestion).all()

@router.get("/users", response_model=List[UserSchema])
def get_users(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.id.desc()).all()

@router.get("/logins", response_model=List[LoginEventSchema])
def get_login_events(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(LoginEvent).order_by(LoginEvent.id.desc()).all()

@router.post("/users/{user_id}/reset-password")
def reset_user_password(user_id: int, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    temp_password = secrets.token_urlsafe(8)
    user.password = get_password_hash(temp_password)
    db.commit()
    return {
        "status": "ok",
        "user_id": user.id,
        "email": user.email,
        "temporary_password": temp_password,
    }
