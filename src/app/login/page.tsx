'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  User, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Key, 
  Moon, 
  Sun 
} from 'lucide-react';
import { dbService, isDemoMode, Profile } from '@/lib/supabaseClient';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const u = await dbService.getCurrentUser();
        setUser(u);
        if (u) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'signup') {
        if (!username || username.length < 3) {
          setError('Username must be at least 3 characters.');
          setLoading(false);
          return;
        }
        const res = await dbService.signUp(username, email);
        if (res.success) {
          router.push('/dashboard');
        } else {
          setError(res.error || 'Signup failed.');
        }
      } else {
        const res = await dbService.login(email);
        if (res.success) {
          router.push('/dashboard');
        } else {
          setError(res.error || 'User not found. Try creating an account.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9fa] text-[#202124] font-sans select-none overflow-x-hidden">
      
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 border-[#dadce0] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-xl shadow-md">
              J
            </div>
            <span className="font-outfit font-black text-2xl tracking-tight">Joault</span>
          </Link>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto px-6 py-12 flex-grow flex flex-col justify-center">
        <div className="p-8 md:p-10 rounded-[32px] border bg-white border-[#dadce0] shadow-2xl space-y-6">
          
          <div className="text-left">
            <h2 className="font-outfit font-bold text-2xl mb-1">
              {activeTab === 'login' ? 'Log in to Joault' : 'Create a new account'}
            </h2>
            <p className="text-xs text-[#5f6368]">
              {activeTab === 'login' ? 'Access your group spaces and auth protocols' : 'Start or join a group space today'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider ml-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none bg-[#f1f3f4] border-[#dadce0] text-[#202124] focus:border-[#1a73e8]"
                  required={activeTab === 'signup'}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none bg-[#f1f3f4] border-[#dadce0] text-[#202124] focus:border-[#1a73e8]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="google-pill-btn w-full py-4 text-base font-bold shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>{activeTab === 'login' ? 'Log In' : 'Sign Up'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <a href="#" className="text-xs text-[#1a73e8] hover:underline font-bold">
                Forgotten account or protocol key?
              </a>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dadce0]"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 uppercase font-mono font-bold bg-white text-[#5f6368]">OR</span>
              </div>
            </div>

            {activeTab === 'login' ? (
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(null); }}
                className="google-pill-outlined w-full py-3.5 text-xs font-bold"
              >
                Create new account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className="google-pill-outlined w-full py-3.5 text-xs font-bold"
              >
                Sign in to existing account
              </button>
            )}

          </form>

          <div className="pt-4 border-t border-[#dadce0]/30 text-center flex items-center justify-center gap-1.5 text-[11px] text-[#5f6368] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#1a73e8]" />
            <span>Protected by Joault Auth Protocol Keys</span>
          </div>

        </div>
      </main>

      <footer className="w-full border-t py-6 px-6 text-center text-xs bg-white border-[#dadce0] text-[#5f6368]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Joault Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-[#1a73e8] font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
