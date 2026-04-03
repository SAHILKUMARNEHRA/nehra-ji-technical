import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Youtube, PlayCircle, ExternalLink, AlertCircle } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const maybe = err as { response?: { data?: { detail?: string } } };
    return maybe.response?.data?.detail || fallback;
  }
  return fallback;
};

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/videos');
        setVideos(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching videos:', err);
        setError(extractErrorMessage(err, 'Failed to fetch YouTube videos. Please check your API key.'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading latest videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-100 rounded-[32px] p-12 inline-block shadow-xl shadow-red-50">
          <AlertCircle className="text-red-500 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">Oops! YouTube API Error</h2>
          <p className="text-red-600 font-medium mb-8 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-100">
          <Youtube size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Latest Videos</h1>
          <p className="text-gray-500 font-medium">Watch our latest unboxing and tech reviews from YouTube</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg font-medium">No videos found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
              >
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <PlayCircle className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" size={64} />
                      </div>
                  </div>
                  <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                          {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm font-medium">
                          <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                              <ExternalLink size={12} /> YouTube
                          </span>
                      </div>
                  </div>
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-20 bg-red-50 rounded-[40px] p-12 text-center border border-red-100">
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase">Never Miss an Update</h2>
        <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
          Subscribe to our YouTube channel for daily tech updates, unboxings, and detailed reviews in Hindi.
        </p>
        <a 
            href="https://youtube.com/@NEHRAJITECHNICAL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 rounded-full font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200"
        >
            <Youtube size={28} /> SUBSCRIBE NOW
        </a>
      </div>
    </div>
  );
};

export default Videos;
