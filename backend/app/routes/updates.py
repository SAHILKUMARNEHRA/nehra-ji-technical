from fastapi import APIRouter
from datetime import datetime
import requests
import xml.etree.ElementTree as ET
from typing import Dict, List

router = APIRouter(prefix="/updates", tags=["updates"])


def _fetch_google_news(query: str, limit: int = 3) -> List[Dict[str, str]]:
    url = "https://news.google.com/rss/search"
    params = {"q": query, "hl": "en-IN", "gl": "IN", "ceid": "IN:en"}
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        root = ET.fromstring(response.text)
        items = root.findall(".//item")
        results: List[Dict[str, str]] = []
        for item in items[:limit]:
            results.append(
                {
                    "title": item.findtext("title", default=""),
                    "link": item.findtext("link", default=""),
                    "pubDate": item.findtext("pubDate", default=""),
                }
            )
        return results
    except Exception:
        return []


@router.get("/live")
def get_live_updates():
    os_queries = {
        "google": "Android 16 latest update Google official",
        "apple": "iOS latest update Apple official",
        "oneplus": "OxygenOS latest update OnePlus",
        "oppo": "ColorOS latest update OPPO",
        "vivo": "Funtouch OS latest update Vivo",
        "realme": "realme UI latest update",
    }

    processor_queries = {
        "snapdragon": "Snapdragon new chipset launch",
        "mediatek": "Dimensity new chipset launch",
        "apple_silicon": "Apple A series chipset launch",
    }

    leaks_query = "smartphone leak rumor launch latest"

    os_updates = {key: _fetch_google_news(query, 2) for key, query in os_queries.items()}
    processor_updates = {key: _fetch_google_news(query, 2) for key, query in processor_queries.items()}
    leaks = _fetch_google_news(leaks_query, 8)

    return {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "os_updates": os_updates,
        "processor_updates": processor_updates,
        "leaks": leaks,
    }
