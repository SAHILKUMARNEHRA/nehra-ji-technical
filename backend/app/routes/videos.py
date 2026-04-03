from fastapi import APIRouter, HTTPException
import os
import requests
from typing import List
from app.schemas.video import YouTubeVideo

router = APIRouter(prefix="/videos", tags=["videos"])

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
# Specific Channel ID for Nehra Ji Technical as requested
CHANNEL_ID = "UClhrUInDxdoVIjiIPrjZ5QA"

@router.get("/", response_model=List[YouTubeVideo])
def get_videos():
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YOUTUBE_API_KEY not configured")

    try:
        # Step 1: Get the 'uploads' playlist ID for the channel
        channel_url = f"https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id={CHANNEL_ID}&key={YOUTUBE_API_KEY}"
        channel_res = requests.get(channel_url)
        channel_res.raise_for_status()
        channel_data = channel_res.json()
        
        if not channel_data.get("items"):
            raise HTTPException(status_code=404, detail="Channel not found")
            
        uploads_playlist_id = channel_data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        # Step 2: Fetch videos from the uploads playlist
        playlist_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={uploads_playlist_id}&maxResults=12&key={YOUTUBE_API_KEY}"
        playlist_res = requests.get(playlist_url)
        playlist_res.raise_for_status()
        playlist_data = playlist_res.json()
        
        items = playlist_data.get("items", [])
        videos = []
        
        for item in items:
            snippet = item.get("snippet", {})
            videos.append(
                YouTubeVideo(
                    id=snippet.get("resourceId", {}).get("videoId", ""),
                    title=snippet.get("title", ""),
                    thumbnail=snippet.get("thumbnails", {}).get("high", {}).get("url", ""),
                    publishedAt=snippet.get("publishedAt", "")
                )
            )
        
        return videos
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch YouTube videos: {str(e)}")
