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
        const res = await dbService.signUp(userNm, email, password);
        if (res.success) {
          window.location.href = '/dashboard';
        } else {
          setError(res.error || 'Signup failed.');
        }
      } else {
        const res = await dbService.login(email, password);
        if (res.success) {
          window.location.href = '/dashboard';
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
      const res = await dbService.loginWithGoogle();
      if (res.success) {
        window.location.href = '/dashboard';
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
    <div className="auth-container">
      {/* LEFT PANEL: DARK CHOCOLATE BROWN */}
      <div className="panel-left">
        <div className="image-card top-card">
          <Image
            src="/team1.jpg"
            alt="Team members collaborating around laptop"
            width={240}
            height={160}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="heading-group">
          <h1 className="title-white">Create a Space</h1>
          <h2 className="title-gold">Join a Space</h2>
        </div>

        <div className="image-card bottom-card">
          <Image
            src="/team2.jpg"
            alt="Overhead shot of team working around desk"
            width={240}
            height={160}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      {/* RIGHT PANEL: CREAM AUTH FORM */}
      <div className="panel-right">
        {/* TOP RIGHT TAB TOGGLE */}
        <div className="tab-switcher-wrapper">
          <div className="tab-switcher">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(null); }}
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            >
              Create account
            </button>
          </div>
        </div>

        {/* MAIN FORM WRAPPER */}
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-heading">
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="form-subheading">
              {activeTab === 'login' ? 'Sign in to access your spaces.' : 'Sign up to create and join your spaces.'}
            </p>
          </div>

          {/* ERROR ALERT BOX */}
          {error && (
            <div className="error-alert">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="btn-google"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24">
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

          {/* DIVIDER */}
          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          {/* AUTH FORM */}
          <form onSubmit={handleAuth}>
            {activeTab === 'signup' && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Your username"
                  required={activeTab === 'signup'}
                />
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group">
              <div className="label-row">
                <label className="form-label">Password</label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setError('Password reset instructions sent to your email.')}
                    className="link-forgot"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input password-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-toggle-eye"
                  aria-label="Toggle password visibility"
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
              className="btn-primary"
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

          {/* ACCOUNT MODE TOGGLE TEXT */}
          <div className="footer-links">
            {activeTab === 'login' ? (
              <p className="toggle-prompt">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(null); }}
                  className="link-action"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="toggle-prompt">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }}
                  className="link-action"
                >
                  Log in
                </button>
              </p>
            )}

            <p className="terms-text">
              By continuing, you agree to Joault's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* FLOATING HELP BUTTON */}
        <button
          type="button"
          onClick={() => alert('Joault Auth Help: Sign in with your email or Google account to access your collaborative spaces.')}
          className="floating-help-btn"
          title="Help & Info"
        >
          ?
        </button>
      </div>
    </div>
  );
}
