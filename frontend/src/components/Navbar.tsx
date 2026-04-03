import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';

import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
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

  return (
    <nav className="shadow-lg sticky top-0 z-50 border-b border-blue-500/20 backdrop-blur" style={{ backgroundColor: 'var(--nav-bg)', color: 'var(--nav-text)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-10 w-auto rounded-lg" />
              <span className="text-xl font-bold text-blue-300 hidden sm:block">
                NEHRA JI TECHNICAL
              </span>
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
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="h-10 inline-flex items-center space-x-1 hover:text-blue-300 transition-colors whitespace-nowrap"
                  >
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
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-red-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium text-blue-300"
                  onClick={() => setIsOpen(false)}
                >
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
  );
};

export default Navbar;
