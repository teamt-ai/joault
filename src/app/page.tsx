'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Key, 
  Moon, 
  Sun, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Loader2, 
  AlertCircle,
  Eye,
  Heart
} from 'lucide-react';
import { dbService, isDemoMode, Profile, Space } from '@/lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);

  // Interactive Auth Protocol Lookup Demo
  const [protocolInput, setProtocolInput] = useState('SPACE-COFFEE-9922');
  const [previewSpace, setPreviewSpace] = useState<Space | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewMsg, setPreviewMsg] = useState<string | null>(null);

  // Theme preview state
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const u = await dbService.getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error(err);
      }
    }
    checkUser();
  }, []);

  const handleProtocolLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocolInput.trim()) return;
    setPreviewLoading(true);
    setPreviewMsg(null);
    setPreviewSpace(null);
    try {
      const mySpaces = await dbService.getMySpaces(user?.id || 'guest');
      const found = mySpaces.find(s => s.auth_protocol.toLowerCase().trim() === protocolInput.toLowerCase().trim());
      if (found) {
        setPreviewSpace(found);
      } else {
        setPreviewSpace({
          id: 'preview-space-1',
          name: 'Design Collective & Tech Rivals',
          owner_id: 'owner-1',
          auth_protocol: protocolInput.toUpperCase(),
          created_at: new Date().toISOString(),
          guest_space_name: 'Tech Rivals'
        });
      }
      setPreviewMsg('Space Found! Click below to send join request to Space Admin.');
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewLoading(false);
    }
  };

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
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      isDarkMode ? 'dark bg-black text-[#f7f9f9]' : 'bg-white text-[#0f1419]'
    } font-sans select-none overflow-x-hidden`}>
      
      {/* THREADS / X MINIMALIST HEADER */}
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 ${
        isDarkMode ? 'bg-black/90 border-[#18181b]' : 'bg-white/90 border-[#f0f0f1]'
      } backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-lg">
              J
            </div>
            <span className="font-outfit font-black text-2xl tracking-tight">Joault</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Anonymous Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition ${
                isDarkMode 
                  ? 'bg-zinc-900 text-zinc-200 border-zinc-800' 
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200'
              }`}
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Dark (Anonymous ON)' : 'Light (Identities Shown)'}</span>
            </button>

            {user ? (
              <Link href="/dashboard" className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
                Dashboard <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
              </Link>
            ) : (
              <button 
                onClick={() => {
                  document.getElementById('auth_card_container')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                Sign in
              </button>
            )}
          </div>

        </div>
      </header>

      {/* THREADS / X MAIN SPLIT-SCREEN CONTAINER */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: MINIMALIST HEADLINE & RECTANGULAR FEED PREVIEW */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <div className="space-y-4">
              <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                See what’s happening in your spaces.
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-lg font-normal leading-relaxed">
                Connect with friends and the world around you in structured group spaces. Invite rival groups, swipe to comment, and double tap to react with floating gift emojis.
              </p>
            </div>

            {/* INTERACTIVE AUTH PROTOCOL LOOKUP TOOL */}
            <div className={`p-6 rounded-3xl border ${
              isDarkMode ? 'bg-[#09090b] border-[#18181b]' : 'bg-[#fcfcfc] border-[#f0f0f1]'
            } space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-bold text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-black dark:text-white" /> Auth Protocol Space Lookup
                </h3>
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">LIVE DEMO</span>
              </div>

              <form onSubmit={handleProtocolLookup} className="flex gap-2">
                <input
                  type="text"
                  value={protocolInput}
                  onChange={(e) => setProtocolInput(e.target.value)}
                  placeholder="e.g. SPACE-COFFEE-9922"
                  className={`flex-grow px-4 py-3 rounded-full border text-xs outline-none font-mono tracking-wider ${
                    isDarkMode ? 'bg-[#121215] border-[#18181b] text-white' : 'bg-zinc-100 border-zinc-200 text-black'
                  }`}
                />
                <button type="submit" disabled={previewLoading} className="px-5 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold shrink-0">
                  {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect'}
                </button>
              </form>

              {previewMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="font-bold">{previewSpace?.name} ({previewSpace?.auth_protocol})</span>
                  <Link href="/login" className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                    Request Access
                  </Link>
                </div>
              )}
            </div>

            {/* RECTANGULAR CARD FEED PREVIEW (X / THREADS STYLE) */}
            <div className={`p-6 rounded-3xl border ${
              isDarkMode ? 'bg-[#09090b] border-[#18181b]' : 'bg-[#fcfcfc] border-[#f0f0f1]'
            } space-y-4`}>
              <div className="flex items-center justify-between text-xs text-zinc-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Rectangular Feed (Swipe & Double Tap Ready)
                </span>
                <span className="font-mono text-[10px]">{isDarkMode ? 'ANONYMOUS ON' : 'IDENTITIES SHOWN'}</span>
              </div>

              {/* Sample Post Rectangle */}
              <div className="threads-post-card rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs">
                      {isDarkMode ? '?' : 'A'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold">
                        {isDarkMode ? 'Anonymous Phantom' : 'Alex (Space Admin)'}
                      </h5>
                      <span className="text-[10px] text-zinc-400">Design Group &bull; Just now</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                  Welcome to Joault! Double tap this rectangle to trigger floating TikTok gift emojis, or swipe right to view comments inside sub-rectangles! 🔥
                </p>

                {/* Sub-Rectangle Comment */}
                <div className="threads-sub-rectangle text-[11px] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-black dark:text-white">
                      {isDarkMode ? 'Ghost Commenter' : 'Sarah (Designer)'}
                    </span>
                    <span className="text-zinc-400 font-mono">1m ago</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">This clean rectangle feed layout is super smooth!</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: MINIMALIST AUTH CARD */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto" id="auth_card_container">
            <div className={`p-8 rounded-3xl border ${
              isDarkMode ? 'bg-[#09090b] border-[#18181b]' : 'bg-white border-[#f0f0f1]'
            } shadow-sm space-y-6`}>
              
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
                      className={`w-full px-4 py-3.5 rounded-full border text-xs outline-none ${
                        isDarkMode ? 'bg-[#121215] border-[#18181b] text-white' : 'bg-zinc-100 border-zinc-200 text-black'
                      }`}
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
                    className={`w-full px-4 py-3.5 rounded-full border text-xs outline-none ${
                      isDarkMode ? 'bg-[#121215] border-[#18181b] text-white' : 'bg-zinc-100 border-zinc-200 text-black'
                    }`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-sm"
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
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="bg-white dark:bg-[#09090b] px-3 text-zinc-400 font-mono uppercase font-bold">OR</span>
                  </div>
                </div>

                {activeTab === 'login' ? (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signup'); setError(null); }}
                    className="w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                  >
                    Create new account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(null); }}
                    className="w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                  >
                    Sign in to existing account
                  </button>
                )}

              </form>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center text-[11px] text-zinc-500 font-medium">
                Protected by Joault Auth Protocols
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t py-5 px-6 text-center text-xs border-zinc-200 dark:border-zinc-800 text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>&copy; {new Date().getFullYear()} Joault Inc. All rights reserved.</p>
          <div className="flex gap-5 font-medium">
            <a href="#" className="hover:text-black dark:hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition">Cookies</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
