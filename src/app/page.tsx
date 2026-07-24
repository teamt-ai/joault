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
  Layers, 
  Flame, 
  Heart, 
  Send, 
  Check, 
  Loader2, 
  AlertCircle,
  Lock,
  UserCheck
} from 'lucide-react';
import { dbService, isDemoMode, Profile, Space } from '@/lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();

  // Auth form states
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

  // Theme preview state for landing demo
  const [isDarkModeDemo, setIsDarkModeDemo] = useState(false);

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
          name: 'Design Collective & Tech Rival Squad',
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
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDarkModeDemo ? 'bg-[#121316] text-[#e8eaed]' : 'bg-[#f8f9fa] text-[#202124]'
    } font-sans select-none overflow-x-hidden`}>
      
      {/* GOOGLE WORKSPACE HEADER */}
      <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        isDarkModeDemo ? 'bg-[#1e1f23]/90 border-[#303134]' : 'bg-white/90 border-[#dadce0]'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-xl shadow-md">
              J
            </div>
            <div>
              <span className="font-outfit font-black text-2xl tracking-tight">Joault</span>
              <span className="text-[10px] text-[#1a73e8] font-mono block uppercase font-bold tracking-wider">Group Space Networks</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Anonymous Switcher */}
            <button
              onClick={() => setIsDarkModeDemo(!isDarkModeDemo)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition ${
                isDarkModeDemo 
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40' 
                  : 'bg-amber-500/10 text-amber-800 border-amber-500/30'
              }`}
              title="Toggle Dark Mode (Anonymous Mode)"
            >
              {isDarkModeDemo ? <Moon className="w-3.5 h-3.5 text-purple-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDarkModeDemo ? 'Dark (Anonymous ON)' : 'Light (Identities Shown)'}</span>
            </button>

            {user ? (
              <Link href="/dashboard" className="google-pill-btn py-2 px-5 text-xs">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button 
                onClick={() => {
                  const authCard = document.getElementById('auth_card_container');
                  authCard?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="google-pill-outlined py-2 px-5 text-xs"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* HERO & SPLIT-SCREEN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-grow">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: HERO CONTENT & INNOVATION SHOWCASE */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a73e8]/10 text-[#1a73e8] border border-[#1a73e8]/20 text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4" /> DUAL-GROUP CHAT & ANONYMOUS DARK MODE
            </div>

            <h1 className="font-outfit text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              Where groups interact, collaborate, and compete <br />
              <span className="text-[#1a73e8]">in a single space.</span>
            </h1>

            <p className={`text-base md:text-lg max-w-xl leading-relaxed ${
              isDarkModeDemo ? 'text-[#9aa0a6]' : 'text-[#5f6368]'
            }`}>
              Joault redefines group communication. Invite another group into your space, swipe to comment, double-tap to trigger TikTok gift floating emojis, or toggle Dark Mode to instantly anonymize all messages.
            </p>

            {/* DEMO TOOL: AUTH PROTOCOL LOOKUP DEMO */}
            <div className={`p-6 rounded-3xl border ${
              isDarkModeDemo ? 'bg-[#1e1f23] border-[#303134]' : 'bg-white border-[#dadce0]'
            } shadow-xl space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-bold text-base flex items-center gap-2">
                  <Key className="w-4.5 h-4.5 text-[#1a73e8]" /> Try Auth Protocol Space Lookup
                </h3>
                <span className="text-[11px] font-mono text-[#1a73e8] font-bold">LIVE CODE TEST</span>
              </div>

              <form onSubmit={handleProtocolLookup} className="flex gap-3">
                <input
                  type="text"
                  value={protocolInput}
                  onChange={(e) => setProtocolInput(e.target.value)}
                  placeholder="Enter Auth Protocol (e.g. SPACE-COFFEE-9922)"
                  className={`flex-grow px-4 py-3 rounded-2xl border text-sm outline-none font-mono tracking-wider ${
                    isDarkModeDemo ? 'bg-[#292a2e] border-[#303134] text-white' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124]'
                  } focus:border-[#1a73e8]`}
                />
                <button type="submit" disabled={previewLoading} className="google-pill-btn py-3 px-6 text-xs shrink-0">
                  {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect Space'}
                </button>
              </form>

              {previewMsg && (
                <div className="p-4 rounded-2xl bg-[#1a73e8]/10 border border-[#1a73e8]/30 flex items-center justify-between text-xs text-[#1a73e8]">
                  <div className="flex items-center gap-2 font-bold">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Space: {previewSpace?.name} ({previewSpace?.auth_protocol})</span>
                  </div>
                  <Link href="/login" className="google-pill-btn py-1.5 px-4 text-[11px]">
                    Request Access
                  </Link>
                </div>
              )}
            </div>

            {/* X-STYLE RECTANGULAR MESSAGE FEATURE DEMO */}
            <div className={`p-6 rounded-3xl border ${
              isDarkModeDemo ? 'bg-[#1e1f23] border-[#303134]' : 'bg-white border-[#dadce0]'
            } shadow-xl space-y-4`}>
              <div className="flex items-center justify-between">
                <h4 className="font-outfit font-bold text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#1a73e8]" /> X-Style Rectangular Card Feed Preview
                </h4>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  SWIPE & REACTION READY
                </span>
              </div>

              {/* Sample Rectangular Post Box */}
              <div className={`google-x-card p-5 border ${isDarkModeDemo ? 'bg-[#292a2e]' : 'bg-[#f8f9fa]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isDarkModeDemo ? 'bg-purple-900 text-purple-200' : 'bg-[#1a73e8] text-white'
                    }`}>
                      {isDarkModeDemo ? '?' : 'A'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold">
                        {isDarkModeDemo ? 'Anonymous Phantom' : 'Alex (Space Creator)'}
                      </h5>
                      <span className="text-[10px] text-[#5f6368]">Design Group &bull; Just now</span>
                    </div>
                  </div>
                  {isDarkModeDemo && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      ANONYMOUS ON
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed mb-3">
                  Two groups are sharing this exact chat space! Swipe left to comment, swipe right to view comments inside sub-rectangles, or double tap to launch TikTok gift emojis! 🔥
                </p>

                {/* Sub-Rectangle Comment */}
                <div className="google-sub-rectangle text-[11px] space-y-1">
                  <span className="font-bold text-[#1a73e8]">Sarah (Designer):</span>
                  <p>The dual-group diagonal split rectangle view makes rival discussions super clean!</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: GOOGLE-STYLE AUTHENTICATION CARD */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto" id="auth_card_container">
            <div className={`p-8 md:p-10 rounded-[32px] border ${
              isDarkModeDemo ? 'bg-[#1e1f23] border-[#303134]' : 'bg-white border-[#dadce0]'
            } shadow-2xl space-y-6`}>
              
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
                      className={`w-full px-4 py-3.5 rounded-2xl border text-sm outline-none ${
                        isDarkModeDemo ? 'bg-[#292a2e] border-[#303134] text-white' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124]'
                      } focus:border-[#1a73e8]`}
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
                    className={`w-full px-4 py-3.5 rounded-2xl border text-sm outline-none ${
                      isDarkModeDemo ? 'bg-[#292a2e] border-[#303134] text-white' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124]'
                    } focus:border-[#1a73e8]`}
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
                    <div className={`w-full border-t ${isDarkModeDemo ? 'border-[#303134]' : 'border-[#dadce0]'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className={`px-3 uppercase font-mono font-bold ${
                      isDarkModeDemo ? 'bg-[#1e1f23] text-[#9aa0a6]' : 'bg-white text-[#5f6368]'
                    }`}>OR</span>
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
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className={`w-full border-t py-6 px-6 text-center text-xs transition-colors duration-300 ${
        isDarkModeDemo ? 'bg-[#1e1f23] border-[#303134] text-[#9aa0a6]' : 'bg-white border-[#dadce0] text-[#5f6368]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Joault Inc. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-[#1a73e8] transition">Privacy</a>
            <a href="#" className="hover:text-[#1a73e8] transition">Terms</a>
            <a href="#" className="hover:text-[#1a73e8] transition">Cookies</a>
            <a href="#" className="hover:text-[#1a73e8] transition">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
