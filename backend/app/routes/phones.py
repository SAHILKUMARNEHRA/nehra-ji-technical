from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.phone import Phone
from app.schemas.phone import PhoneCreate, Phone as PhoneSchema, RecommendationInput
from app.services.auth import get_current_admin
from app.services.phone_service import get_recommendation, compare_phones
from typing import List, Optional

from app.services.phone_generator import generate_phones

router = APIRouter(prefix="/phones", tags=["phones"])

@router.get("/sync-phones")
def sync_phones(db: Session = Depends(get_db)):
    # Programmatically generate 250+ smartphones including 2024-2025 models
    phone_dataset = generate_phones()

    added_count = 0
    skipped_count = 0
    for phone_data in phone_dataset:
        # Check if phone already exists by name
        existing_phone = db.query(Phone).filter(Phone.name == phone_data["name"]).first()
        if not existing_phone:
            new_phone = Phone(**phone_data)
            db.add(new_phone)
            added_count += 1
        else:
            # Update existing phone with new data (specs/image)
            for key, value in phone_data.items():
                setattr(existing_phone, key, value)
            skipped_count += 1
    
    db.commit()
    return {
        "status": "success", 
        "added": added_count, 
        "updated": skipped_count,
        "total_in_dataset": len(phone_dataset)
    }

@router.get("/", response_model=List[PhoneSchema])
def list_phones(
    db: Session = Depends(get_db),
    brand: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None)
):
    query = db.query(Phone)
    
    if brand:
        query = query.filter(Phone.brand == brand)
    if min_price is not None:
        query = query.filter(Phone.price >= min_price)
    if max_price is not None:
        query = query.filter(Phone.price <= max_price)
        
    return query.all()


@router.get("/{id}", response_model=PhoneSchema)
def get_phone(id: int, db: Session = Depends(get_db)):
    phone = db.query(Phone).filter(Phone.id == id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    return phone

@router.post("/", response_model=PhoneSchema)
def create_phone(phone: PhoneCreate, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    db_phone = Phone(**phone.model_dump())
    db.add(db_phone)
    db.commit()
    db.refresh(db_phone)
    return db_phone

@router.post("/recommend", response_model=List[PhoneSchema])
def recommend(input_data: RecommendationInput, db: Session = Depends(get_db)):
    return get_recommendation(db, input_data)

@router.get("/compare")
def compare(phone1: int, phone2: int, db: Session = Depends(get_db)):
    return compare_phones(db, phone1, phone2)
