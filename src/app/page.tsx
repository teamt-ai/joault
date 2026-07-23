'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageSquare, ShieldCheck, Users, ArrowRight, Sparkles } from 'lucide-react';
import { dbService, Profile } from '@/lib/supabaseClient';

export default function LandingPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const u = await dbService.getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-bg-deep select-none">
      {/* Ambient background glows */}
      <div className="ambient-bg top-[-100px] left-[-100px]" />
      <div className="ambient-bg bottom-[-200px] right-[-100px] opacity-75" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <span className="font-outfit font-bold text-xl text-bg-deep">J</span>
          </div>
          <span className="font-outfit font-semibold text-2xl tracking-wider text-gradient">Joault</span>
        </div>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-8 rounded bg-bg-card animate-pulse" />
          ) : user ? (
            <Link 
              href="/dashboard" 
              className="px-5 py-2 rounded-xl bg-bg-card hover:bg-bg-hover text-brand-accent font-medium transition duration-300 border border-border-light text-sm flex items-center gap-1.5"
              id="header_dashboard_btn"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="px-4 py-2 text-txt-muted hover:text-txt-primary font-medium transition text-sm"
                id="header_login_btn"
              >
                Log In
              </Link>
              <Link 
                href="/login?tab=signup" 
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary-hover hover:to-brand-primary text-txt-primary font-medium transition duration-300 shadow-md shadow-brand-primary-light/40 text-sm"
                id="header_signup_btn"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary-light/30 border border-brand-primary/30 text-brand-accent text-xs font-semibold mb-6 animate-pulse-gentle">
          <Sparkles className="w-3.5 h-3.5" />
          Structured Group Communication Redefined
        </div>

        {/* Hero title */}
        <h1 className="font-outfit text-5xl md:text-7xl font-bold tracking-tight mb-6">
          A Better Space For <br />
          <span className="text-gradient">Group Conversations</span>
        </h1>

        {/* Hero description */}
        <p className="text-txt-muted text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          Joault breaks the chaos of traditional chat rooms. Experience structured, group-focused spaces where every member has their own dedicated visual box, secured by advanced invitation protocols.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href={user ? "/dashboard" : "/login?tab=signup"}
            className="px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-txt-primary font-semibold transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary-light/50"
            id="hero_primary_btn"
          >
            Create Your Space <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="px-8 py-4 rounded-xl bg-bg-card hover:bg-bg-hover text-brand-accent font-semibold transition duration-300 flex items-center justify-center gap-2 border border-border-light"
            id="hero_secondary_btn"
          >
            Join Existing Space
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-6">
          <div className="glow-card bg-bg-card rounded-2xl p-6 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-primary-light/40 border border-brand-primary/30 flex items-center justify-center mb-5 text-brand-accent">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-semibold text-lg mb-2 text-txt-primary">Structured Member Boxes</h3>
            <p className="text-txt-muted text-sm leading-relaxed">
              No more scrolling through a messy feed of mixed messages. Read each member's contributions in their own dedicated visual cards.
            </p>
          </div>

          <div className="glow-card bg-bg-card rounded-2xl p-6 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-primary-light/40 border border-brand-primary/30 flex items-center justify-center mb-5 text-brand-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-semibold text-lg mb-2 text-txt-primary">Auth Protocols</h3>
            <p className="text-txt-muted text-sm leading-relaxed">
              Every Space generates a secure, unique alphanumeric key. Joining requires this protocol key, keeping your group chats private.
            </p>
          </div>

          <div className="glow-card bg-bg-card rounded-2xl p-6 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-primary-light/40 border border-brand-primary/30 flex items-center justify-center mb-5 text-brand-accent">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-semibold text-lg mb-2 text-txt-primary">Owner Approval Workflow</h3>
            <p className="text-txt-muted text-sm leading-relaxed">
              Entering the correct code is not enough. The Space creator has complete administrative control to approve or reject join requests in real time.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border-light bg-bg-deep/80 py-8 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-txt-muted text-xs">
            &copy; {new Date().getFullYear()} Joault Inc. Designed for premium, structured collaboration.
          </p>
          <div className="flex gap-6 text-xs text-txt-muted">
            <a href="#" className="hover:text-brand-accent transition">Privacy Policy</a>
            <a href="#" className="hover:text-brand-accent transition">Terms of Service</a>
            <a href="#" className="hover:text-brand-accent transition">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
