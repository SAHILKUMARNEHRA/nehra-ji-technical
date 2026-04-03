from fastapi import APIRouter, HTTPException
import os
import requests
from typing import List
from app.schemas.news import NewsArticle

router = APIRouter(prefix="/news", tags=["news"])

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

@router.get("/", response_model=List[NewsArticle])
def get_tech_news():
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not configured")

    # Define the keywords for search
    query = "smartphone OR iphone OR samsung OR laptop OR android OR technology"
    api_url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&language=en&apiKey={NEWS_API_KEY}"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        
        articles = data.get("articles", [])
        
        # Filtering keywords
        filter_keywords = ["iphone", "samsung", "smartphone", "laptop", "launch", "feature", "AI", "chip"]
        
        filtered_articles = []
        for art in articles:
            title = art.get("title", "").lower()
            # Check if any filter keyword is in the title
            if any(kw in title for kw in filter_keywords):
                filtered_articles.append(
                    NewsArticle(
                        title=art.get("title", ""),
                        description=art.get("description", ""),
                        url=art.get("url", ""),
                        urlToImage=art.get("urlToImage", ""),
                        publishedAt=art.get("publishedAt", ""),
                        source_name=art.get("source", {}).get("name", "Unknown")
                    )
                )
        
        return filtered_articles
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")
