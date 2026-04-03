import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    api.post('/contact', formData)
      .then(() => {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-blue-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to send us a message.</p>
          <Link to="/login" className="block bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/3 bg-blue-600 p-12 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Get in Touch</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Have questions about a smartphone? Want us to review a specific product? Send us a message!
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-2xl"><Mail size={20} /></div>
              <span className="text-sm font-bold">SK.NEHRA2005@GMAIL.COM</span>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 p-12">
          {success ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600 mb-8">Thank you for reaching out. We'll get back to you soon.</p>
              <button onClick={() => setSuccess(false)} className="text-blue-600 font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18}/></span>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18}/></span>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                <div className="relative">
                  <span className="absolute left-4 top-6 text-gray-400"><MessageSquare size={18}/></span>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-100"
              >
                {loading ? 'Sending...' : <><Send size={20}/> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
