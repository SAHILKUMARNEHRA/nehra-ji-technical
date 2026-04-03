from pydantic import BaseModel, EmailStr
from typing import Optional

class MessageBase(BaseModel):
    name: str
    email: EmailStr
    message: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
