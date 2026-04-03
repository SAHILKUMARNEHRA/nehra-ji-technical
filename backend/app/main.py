from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, phones, contact, suggestions, admin, news, videos, updates
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Attempt to create tables on startup
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Successfully connected to Neon and initialized tables.")
except SQLAlchemyError as e:
    logger.error(f"Failed to connect to Neon database: {str(e)}")
    # In a production app, we might not want to raise an error here to allow other parts of the app to function,
    # but for this specific requirement, we want it to be clear if the DB fails.
    # raise e

def ensure_default_admins():
    default_admins = [
        ("Admin One", "admin1@nehraji.com", "Admin@1234"),
        ("Admin Two", "admin2@nehraji.com", "Admin@1234"),
        ("Admin Three", "admin3@nehraji.com", "Admin@1234"),
        ("Admin Four", "admin4@nehraji.com", "Admin@1234"),
    ]
    db: Session = SessionLocal()
    try:
        for name, email, password in default_admins:
            existing = db.query(User).filter(User.email == email).first()
            if existing:
                continue
            db.add(
                User(
                    name=name,
                    email=email,
                    password=get_password_hash(password),
                    role="admin",
                )
            )
        db.commit()
    finally:
        db.close()

ensure_default_admins()

app = FastAPI(title="Nehra Ji Technical API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check for database
@app.get("/health")
def health_check():
    try:
        # Simple query to test DB connection
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Database connection failed")

# Include routers
app.include_router(auth.router)
app.include_router(phones.router)
app.include_router(contact.router)
app.include_router(suggestions.router)
app.include_router(admin.router)
app.include_router(news.router)
app.include_router(videos.router)
app.include_router(updates.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Nehra Ji Technical API"}
