from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, Message as MessageSchema
from app.services.auth import get_current_user

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("/", response_model=MessageSchema)
def send_message(message: MessageCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_message = Message(
        user_id=user.id,
        name=message.name,
        email=message.email,
        message=message.message
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
