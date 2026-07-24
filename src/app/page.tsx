'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { dbService, Profile } from '@/lib/supabaseClient';

export default function JoaultAuthPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
        const userNm = username.trim() || email.split('@')[0];
        const res = await dbService.signUp(userNm, email);
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
          setError(res.error || 'User not found. Try signing up.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await dbService.login('demo_user@gmail.com');
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Google Sign-In failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Google Auth error.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#FAF6F0] text-[#23150D] font-sans select-none overflow-x-hidden">
      
      {/* LEFT COLUMN: DARK CHOCOLATE BROWN SECTION */}
      <div className="lg:col-span-5 bg-[#23150D] p-8 md:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden min-h-[440px] lg:min-h-screen">
        
        {/* TOP-LEFT ROUNDED THUMBNAIL */}
        <div className="z-10 self-start">
          <div className="relative w-48 h-34 sm:w-56 sm:h-38 md:w-60 md:h-40 rounded-[28px] overflow-hidden shadow-2xl">
            <Image
              src="/team1.jpg"
              alt="Team members collaborating around laptop"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* CENTER HEADING TEXT */}
        <div className="my-10 lg:my-auto z-10 space-y-1">
          <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.1]">
            Create a Space
          </h1>
          <h2 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-medium text-[#A07B57] tracking-tight leading-[1.1]">
            Join a Space
          </h2>
        </div>

        {/* BOTTOM-RIGHT ROUNDED THUMBNAIL */}
        <div className="z-10 self-end">
          <div className="relative w-48 h-34 sm:w-56 sm:h-38 md:w-60 md:h-40 rounded-[28px] overflow-hidden shadow-2xl">
            <Image
              src="/team2.jpg"
              alt="Overhead shot of team working around desk"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: CREAM AUTH SECTION */}
      <div className="lg:col-span-7 bg-[#FAF6F0] p-6 sm:p-10 md:p-12 flex flex-col justify-between min-h-screen">
        
        {/* TOP RIGHT TAB TOGGLE (PILLED SWITCHER MATCHING IMAGE) */}
        <div className="w-full flex justify-end mb-4">
          <div className="inline-flex items-center gap-1 bg-[#EDE4D7] p-1.5 rounded-2xl border border-[#E5DDD2]">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#23150D] text-white shadow-md'
                  : 'text-[#8C6F57] hover:text-[#23150D]'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(null); }}
              className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#23150D] text-white shadow-md'
                  : 'text-[#8C6F57] hover:text-[#23150D]'
              }`}
            >
              Create account
            </button>
          </div>
        </div>


        {/* FORM CONTAINER */}
        <div className="max-w-md w-full mx-auto my-4 lg:my-auto py-2 space-y-5">

          
          {/* HEADER */}
          <div className="space-y-1">
            <h2 className="font-serif-title text-4xl text-[#23150D] font-medium tracking-tight">
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-[#786C60] font-normal">
              {activeTab === 'login' ? 'Sign in to access your spaces.' : 'Sign up to create and join your spaces.'}
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white border border-[#E5DDD2] text-[#23150D] font-bold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#F5EFE6] transition duration-150 shadow-xs cursor-pointer disabled:opacity-70"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#23150D]" />
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* DIVIDER LINE */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-[#E5DDD2]"></div>
            <span className="absolute bg-[#FAF6F0] px-4 text-xs text-[#A89B8F] font-normal">
              or
            </span>
          </div>

          {/* AUTH FORM */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#3E322A]">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  className="w-full bg-white border border-[#E5DDD2] rounded-2xl px-4 py-3.5 text-sm text-[#23150D] placeholder-[#A89C90] focus:outline-none focus:ring-2 focus:ring-[#23150D]/15 focus:border-[#23150D] transition"
                  required={activeTab === 'signup'}
                />
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3E322A]">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-[#E5DDD2] rounded-2xl px-4 py-3.5 text-sm text-[#23150D] placeholder-[#A89C90] focus:outline-none focus:ring-2 focus:ring-[#23150D]/15 focus:border-[#23150D] transition"
                required
              />
            </div>

            {/* PASSWORD FIELD WITH FORGOT PASSWORD & EYE TOGGLE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#3E322A]">
                  Password
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setError('Password reset instructions sent to your email.')}
                    className="text-xs text-[#C39B75] font-semibold hover:underline transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E5DDD2] rounded-2xl px-4 py-3.5 text-sm text-[#23150D] placeholder-[#A89C90] focus:outline-none focus:ring-2 focus:ring-[#23150D]/15 focus:border-[#23150D] transition pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7E72] hover:text-[#23150D] transition cursor-pointer p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#23150D] hover:bg-[#342014] active:scale-[0.99] text-white font-bold text-sm py-4 rounded-2xl transition duration-150 shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" />
              ) : activeTab === 'login' ? (
                'Log in to Joault'
              ) : (
                'Create Joault Account'
              )}
            </button>

          </form>

          {/* TOGGLE ACCOUNT MODE LINK */}
          <div className="text-center pt-1 space-y-3">
            {activeTab === 'login' ? (
              <p className="text-xs text-[#786C60]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(null); }}
                  className="font-bold text-[#23150D] hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#786C60]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }}
                  className="font-bold text-[#23150D] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            )}

            {/* FINE PRINT TERMS */}
            <p className="text-[11px] text-[#A89C90] font-normal leading-tight">
              By continuing, you agree to Joault's <span className="hover:underline cursor-pointer">Terms</span> and <span className="hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>

        </div>

        {/* FLOATING HELP BUTTON IN BOTTOM RIGHT */}
        <button
          type="button"
          onClick={() => alert('Joault Auth Help: Sign in with your email or Google account to access your collaborative spaces.')}
          className="fixed bottom-5 right-5 w-8 h-8 rounded-full bg-white border border-[#E5DDD2] shadow-sm flex items-center justify-center text-[#23150D] text-xs font-serif hover:bg-[#F5EFE6] transition cursor-pointer z-50"
          title="Help & Info"
        >
          ?
        </button>

      </div>

    </div>
  );
}

