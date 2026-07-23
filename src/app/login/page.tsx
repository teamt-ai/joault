'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, User, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { dbService, isDemoMode } from '@/lib/supabaseClient';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoBanner, setDemoBanner] = useState(false);

  useEffect(() => {
    setDemoBanner(isDemoMode);
    // Check if user is already logged in
    async function checkActiveSession() {
      const activeUser = await dbService.getCurrentUser();
      if (activeUser) {
        router.push('/dashboard');
      }
    }
    checkActiveSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError('Please provide an email address.');
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
          setError(res.error || 'An error occurred during signup.');
        }
      } else {
        const res = await dbService.login(email);
        if (res.success) {
          router.push('/dashboard');
        } else {
          setError(res.error || 'User not found. Try signing up first.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-deep px-4 py-12">
      {/* Ambient background glows */}
      <div className="ambient-bg top-[-200px] left-[-200px]" />
      <div className="ambient-bg bottom-[-200px] right-[-200px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20 transition group-hover:scale-105">
              <span className="font-outfit font-bold text-2xl text-bg-deep">J</span>
            </div>
            <span className="font-outfit font-bold text-3xl tracking-wider text-gradient">Joault</span>
          </Link>
          <p className="text-txt-muted text-sm">
            Enter the space of structured group interactions
          </p>
        </div>

        {/* Demo Mode Notice */}
        {demoBanner && (
          <div className="mb-6 p-4 rounded-xl bg-brand-primary-light/20 border border-brand-primary/30 flex gap-3 text-xs text-brand-accent">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-semibold block mb-0.5">Running in Demo Mode</span>
              Supabase credentials not set. Simulated data will be saved locally in your browser.
            </div>
          </div>
        )}

        {/* Card */}
        <div className="glow-card bg-bg-card rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex border-b border-border-light mb-6 p-1 bg-bg-deep/50 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition duration-200 ${
                activeTab === 'login'
                  ? 'bg-brand-primary text-txt-primary shadow-md'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
              id="tab_login_btn"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition duration-200 ${
                activeTab === 'signup'
                  ? 'bg-brand-primary text-txt-primary shadow-md'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
              id="tab_signup_btn"
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-input border border-border-light focus:border-border-focus focus:outline-none text-sm text-txt-primary placeholder:text-txt-muted/50 transition"
                    id="auth_username_input"
                    required={activeTab === 'signup'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-input border border-border-light focus:border-border-focus focus:outline-none text-sm text-txt-primary placeholder:text-txt-muted/50 transition"
                  id="auth_email_input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary-hover hover:to-brand-primary text-txt-primary font-semibold transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary-light/50 disabled:opacity-50 text-sm"
              id="auth_submit_btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {activeTab === 'login' ? 'Enter Dashboard' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Helper Tips */}
          <div className="mt-6 text-center text-xs text-txt-muted">
            {activeTab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveTab('signup')}
                  className="text-brand-accent hover:underline font-medium"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-brand-accent hover:underline font-medium"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-txt-muted hover:text-brand-accent transition">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-deep flex items-center justify-center text-txt-muted">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
