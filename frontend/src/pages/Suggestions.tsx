import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lightbulb, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Suggestions: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    api.post('/suggestion', { text })
      .then(() => {
        setSuccess(true);
        setText('');
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="text-yellow-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to send us your suggestions.</p>
          <Link to="/login" className="block bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-[100px] flex items-start justify-end p-6">
            <Lightbulb className="text-yellow-400" size={40} />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Your Suggestions</h1>
          <p className="text-gray-500 text-lg mb-12">Help us improve Nehra Ji Technical. We value your feedback!</p>

          {success ? (
            <div className="bg-green-50 border border-green-100 rounded-3xl p-10 text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-green-900 mb-2">Thank You!</h3>
              <p className="text-green-700 mb-8 text-lg">Your suggestion has been recorded. We'll look into it!</p>
              <button 
                onClick={() => setSuccess(false)}
                className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all"
              >
                Send Another Suggestion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">What can we improve?</label>
                <textarea 
                  required
                  rows={6}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Tell us what you'd like to see more of..."
                  className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[32px] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg leading-relaxed shadow-inner"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] shadow-2xl shadow-blue-200"
              >
                {loading ? 'Submitting...' : <><Send size={24}/> Submit Suggestion</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
