from pydantic import BaseModel
from typing import Optional

class SuggestionBase(BaseModel):
    text: str

class SuggestionCreate(SuggestionBase):
    pass

class Suggestion(SuggestionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
