'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ShieldCheck 
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
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#0f1419] font-sans select-none overflow-x-hidden">
      
      <header className="sticky top-0 z-50 w-full border-b bg-white border-[#f0f0f1]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-black text-lg">
              J
            </div>
            <span className="font-outfit font-black text-2xl tracking-tight">Joault</span>
          </Link>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto px-6 py-12 flex-grow flex flex-col justify-center">
        <div className="p-8 rounded-3xl border bg-white border-[#f0f0f1] shadow-sm space-y-6">
          
          <div className="text-left">
            <h2 className="font-outfit font-bold text-2xl mb-1">
              {activeTab === 'login' ? 'Log in to Joault' : 'Create an account'}
            </h2>
            <p className="text-xs text-zinc-500">
              {activeTab === 'login' ? 'Enter your details to access your spaces' : 'Quick registration to join your community'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-3.5 rounded-full border text-xs outline-none bg-zinc-100 border-zinc-200 text-black"
                  required={activeTab === 'signup'}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3.5 rounded-full border text-xs outline-none bg-zinc-100 border-zinc-200 text-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-black text-white font-bold text-sm shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (activeTab === 'login' ? 'Log in' : 'Sign up')}
            </button>

            <div className="text-center pt-1">
              <a href="#" className="text-xs text-zinc-500 hover:underline font-medium">
                Forgotten account?
              </a>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-white px-3 text-zinc-400 font-mono uppercase font-bold">OR</span>
              </div>
            </div>

            {activeTab === 'login' ? (
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(null); }}
                className="w-full py-3 rounded-full border border-zinc-200 text-xs font-bold hover:bg-zinc-100 transition"
              >
                Create new account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className="w-full py-3 rounded-full border border-zinc-200 text-xs font-bold hover:bg-zinc-100 transition"
              >
                Sign in to existing account
              </button>
            )}

          </form>

          <div className="pt-3 border-t border-zinc-100 text-center text-[11px] text-zinc-500 font-medium">
            Protected by Joault Auth Protocols
          </div>

        </div>
      </main>

      <footer className="w-full border-t py-5 px-6 text-center text-xs border-zinc-200 text-zinc-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Joault Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center text-black font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
