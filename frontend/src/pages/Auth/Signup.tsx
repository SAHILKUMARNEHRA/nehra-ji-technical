import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Signup: React.FC = () => {
  const FALLBACK_GOOGLE_CLIENT_ID = '725677667661-7ckvolf5qbatvoqdqace0fva3i7dragc.apps.googleusercontent.com';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [googleHint, setGoogleHint] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const envGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const currentOrigin = window.location.origin;

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const maybe = err as { response?: { data?: { detail?: string } } };
      return maybe.response?.data?.detail || fallback;
    }
    return fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { name, email, password, role: 'user' });
      navigate('/login');
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Signup failed'));
    }
  };

  useEffect(() => {
    let active = true;

    const initGoogle = async () => {
      if (!googleButtonRef.current) return;
      let googleClientId = envGoogleClientId || FALLBACK_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        try {
          const cfg = await api.get('/auth/google-client-id');
          googleClientId = cfg.data?.google_client_id || '';
        } catch {
          googleClientId = '';
        }
      }

      if (!active || !googleClientId) {
        setGoogleHint(`Set GOOGLE_CLIENT_ID (backend .env) or VITE_GOOGLE_CLIENT_ID (frontend .env). Current origin: ${currentOrigin}`);
        setGoogleReady(false);
        return;
      }

      const renderGoogleButton = () => {
        if (!window.google || !googleButtonRef.current || !active) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: GoogleIdCredentialResponse) => {
            try {
              const res = await api.post('/auth/google', { id_token: response.credential });
              const me = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${res.data.access_token}` },
              });
              login(res.data.access_token, res.data.role, me.data);
              navigate('/');
            } catch (err: unknown) {
              const detail = extractErrorMessage(err, 'Google sign-up failed');
              if (String(detail).toLowerCase().includes('mismatch')) {
                setError(`Google origin/client mismatch. Add this JavaScript origin in Google Cloud OAuth settings: ${currentOrigin}`);
              } else {
                setError(detail);
              }
            }
          },
        });

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 360,
          text: 'signup_with',
        });
        setGoogleHint('');
        setGoogleReady(true);
      };

      if (window.google?.accounts?.id) {
        renderGoogleButton();
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        const checkExisting = window.setInterval(() => {
          if (window.google?.accounts?.id) {
            window.clearInterval(checkExisting);
            renderGoogleButton();
          }
        }, 200);
        window.setTimeout(() => {
          window.clearInterval(checkExisting);
          if (!window.google?.accounts?.id && active) {
            setGoogleHint('Could not load Google sign-in script. Please disable ad-block/privacy extensions and refresh.');
            setGoogleReady(false);
          }
        }, 4000);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.onerror = () => {
        if (!active) return;
        setGoogleHint('Could not load Google sign-in script. Please disable ad-block/privacy extensions and refresh.');
        setGoogleReady(false);
      };
      document.body.appendChild(script);
    };

    initGoogle();

    return () => {
      active = false;
    };
  }, [FALLBACK_GOOGLE_CLIENT_ID, currentOrigin, envGoogleClientId, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100 backdrop-blur">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Create Account</h2>
          <p className="text-gray-500 font-medium">Join Nehra Ji Technical</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 text-center">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18}/></span>
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18}/></span>
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-100"
          >
            Sign Up <ArrowRight size={20}/>
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">or</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        <div className="flex justify-center">
          <div ref={googleButtonRef} />
        </div>
        {!googleReady && (
          <p className="text-center text-xs text-amber-600 font-medium">
            Google sign-up is disabled. {googleHint}
          </p>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
