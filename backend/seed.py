from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.phone import Phone
from app.models.user import User
from app.services.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    # Check if admin already exists
    admin_exists = db.query(User).filter(User.role == "admin").first()
    if not admin_exists:
        admin = User(
            name="Admin",
            email="admin@nehraji.com",
            password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)

    # Sample Phones
    phones = [
        Phone(
            name="iPhone 15 Pro",
            brand="Apple",
            price=129900,
            display="6.1-inch Super Retina XDR",
            battery="3274 mAh",
            processor="A17 Pro",
            camera="48MP Main | 12MP Ultra Wide",
            image="https://images.unsplash.com/photo-1695653422718-991eb7afb243?q=80&w=1974&auto=format&fit=crop",
            youtube="dQw4w9WgXcQ"
        ),
        Phone(
            name="Galaxy S24 Ultra",
            brand="Samsung",
            price=129999,
            display="6.8-inch Dynamic AMOLED 2X",
            battery="5000 mAh",
            processor="Snapdragon 8 Gen 3",
            camera="200MP Main | 12MP Ultra Wide | 50MP Telephoto",
            image="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2070&auto=format&fit=crop",
            youtube="M7lc1UVf-VE"
        ),
        Phone(
            name="OnePlus 12",
            brand="OnePlus",
            price=64999,
            display="6.82-inch QHD+ ProXDR",
            battery="5400 mAh",
            processor="Snapdragon 8 Gen 3",
            camera="50MP Main | 48MP Ultra Wide | 64MP Telephoto",
            image="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2127&auto=format&fit=crop",
            youtube="jNQXAC9IVRw"
        )
    ]

    for phone in phones:
        phone_exists = db.query(Phone).filter(Phone.name == phone.name).first()
        if not phone_exists:
            db.add(phone)

    db.commit()
    db.close()
    print("Database seeded!")

if __name__ == "__main__":
    seed_db()
