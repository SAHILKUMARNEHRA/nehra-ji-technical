from pydantic import BaseModel
from typing import Optional

class PhoneBase(BaseModel):
    name: str
    brand: str
    price: int
    display: str
    battery: str
    processor: str
    camera: str
    ram: str
    storage: str
    image: str
    status: Optional[str] = "Released"
    launch: Optional[str] = None

class PhoneCreate(PhoneBase):
    pass

class Phone(PhoneBase):
    id: int

    class Config:
        from_attributes = True

class RecommendationInput(BaseModel):
    budget: int
    usage: str # gaming, camera, battery, performance
