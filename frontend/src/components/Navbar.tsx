import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Sun, Moon, Settings, KeyRound, Loader2, ShoppingCart } from 'lucide-react';
import api from '../services/api';

import logo from '../assets/logo.png';

type ProfilePanel = 'edit' | 'password' | null;

const Navbar: React.FC = () => {
  const { user, setUser, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<ProfilePanel>(null);
  const [fullName, setFullName] = React.useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [profileMessage, setProfileMessage] = React.useState('');
  const [profileError, setProfileError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  React.useEffect(() => {
    setFullName(user?.name || '');
  }, [user?.name]);

  React.useEffect(() => {
    if (!isAuthenticated || user) return;
    let mounted = true;
    api
      .get('/auth/me')
      .then((res) => {
        if (mounted) setUser(res.data);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, setUser, user]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const handleOpenPanel = (panel: ProfilePanel) => {
    setActivePanel(panel);
    setProfileError('');
    setProfileMessage('');
    setIsProfileOpen(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setIsSaving(true);
    try {
      const res = await api.put('/auth/profile', { name: fullName.trim() });
      setUser(res.data);
      setProfileMessage('Profile updated successfully.');
    } catch {
      setProfileError('Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileMessage('');
    if (newPassword.length < 6) {
      setProfileError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setProfileError('New password and confirm password do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setProfileMessage('Password changed successfully.');
    } catch {
      setProfileError('Unable to change password. Check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: 'Processors', path: '/processors' },
    { name: 'Videos', path: '/videos' },
    { name: 'Recommendation', path: '/recommendation' },
    { name: 'Tech News', path: '/news' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const userInitial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <>
      <nav className="shadow-lg sticky top-0 z-50 border-b border-blue-500/20 backdrop-blur" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-10 w-auto rounded-lg" loading="lazy" />
                <span className="text-xl font-bold text-blue-300 hidden sm:block">NEHRA JI TECHNICAL</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-8 flex items-center gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap leading-none h-10 inline-flex items-center"
                  >
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-blue-500 text-white hover:bg-blue-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap leading-none h-10 inline-flex items-center"
                  >
                    Admin
                  </Link>
                )}

                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen((v) => !v)}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white font-black inline-flex items-center justify-center"
                      title="Open profile options"
                    >
                      {userInitial}
                    </button>
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-2xl p-2">
                        <button
                          onClick={() => handleOpenPanel('edit')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 text-sm font-semibold inline-flex items-center gap-2"
                        >
                          <Settings size={16} />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => handleOpenPanel('password')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 text-sm font-semibold inline-flex items-center gap-2"
                        >
                          <KeyRound size={16} />
                          Change Password
                        </button>
                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-sm font-semibold inline-flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="h-10 inline-flex items-center space-x-1 hover:text-blue-300 transition-colors whitespace-nowrap">
                      <User size={18} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/admin-login"
                      className="text-xs font-bold px-3 py-2 rounded-md border border-blue-400/40 text-blue-300 hover:bg-white/10 whitespace-nowrap h-10 inline-flex items-center"
                    >
                      Admin Login
                    </Link>
                  </>
                )}

                <button
                  onClick={toggleTheme}
                  className="ml-2 inline-flex items-center justify-center p-2 rounded-md border border-blue-400/30 hover:bg-white/10"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <Link
                  to="/cart"
                  className="ml-2 inline-flex items-center justify-center p-2 rounded-md border border-blue-400/30 hover:bg-white/10 text-blue-300"
                  title="View Cart"
                >
                  <ShoppingCart size={17} />
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <Link
                to="/cart"
                className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                <ShoppingCart size={24} />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden" style={{ backgroundColor: 'var(--nav-bg)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block bg-blue-500 text-white hover:bg-blue-400 px-3 py-2 rounded-md text-base font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      handleOpenPanel('edit');
                      setIsOpen(false);
                    }}
                    className="w-full text-left block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      handleOpenPanel('password');
                      setIsOpen(false);
                    }}
                    className="w-full text-left block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-blue-300" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/admin-login"
                    className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-blue-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Login
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="w-full text-left block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-blue-300"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {activePanel && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6">
            <h3 className="text-xl font-black text-gray-900 mb-4">
              {activePanel === 'edit' ? 'Edit Profile' : 'Change Password'}
            </h3>

            {profileError && <p className="mb-4 rounded-xl bg-red-50 text-red-600 p-3 text-sm font-semibold">{profileError}</p>}
            {profileMessage && <p className="mb-4 rounded-xl bg-green-50 text-green-700 p-3 text-sm font-semibold">{profileMessage}</p>}

            {activePanel === 'edit' ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your full name"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold"
                  >
                    Close
                  </button>
                  <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-60">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Current password"
                  required
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="New password"
                  required
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Confirm new password"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold"
                  >
                    Close
                  </button>
                  <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-60">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
