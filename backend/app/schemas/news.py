from pydantic import BaseModel
from typing import Optional

class NewsArticle(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    urlToImage: Optional[str] = None
    publishedAt: str
    source_name: str
