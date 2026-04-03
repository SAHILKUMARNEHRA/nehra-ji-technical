from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.suggestion import Suggestion
from app.schemas.suggestion import SuggestionCreate, Suggestion as SuggestionSchema
from app.services.auth import get_current_user

router = APIRouter(prefix="/suggestion", tags=["suggestion"])

@router.post("/", response_model=SuggestionSchema)
def send_suggestion(suggestion: SuggestionCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_suggestion = Suggestion(
        user_id=user.id,
        text=suggestion.text
    )
    db.add(db_suggestion)
    db.commit()
    db.refresh(db_suggestion)
    return db_suggestion
