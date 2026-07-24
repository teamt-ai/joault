'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dbService, Profile, Space, Message } from '@/lib/supabaseClient';

export default function SpaceFeedPage({ params }: { params: Promise<{ spaceId: string }> }) {
  const resolvedParams = use(params);
  const spaceId = resolvedParams.spaceId;
  const router = useRouter();

  const [user, setUser] = useState<Profile | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Night/Anonymous Mode State
  const [isAnonymousNight, setIsAnonymousNight] = useState(false);

  // Compose Post State
  const [isExpanded, setIsExpanded] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [linkAttachment, setLinkAttachment] = useState<string | null>(null);

  // Active Card Modal State (Replies/Comments View)
  const [activeReplyMsg, setActiveReplyMsg] = useState<Message | null>(null);
  const [replyInputText, setReplyInputText] = useState('');

  // Lightbox State
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadSpaceData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          window.location.href = '/';
          return;
        }
        setUser(u);

        const currentSpace = await dbService.getSpaceById(spaceId);
        setSpace(currentSpace);

        const msgs = await dbService.getMessages(spaceId);
        setMessages(msgs || []);
      } catch (err) {
        console.error("Error loading space:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSpaceData();
  }, [spaceId]);

  const toggleAnonymousNightMode = () => {
    setIsAnonymousNight(!isAnonymousNight);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !user) return;

    try {
      const newMsg = await dbService.sendMessage(spaceId, user.id, postContent.trim());
      setPostContent('');
      setSelectedImages([]);
      setLinkAttachment(null);
      setIsExpanded(false);

      const msgs = await dbService.getMessages(spaceId);
      setMessages(msgs || []);
    } catch (err: any) {
      alert(err.message || 'Failed to post message');
    }
  };

  const handleAddComment = async (msgId: string) => {
    if (!replyInputText.trim() || !user) return;
    try {
      await dbService.addComment(msgId, user.id, replyInputText.trim(), 'fellow');
      setReplyInputText('');
      const msgs = await dbService.getMessages(spaceId);
      setMessages(msgs || []);
      if (activeReplyMsg) {
        const updated = msgs.find(m => m.id === activeReplyMsg.id);
        if (updated) setActiveReplyMsg(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add comment');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const isVideo = files.some(f => f.type.startsWith('video/'));
      if (isVideo) {
        alert("Videos are not supported. Please upload images or links.");
        return;
      }
      const newImgs: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target?.result) {
            newImgs.push(evt.target.result as string);
            if (newImgs.length === files.length) {
              setSelectedImages(prev => [...prev, ...newImgs]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
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
        <span>Syncing Joault Space Feed...</span>
      </div>
    );
  }

  return (
    <div className={`space-body ${isAnonymousNight ? 'anonymous-night' : ''}`} style={{ minHeight: '100vh' }}>
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

            <div className="user-avatar-pill" id="user-avatar-head">
              <span id="user-avatar-text">{getUserInitials()}</span>
            </div>
          </div>
        </div>

        {/* SUB-HEADER SPACE METADATA & NAV TABS */}
        <div className="space-subheader-container">
          <div className="space-meta-row">
            <h1 className="space-name-tag" id="current-space-title">#{space?.name || 'tech-builders'}</h1>
            <span className="space-members-count" id="current-space-members">· 1,240 members</span>
          </div>

          {/* FEED / GROUPS / EXPLORE TABS */}
          <nav className="space-nav-tabs">
            <button type="button" className="tab-item active">Feed</button>
            <Link href="/twogroups" className="tab-item">Groups</Link>
            <button type="button" className="tab-item">Explore</button>
          </nav>
        </div>
      </header>

      {/* MAIN FEED CONTAINER */}
      <main className="space-main">
        <div className="feed-wrapper">
          {/* CREATE POST BOX ("WHAT'S ON YOUR MIND?") */}
          <div className="compose-card-box" id="compose-box">
            {!isExpanded ? (
              <div className="compose-collapsed" onClick={() => setIsExpanded(true)}>
                <div className="avatar-circle-sm">{getUserInitials()}</div>
                <span className="placeholder-text">What's on your mind?</span>
              </div>
            ) : (
              <form id="form-create-post" className="compose-expanded" onSubmit={handlePostSubmit}>
                <div className="compose-header">
                  <div className="avatar-circle-sm">{getUserInitials()}</div>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="compose-textarea"
                    placeholder="What's on your mind?"
                    rows={3}
                    required
                  />
                </div>

                {/* ATTACHMENT PREVIEW TRAY */}
                {(selectedImages.length > 0 || linkAttachment) && (
                  <div className="attachment-preview-tray" style={{ display: 'flex', gap: '8px', padding: '8px 0', flexWrap: 'wrap' }}>
                    {selectedImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="attachment"
                        style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => setLightboxImg(img)}
                      />
                    ))}
                    {linkAttachment && (
                      <div style={{ background: '#FAF6F0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#23150D' }}>
                        🔗 {linkAttachment}
                      </div>
                    )}
                  </div>
                )}

                <div className="compose-footer">
                  <div className="compose-tools-row">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                    />
                    <button type="button" className="btn-attach-tool" onClick={() => fileInputRef.current?.click()} title="Attach Images">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>Images</span>
                    </button>

                    <button
                      type="button"
                      className="btn-attach-tool"
                      onClick={() => {
                        const url = prompt("Enter link URL:");
                        if (url) setLinkAttachment(url);
                      }}
                      title="Attach Link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      <span>Link</span>
                    </button>
                    <span className="char-count" id="post-char-count">{280 - postContent.length}</span>
                  </div>

                  <div className="compose-actions">
                    <button type="button" onClick={() => setIsExpanded(false)} className="btn-cancel-sm">Cancel</button>
                    <button type="submit" className="btn-post-gold">Post</button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* FEED DIVIDER TIMELINE LABEL */}
          <div className="timeline-divider">
            <span>LATEST</span>
          </div>

          {/* FEED POST CARDS CONTAINER */}
          <div id="feed-posts-container" className="feed-posts-list">
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#786C60', fontSize: '0.875rem' }}>
                No messages yet. Be the first to share your thoughts in this space!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="card-outer-wrapper">
                  <div className="card-box card-face-main" onClick={() => setActiveReplyMsg(msg)}>
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
                      <span className="metric-pill">💬 {msg.comments?.length || 0} Replies</span>
                      <span className="metric-pill">🔥 {msg.reactions?.length || 0} Joault Gifts</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* COMMENTS / REPLIES MODAL */}
      {activeReplyMsg && (
        <div className="modal-backdrop" onClick={() => setActiveReplyMsg(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Conversation Thread</h3>
              <button type="button" onClick={() => setActiveReplyMsg(null)} className="modal-close-btn">&times;</button>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #EDE4D7' }}>
              <p style={{ fontWeight: 600, color: '#23150D' }}>{activeReplyMsg.content}</p>
              <span style={{ fontSize: '0.75rem', color: '#786C60' }}>
                Posted by {activeReplyMsg.profile?.username || 'Anonymous Member'}
              </span>
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(activeReplyMsg.comments || []).length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#786C60' }}>No comments yet. Add a reply below.</span>
              ) : (
                (activeReplyMsg.comments || []).map((c) => (
                  <div key={c.id} style={{ background: '#FAF6F0', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 700, color: '#23150D', display: 'inline-block', marginRight: '6px' }}>

                      {c.profile?.username || 'Member'}:
                    </span>
                    <span>{c.content}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #EDE4D7', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={replyInputText}
                onChange={(e) => setReplyInputText(e.target.value)}
                placeholder="Write a reply..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: '9999px', border: '1px solid #EDE4D7', fontSize: '0.8125rem' }}
              />
              <button
                type="button"
                onClick={() => handleAddComment(activeReplyMsg.id)}
                style={{ background: '#23150D', color: '#FFF', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

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
