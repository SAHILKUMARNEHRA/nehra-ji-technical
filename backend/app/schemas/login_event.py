from pydantic import BaseModel
from datetime import datetime


class LoginEvent(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    role: str
    provider: str
    created_at: datetime

    class Config:
        from_attributes = True
