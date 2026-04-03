import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ExternalLink, Newspaper, Calendar, AlertCircle } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source_name: string;
}

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const maybe = err as { response?: { data?: { detail?: string } } };
    return maybe.response?.data?.detail || fallback;
  }
  return fallback;
};

const TechNews: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/news');
        setNews(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching news:', err);
        setError(extractErrorMessage(err, 'Failed to fetch tech news. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Fetching latest tech news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-100 rounded-[32px] p-12 inline-block shadow-xl shadow-red-50">
          <AlertCircle className="text-red-500 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">Oops! Something went wrong</h2>
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
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
          <Newspaper size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Tech News</h1>
          <p className="text-gray-500 font-medium">Curated tech updates for smartphone enthusiasts</p>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg font-medium">No relevant tech news found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {news.map((article, index) => (
            <article key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={article.urlToImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop'} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop';
                  }}
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20">
                  {article.source_name}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                  <Calendar size={14} />
                  {new Date(article.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
                  {article.description || "No description available for this article."}
                </p>
                
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-gray-50 hover:bg-blue-600 text-gray-900 hover:text-white py-4 rounded-2xl font-bold transition-all group/btn"
                >
                  Read Full Article <ExternalLink size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechNews;
