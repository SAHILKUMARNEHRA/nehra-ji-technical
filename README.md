# Nehra Ji Technical - Full Stack Web Application

A clean, professional smartphone comparison and recommendation platform built with FastAPI and React.

## Features
- **Phone Listing & Details**: Browse the latest smartphones with detailed specs.
- **Comparison System**: Compare two phones side-by-side with value highlighting.
- **Smart Recommendation**: Get phone suggestions based on your budget and usage (Gaming, Camera, etc.).
- **Tech News & Videos**: Stay updated with the latest tech news and YouTube reviews.
- **Admin Dashboard**: Manage messages, suggestions, and add new phones.
- **Secure Auth**: Manual email/password authentication with JWT and bcrypt.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide Icons.
- **Backend**: FastAPI (Python), PostgreSQL (via SQLAlchemy), JWT, bcrypt.

## Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL database

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

- Create a `.env` file based on `.env.example` and fill in your details.
- Run the seed script to create the admin user and sample data:
```bash
export PYTHONPATH=$PYTHONPATH:.
python seed.py
```

- Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Admin Credentials (Seeded)
- **Email**: `admin@nehraji.com`
- **Password**: `admin123`

## API Key Placeholders
- `YOUTUBE_API_KEY`: Add your YouTube Data API v3 key in `.env`.
- `NEWS_API_KEY`: Add your NewsAPI.org key in `TechNews.tsx` or `.env`.

## Folder Structure
- `backend/app/`: Modular FastAPI logic (routes, models, schemas, services).
- `frontend/src/`: React source code (pages, components, context, services).
- `frontend/src/assets/images/`: Local image assets.
