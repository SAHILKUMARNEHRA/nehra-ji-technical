from sqlalchemy.orm import Session
from app.models.phone import Phone
from app.schemas.phone import RecommendationInput
from typing import List

def get_recommendation(db: Session, input_data: RecommendationInput) -> List[Phone]:
    # 1. Filter by budget
    query = db.query(Phone).filter(Phone.price <= input_data.budget)
    
    # 2. Apply logic based on usage
    # Since we store specs as strings, we do a basic ordering. 
    # For a production app, we might want numeric fields for battery (mAh) etc.
    # But following the current schema:
    
    if input_data.usage == "gaming":
        # Prioritize processor
        return query.order_by(Phone.processor.desc()).limit(3).all()
    elif input_data.usage == "camera":
        # Prioritize camera
        return query.order_by(Phone.camera.desc()).limit(3).all()
    elif input_data.usage == "battery":
        # Prioritize battery
        return query.order_by(Phone.battery.desc()).limit(3).all()
    else: # performance / default
        # Prioritize processor
        return query.order_by(Phone.processor.desc()).limit(3).all()

def compare_phones(db: Session, phone1_id: int, phone2_id: int):
    phone1 = db.query(Phone).filter(Phone.id == phone1_id).first()
    phone2 = db.query(Phone).filter(Phone.id == phone2_id).first()
    return {"phone1": phone1, "phone2": phone2}
