from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Phone(Base):
    __tablename__ = "phones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, index=True)
    price = Column(Integer)
    display = Column(String)
    battery = Column(String)
    processor = Column(String)
    camera = Column(String)
    ram = Column(String) # Added RAM
    storage = Column(String) # Added Storage
    image = Column(String)  # Local asset path or reliable placeholder
    status = Column(String, default="Released") # Released, Rumored, Leaked, Concept, etc.
    launch = Column(String, nullable=True) # e.g. "Sept 2026"
