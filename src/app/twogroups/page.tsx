'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dbService, Profile, Space, Message } from '@/lib/supabaseClient';

export default function TwoGroupsFeedPage() {
  const router = useRouter();

  const [user, setUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Night/Anonymous Mode State
  const [isAnonymousNight, setIsAnonymousNight] = useState(false);

  // Lightbox State
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          window.location.href = '/';
          return;
        }
        setUser(u);

        const mySpaces = await dbService.getMySpaces(u.id);
        if (mySpaces && mySpaces.length > 0) {
          const msgs = await dbService.getMessages(mySpaces[0].id);
          setMessages(msgs || []);
        }
      } catch (err) {
        console.error("Error loading twogroups data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleAnonymousNightMode = () => {
    setIsAnonymousNight(!isAnonymousNight);
  };

  const getUserInitials = () => {
    if (!user) return 'AN';
    const name = user.username || user.email || 'AN';
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF6F0', color: '#23150D', fontFamily: 'sans-serif' }}>
        <span>Syncing Dual-Group Connected Threads...</span>
      </div>
    );
  }

  return (
    <div className={`space-body twogroups-body ${isAnonymousNight ? 'anonymous-night' : ''}`} style={{ minHeight: '100vh' }}>
      {/* TOP APP HEADER */}
      <header className="space-header">
        <div className="space-header-container">
          {/* LEFT BRAND & SPACE TITLE */}
          <div className="header-left">
            <Link href="/dashboard" className="back-link" title="Back to Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </Link>
            <div className="brand-badge">
              <span className="brand-square">J</span>
              <span className="brand-name">joault</span>
            </div>
          </div>

          {/* RIGHT SEARCH & USER AVATAR */}
          <div className="header-right">
            <div className="search-pill">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" placeholder="Search" className="search-input" />
            </div>

            {/* NIGHT ANONYMOUS MODE TOGGLE BUTTON */}
            <button
              type="button"
              className="btn-night-anonymous-toggle"
              onClick={toggleAnonymousNightMode}
              title="Toggle Anonymous Night Mode"
            >
              <svg className="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span className="night-toggle-text">{isAnonymousNight ? 'Standard' : 'Anonymous'}</span>
            </button>

            <div className="user-avatar-pill">
              <span>{getUserInitials()}</span>
            </div>
          </div>
        </div>

        {/* SUB-HEADER SPACE METADATA & NAV TABS */}
        <div className="space-subheader-container">
          <div className="space-meta-row">
            <h1 className="space-name-tag">#two-groups</h1>
            <span className="space-members-count">· 2,480 members across 2 connected groups</span>
          </div>

          {/* NAV TABS */}
          <nav className="space-nav-tabs">
            <Link href="/dashboard" className="tab-item">Feed</Link>
            <button type="button" className="tab-item active">Groups (2)</button>
            <button type="button" className="tab-item">Explore</button>
          </nav>
        </div>
      </header>

      {/* MAIN DUAL GROUPS FEED CONTAINER */}
      <main className="space-main">
        <div className="feed-wrapper">
          {/* ROTATION SPEED BANNER */}
          <div className="rotation-info-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Live connected thread: replies auto-rotate every 3 seconds (Swipe right for all 8 replies)</span>
          </div>

          {/* DUAL GROUPS FEED CONTAINER */}
          <div id="twogroups-posts-container" className="feed-posts-list">
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#786C60', fontSize: '0.875rem' }}>
                No dual group threads available yet. Connect a second group from your Dashboard to start!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="card-outer-wrapper">
                  <div className="card-box card-face-main">
                    <div className="card-author-row">
                      <div className="author-left">
                        <div className="avatar-circle-sm">
                          {msg.profile?.username ? msg.profile.username.slice(0, 2).toUpperCase() : 'AN'}
                        </div>
                        <div className="author-meta">
                          <span className="author-name">{msg.profile?.username || 'Anonymous Member'}</span>
                          <span className="post-timestamp">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="post-body">
                      <p className="post-text">{msg.content}</p>
                    </div>

                    <div className="card-footer-metrics">
                      <span className="metric-pill">💬 {msg.comments?.length || 0} Connected S-line Replies</span>
                      <span className="metric-pill">🔥 {msg.reactions?.length || 0} Joault Gifts</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* GLOBAL IMAGE LIGHTBOX FULL-SIZE OVERLAY */}
      {lightboxImg && (
        <div className="lightbox-modal" onClick={() => setLightboxImg(null)}>
          <span className="lightbox-close-btn" onClick={() => setLightboxImg(null)}>&times;</span>
          <img className="lightbox-img" src={lightboxImg} alt="Full size preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
