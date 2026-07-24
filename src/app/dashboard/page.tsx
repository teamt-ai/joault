'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dbService, Profile, Space } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<Space[]>([]);

  // Protocol input state
  const [protocolCode, setProtocolCode] = useState('');
  const [joinMsg, setJoinMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal Create Space state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newAuthProtocol, setNewAuthProtocol] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          router.push('/');
          return;
        }
        setUser(u);
        const mySpaces = await dbService.getMySpaces(u.id);
        setSpaces(mySpaces || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await dbService.logout();
    router.push('/');
  };

  const handleJoinSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protocolCode.trim() || !user) return;
    setJoinMsg(null);

    try {
      await dbService.requestToJoinSpace(protocolCode.trim(), user.id);
      setJoinMsg({ text: "🔑 Space connected! Access request sent to space owner.", type: 'success' });
      setProtocolCode('');
      const updated = await dbService.getMySpaces(user.id);
      setSpaces(updated || []);
    } catch (err: any) {
      setJoinMsg({ text: err.message || "Failed to connect to space.", type: 'error' });
    }
  };

  const handleGenerateProtocol = () => {
    const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    setNewAuthProtocol(`SPACE-${rand()}-${rand()}`);
  };

  const handleCreateSpaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim() || !user) return;

    try {
      const created = await dbService.createSpace(newSpaceName.trim(), user.id);
      if (newAuthProtocol.trim()) {
        created.auth_protocol = newAuthProtocol.trim();
      }
      setNewSpaceName('');
      setNewAuthProtocol('');
      setCreateModalOpen(false);

      const updated = await dbService.getMySpaces(user.id);
      setSpaces(updated || []);

      router.push('/space.html');
    } catch (err: any) {
      alert(err.message || 'Failed to create space');
    }
  };

  const getUserInitials = () => {
    if (!user) return 'AN';
    const name = user.username || user.email || 'AN';
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF6F0', color: '#23150D', fontFamily: 'sans-serif' }}>
        <span>Syncing Joault Workspace...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-body" style={{ minHeight: '100vh' }}>
      {/* HEADER BAR */}
      <header className="dash-header">
        <div className="dash-header-container">
          {/* TOP LEFT: PROFILE INFO */}
          <div className="user-profile-widget" id="user-profile-widget">
            <div className="avatar-circle" id="user-avatar">
              <span id="avatar-initials">{getUserInitials()}</span>
            </div>
            <div className="user-meta">
              <span className="user-name" id="user-display-name">{user?.username || user?.email?.split('@')[0] || 'User'}</span>
              <span className="user-status-badge"><span className="status-dot"></span> Active</span>
            </div>
          </div>

          {/* BRAND LOGO CENTER */}
          <div className="dash-brand">
            <span className="brand-title">Joault</span>
          </div>

          {/* TOP RIGHT: CREATE SPACE (+) BUTTON & LOGOUT */}
          <div className="header-actions">
            <button
              type="button"
              onClick={() => { setCreateModalOpen(true); handleGenerateProtocol(); }}
              className="btn-create-space"
              title="Create a New Space"
            >
              <svg className="plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span className="btn-create-label">Create Space</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-logout"
              title="Log Out"
            >
              <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT CONTAINER */}
      <main className="dash-main">
        <div className="dash-content-wrapper">
          {/* HERO BANNER SECTION */}
          <section className="dash-hero">
            <h1 className="hero-title">Your Spaces Portal</h1>
            <p className="hero-subtitle">Enter an Auth Protocol code to connect to a space or launch your own collaborative environment.</p>
          </section>

          {/* AUTH PROTOCOL INPUT PILL SECTION */}
          <section className="auth-protocol-section">
            <div className="protocol-card">
              <div className="protocol-header">
                <div className="protocol-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="protocol-title">Access Space via Auth Protocol</h2>
                  <p id="protocol-prompt-text" className="protocol-desc">Key in the Auth Protocol code provided by a space owner to join immediately.</p>
                </div>
              </div>

              <form id="form-join-protocol" className="protocol-form" onSubmit={handleJoinSpace}>
                <div className="protocol-input-pill">
                  <span className="protocol-prefix">KEY-</span>
                  <input
                    type="text"
                    value={protocolCode}
                    onChange={(e) => setProtocolCode(e.target.value)}
                    className="protocol-input"
                    placeholder="e.g. ALPHA-9824 or JOIN-SPACE-1"
                    required
                  />
                  <button type="submit" className="btn-protocol-submit">
                    <span>Connect Space</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </form>

              {joinMsg && (
                <div className={`feedback-msg ${joinMsg.type === 'error' ? 'error' : 'success'}`} style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: joinMsg.type === 'error' ? '#ef4444' : '#10b981' }}>
                  {joinMsg.text}
                </div>
              )}
            </div>
          </section>

          {/* SPACES SECTION */}
          <section className="spaces-section">
            {/* SECTION TITLE & STATS */}
            <div className="section-header">
              <div>
                <h2 className="section-title">Connected Spaces</h2>
                <p className="section-subtitle">Collaborative hubs you belong to</p>
              </div>
              <span id="spaces-count-badge" className="count-badge">{spaces.length} Spaces</span>
            </div>

            {/* EMPTY STATE OR SPACES GRID */}
            {spaces.length === 0 ? (
              <div id="empty-spaces-state" className="empty-state">
                <div className="empty-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="empty-title">Please key in your Auth Protocol</h3>
                <p className="empty-desc">
                  You have not joined any spaces yet. Use the Auth Protocol pill above to join an existing space, or click the <strong>+</strong> button at the top right to create your own.
                </p>
              </div>
            ) : (
              <div className="spaces-grid">
                {spaces.map((sp) => (
                  <div key={sp.id} className="space-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#23150D' }}>{sp.name}</h3>
                      <span style={{ fontSize: '0.7rem', background: '#EDE4D7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>
                        {sp.auth_protocol}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#786C60', margin: '0.5rem 0 1rem 0' }}>
                      Active space feed with 3D card layout, double-tap reactions, and connected threads.
                    </p>
                    <a
                      href="/space.html"
                      style={{
                        display: 'inline-block',
                        background: '#23150D',
                        color: '#FFFFFF',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '12px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Enter Space Feed &rarr;
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* CREATE SPACE MODAL */}
      {createModalOpen && (
        <div className="modal-backdrop" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="modal-title">Create a New Space</h3>
                  <p className="modal-subtitle">Generate a space with a custom Auth Protocol</p>
                </div>
              </div>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>

            <form className="modal-form" onSubmit={handleCreateSpaceSubmit}>
              <div className="form-group">
                <label className="form-label">Space Name</label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Design Team Studio"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Auth Protocol Code</label>
                <div className="protocol-gen-row">
                  <input
                    type="text"
                    value={newAuthProtocol}
                    onChange={(e) => setNewAuthProtocol(e.target.value)}
                    className="form-input"
                    placeholder="e.g. STUDIO-883"
                    required
                  />
                  <button type="button" onClick={handleGenerateProtocol} className="btn-gen">Generate</button>
                </div>
                <span className="form-hint">Members will use this Auth Protocol code to join your space.</span>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Space</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
