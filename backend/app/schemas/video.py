from pydantic import BaseModel

class YouTubeVideo(BaseModel):
    id: str
    title: str
    thumbnail: str
    publishedAt: str
