import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { MessageSquare, Lightbulb, PlusCircle, User } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
}

interface Suggestion {
  id: number;
  user_id: number;
  text: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface LoginEvent {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  provider: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logins, setLogins] = useState<LoginEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'suggestions' | 'users' | 'logins' | 'add-phone'>('messages');
  
  // Form for adding phone
  const [phoneForm, setPhoneForm] = useState({
    name: '', brand: '', price: 0, display: '', battery: '', processor: '', camera: '', image: '', youtube: ''
  });

  useEffect(() => {
    if (isAdmin) {
      api.get('/admin/messages').then(res => setMessages(res.data));
      api.get('/admin/suggestions').then(res => setSuggestions(res.data));
      api.get('/admin/users').then(res => setUsers(res.data));
      api.get('/admin/logins').then(res => setLogins(res.data));
    }
  }, [isAdmin]);

  const handleResetPassword = async (userId: number) => {
    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`);
      alert(`Temporary password generated for ${response.data.email}: ${response.data.temporary_password}`);
    } catch {
      alert('Failed to reset password');
    }
  };

  const handleAddPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/phones', phoneForm);
      alert('Phone added successfully!');
      setPhoneForm({ name: '', brand: '', price: 0, display: '', battery: '', processor: '', camera: '', image: '', youtube: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add phone');
    }
  };

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 space-y-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-2">
            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">Overview</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 rounded-xl py-2">
                <p className="text-lg font-black text-gray-900">{users.length}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Users</p>
              </div>
              <div className="bg-gray-50 rounded-xl py-2">
                <p className="text-lg font-black text-gray-900">{messages.length}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Connect</p>
              </div>
              <div className="bg-gray-50 rounded-xl py-2 col-span-2">
                <p className="text-lg font-black text-gray-900">{suggestions.length}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Video/Topic Suggestions</p>
              </div>
            </div>
          </div>
          <TabButton 
            active={activeTab === 'messages'} 
            onClick={() => setActiveTab('messages')}
            icon={<MessageSquare size={20}/>}
            label="Connect Requests"
            count={messages.length}
          />
          <TabButton 
            active={activeTab === 'suggestions'} 
            onClick={() => setActiveTab('suggestions')}
            icon={<Lightbulb size={20}/>}
            label="Topic Suggestions"
            count={suggestions.length}
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon={<User size={20}/>}
            label="User Logins"
            count={users.length}
          />
          <TabButton
            active={activeTab === 'logins'}
            onClick={() => setActiveTab('logins')}
            icon={<MessageSquare size={20}/>}
            label="Login Activity"
            count={logins.length}
          />
          <TabButton 
            active={activeTab === 'add-phone'} 
            onClick={() => setActiveTab('add-phone')}
            icon={<PlusCircle size={20}/>}
            label="Add Phone"
          />
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">User Messages</h2>
                {messages.map(msg => (
                  <div key={msg.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{msg.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{msg.email}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center text-gray-400 py-10">No messages found</p>}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Suggested Video Topics</h2>
                {suggestions.map(sug => (
                  <div key={sug.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-4 text-gray-400">
                        <User size={16}/>
                        <span className="text-xs font-bold uppercase tracking-widest">User ID: {sug.user_id}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{sug.text}</p>
                  </div>
                ))}
                {suggestions.length === 0 && <p className="text-center text-gray-400 py-10">No suggestions found</p>}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">User Logins / Accounts</h2>
                {users.map(user => (
                  <div key={user.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-black text-gray-900">{user.name}</p>
                      <p className="text-sm text-blue-600 font-medium">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                        >
                          Reset Password
                        </button>
                      )}
                      <span className="text-xs font-black uppercase tracking-widest bg-white border border-gray-200 px-3 py-1 rounded-full">ID {user.id}</span>
                      <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p className="text-center text-gray-400 py-10">No users found</p>}
              </div>
            )}

            {activeTab === 'logins' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Login Activity</h2>
                {logins.map(event => (
                  <div key={event.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-black text-gray-900">{event.name}</p>
                      <p className="text-sm text-blue-600 font-medium">{event.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Provider: {event.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest bg-white border border-gray-200 px-3 py-1 rounded-full">
                        {new Date(event.created_at).toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${event.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {event.role}
                      </span>
                    </div>
                  </div>
                ))}
                {logins.length === 0 && <p className="text-center text-gray-400 py-10">No login activity yet</p>}
              </div>
            )}

            {activeTab === 'add-phone' && (
              <div>
                <h2 className="text-2xl font-bold mb-8">Add New Smartphone</h2>
                <form onSubmit={handleAddPhone} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Name</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.name}
                      onChange={e => setPhoneForm({...phoneForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Brand</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.brand}
                      onChange={e => setPhoneForm({...phoneForm, brand: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price (INR)</label>
                    <input 
                      type="number" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.price}
                      onChange={e => setPhoneForm({...phoneForm, price: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Display</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.display}
                      onChange={e => setPhoneForm({...phoneForm, display: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Processor</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.processor}
                      onChange={e => setPhoneForm({...phoneForm, processor: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Battery</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.battery}
                      onChange={e => setPhoneForm({...phoneForm, battery: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Camera</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.camera}
                      onChange={e => setPhoneForm({...phoneForm, camera: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image Path (local)</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.image}
                      onChange={e => setPhoneForm({...phoneForm, image: e.target.value})}
                      placeholder="/src/assets/images/..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">YouTube Video ID</label>
                    <input 
                      type="text"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phoneForm.youtube}
                      onChange={e => setPhoneForm({...phoneForm, youtube: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 transition-all"
                    >
                      Save Phone to Database
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }> = ({ active, onClick, icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-bold">{label}</span>
    </div>
    {count !== undefined && <span className={`text-xs font-black px-2 py-1 rounded-full ${active ? 'bg-blue-500' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
  </button>
);

export default AdminDashboard;
