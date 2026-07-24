'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  Copy, 
  Check, 
  ShieldCheck, 
  Loader2, 
  ShieldAlert, 
  X, 
  Sparkles, 
  MessageSquare,
  Key,
  Clock,
  Moon,
  Sun,
  Flame,
  Heart,
  Smile,
  Layers,
  CornerDownRight,
  Eye,
  Lock
} from 'lucide-react';
import { dbService, Profile, Space, SpaceMember, Message, Comment, MessageReaction } from '@/lib/supabaseClient';

export default function SpaceRoomPage({ params }: { params: Promise<{ spaceId: string }> }) {
  const resolvedParams = use(params);
  const spaceId = resolvedParams.spaceId;
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dark Mode Anonymous Toggle State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Interactive Gesture States
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [expandedCommentsMessageId, setExpandedCommentsMessageId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // TikTok Gift Floating Emojis State
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const seenReactionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function loadSpaceData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          router.push('/login');
          return;
        }
        setCurrentUser(u);

        const currentSpace = await dbService.getSpaceById(spaceId);
        if (!currentSpace) {
          setLoading(false);
          return;
        }

        const spaceMembers = await dbService.getSpaceMembers(spaceId);
        const isMember = spaceMembers.some(m => m.profile_id === u.id);
        const isOwner = currentSpace.owner_id === u.id;

        if (!isMember && !isOwner) {
          router.push('/dashboard');
          return;
        }

        setSpace(currentSpace);
        setIsDarkMode(!!currentSpace.is_anonymous_mode);
        setMembers(spaceMembers);

        const msgs = await dbService.getMessages(spaceId);
        setMessages(msgs);

        // Check for unseen reactions to trigger TikTok Gift floating emojis on initial load!
        triggerTikTokGiftsForUnseenReactions(msgs);

      } catch (err) {
        console.error('Failed to load space room:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSpaceData();
  }, [spaceId, router]);

  // Real-time message polling & reaction checker
  useEffect(() => {
    if (!spaceId) return;

    const interval = setInterval(async () => {
      try {
        const [msgs, currentSpace] = await Promise.all([
          dbService.getMessages(spaceId),
          dbService.getSpaceById(spaceId)
        ]);
        setMessages(msgs);
        if (currentSpace) {
          setIsDarkMode(!!currentSpace.is_anonymous_mode);
        }
        triggerTikTokGiftsForUnseenReactions(msgs);
      } catch (err) {
        console.error('Error polling room:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [spaceId]);

  // TikTok Gift Emojis Trigger
  const triggerTikTokGiftsForUnseenReactions = (msgs: Message[]) => {
    msgs.forEach(msg => {
      if (msg.reactions && msg.reactions.length > 0) {
        msg.reactions.forEach(r => {
          if (!seenReactionsRef.current.has(r.id)) {
            seenReactionsRef.current.add(r.id);
            spawnFloatingEmoji(r.emoji);
          }
        });
      }
    });
  };

  const spawnFloatingEmoji = (emoji: string) => {
    const id = `gift-${Math.random().toString(36).substr(2, 9)}`;
    const x = Math.floor(Math.random() * 70) + 15; // Random X percentage offset
    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2200);
  };

  const handleToggleAnonymousDarkMode = async () => {
    const nextState = !isDarkMode;
    setIsDarkMode(nextState);
    if (space) {
      await dbService.toggleSpaceAnonymousMode(space.id, nextState);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !space) return;

    setSendLoading(true);
    try {
      const myMem = members.find(m => m.profile_id === currentUser.id);
      await dbService.sendMessage(space.id, currentUser.id, newMessage.trim(), myMem?.group_name || space.name);
      setNewMessage('');
      const updatedMsgs = await dbService.getMessages(space.id);
      setMessages(updatedMsgs);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendLoading(false);
    }
  };

  // Swipe Left -> Comment on message
  const handleSwipeLeftComment = (messageId: string) => {
    setReplyingMessageId(messageId === replyingMessageId ? null : messageId);
    setExpandedCommentsMessageId(messageId); // Auto open comments box
  };

  // Swipe Right -> Expand/view comments
  const handleSwipeRightViewComments = (messageId: string) => {
    setExpandedCommentsMessageId(messageId === expandedCommentsMessageId ? null : messageId);
  };

  // Double Tap -> React to message & trigger TikTok Gift Emoji Float
  const handleDoubleTapReact = async (messageId: string, emoji: string = '🔥') => {
    if (!currentUser) return;
    spawnFloatingEmoji(emoji);
    try {
      await dbService.addReaction(messageId, currentUser.id, emoji);
      const updatedMsgs = await dbService.getMessages(spaceId);
      setMessages(updatedMsgs);
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const handleAddComment = async (messageId: string) => {
    if (!commentText.trim() || !currentUser) return;
    try {
      await dbService.addComment(messageId, currentUser.id, commentText.trim(), 'fellow');
      setCommentText('');
      setReplyingMessageId(null);
      const updatedMsgs = await dbService.getMessages(spaceId);
      setMessages(updatedMsgs);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const copyProtocol = () => {
    if (space) {
      navigator.clipboard.writeText(space.auth_protocol);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 font-sans ${
        isDarkMode ? 'bg-[#121316] text-white' : 'bg-[#f8f9fa] text-[#1a73e8]'
      }`}>
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="text-sm font-bold tracking-wider">Connecting to Space Protocol...</span>
      </div>
    );
  }

  if (!space) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 font-sans ${
        isDarkMode ? 'bg-[#121316] text-white' : 'bg-[#f8f9fa] text-[#202124]'
      }`}>
        <ShieldAlert className="w-12 h-12 text-[#1a73e8]" />
        <span className="text-sm font-semibold">Space not found or permission denied.</span>
        <Link href="/dashboard" className="google-pill-btn py-2.5 px-5 text-xs font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = space.owner_id === currentUser?.id;
  const isDualGroupMode = !!space.guest_space_name;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'dark bg-[#121316] text-[#e8eaed]' : 'bg-[#f8f9fa] text-[#202124]'
    } font-sans select-none relative overflow-x-hidden`}>
      
      {/* TIKTOK GIFT FLOATING EMOJIS OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map(item => (
          <div 
            key={item.id} 
            className="tiktok-gift-emoji"
            style={{ left: `${item.x}%`, bottom: '15%' }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* HEADER BAR */}
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1e1f23]/95 border-[#303134]' : 'bg-white/95 border-[#dadce0]'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className={`p-2.5 rounded-2xl border transition ${
                isDarkMode ? 'bg-[#292a2e] border-[#303134] text-[#e8eaed]' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124]'
              }`}
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-bold text-xl">{space.name}</h1>
                {isDualGroupMode && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    Dual Group: {space.guest_space_name}
                  </span>
                )}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  isOwner ? 'bg-[#1a73e8]/20 text-[#1a73e8] border-[#1a73e8]/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {isOwner ? 'Space Admin' : 'Member'}
                </span>
              </div>
              <p className="text-xs text-[#5f6368] flex items-center gap-1 font-mono mt-0.5">
                <Key className="w-3.5 h-3.5 text-[#d97706]" /> {space.auth_protocol}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Anonymous Switch */}
            <button
              onClick={handleToggleAnonymousDarkMode}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition cursor-pointer ${
                isDarkMode 
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/40' 
                  : 'bg-amber-500/10 text-amber-800 border-amber-500/30'
              }`}
              title="Toggle Dark Mode (Anonymous Mode)"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'Dark Mode (ANONYMOUS ON)' : 'Light Mode (Identities Shown)'}</span>
            </button>

            <button
              onClick={copyProtocol}
              className="google-pill-outlined py-2 px-4 text-xs font-bold"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ROOM MAIN CONTENT GRID */}
      <main className="max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">
        
        {/* SIDEBAR MEMBERS */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className={`p-5 rounded-[28px] border ${
            isDarkMode ? 'bg-[#1e1f23] border-[#303134]' : 'bg-white border-[#dadce0]'
          } shadow-sm space-y-4`}>
            
            <div className="flex items-center justify-between">
              <h3 className="font-outfit font-bold text-base flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-[#1a73e8]" /> Space Members ({members.length})
              </h3>
            </div>

            <div className="space-y-3">
              {members.map((mem) => {
                const profile = mem.profile;
                const isMemOwner = mem.profile_id === space.owner_id;
                
                // Anonymize if dark mode is active
                const displayName = isDarkMode ? `Ghost Member #${mem.id.slice(-4)}` : profile?.username;
                const displayAvatar = isDarkMode ? `https://api.dicebear.com/7.x/bottts/svg?seed=ghost-${mem.id}` : profile?.avatar_url;

                return (
                  <div 
                    key={mem.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between ${
                      isDarkMode ? 'bg-[#292a2e] border-[#303134]' : 'bg-[#f8f9fa] border-[#dadce0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={displayAvatar} 
                        alt={displayName}
                        className="w-8 h-8 rounded-full border border-[#1a73e8] bg-white" 
                      />
                      <div>
                        <h5 className="text-xs font-bold">{displayName}</h5>
                        <span className="text-[10px] text-[#5f6368]">
                          {mem.group_name || space.name} &bull; {isMemOwner ? 'Admin' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </aside>

        {/* MAIN MESSAGES FEED (X-STYLE RECTANGLES WITH SUB-RECTANGLE COMMENTS & GESTURES) */}
        <section className="lg:col-span-3 flex flex-col justify-between h-[calc(100vh-140px)]">
          
          <div className="flex-grow overflow-y-auto pr-2 space-y-6 pb-6">
            
            {/* Gesture Tip Bar */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
              isDarkMode ? 'bg-purple-950/40 text-purple-300 border-purple-500/30' : 'bg-blue-50 text-[#1a73e8] border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Swipe Left = Comment | Swipe Right = View Comments | Double Tap = React with Floating TikTok Emojis</span>
              </div>
              <span className="font-mono text-[10px]">{messages.length} Messages Total</span>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-16 text-xs text-[#5f6368]">
                No messages posted yet. Be the first to start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.sender_id === currentUser?.id;
                
                // Anonymize in Dark Mode
                const senderName = isDarkMode ? `Anonymous Phantom` : msg.profile?.username || 'Member';
                const senderAvatar = isDarkMode ? `https://api.dicebear.com/7.x/bottts/svg?seed=ghost-${msg.sender_id}` : msg.profile?.avatar_url;

                const hasComments = msg.comments && msg.comments.length > 0;
                const isReplying = replyingMessageId === msg.id;
                const isExpanded = expandedCommentsMessageId === msg.id;

                return (
                  <div 
                    key={msg.id}
                    onDoubleClick={() => handleDoubleTapReact(msg.id, '🔥')}
                    className={`google-x-card p-5 border transition duration-200 ${
                      isDualGroupMode ? 'dual-group-card' : ''
                    }`}
                  >
                    
                    {/* DUAL GROUP SPLIT-RECTANGLE MODE */}
                    {isDualGroupMode ? (
                      <div>
                        {/* Top-Left Half: Main Message */}
                        <div className="dual-split-top-left">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <img src={senderAvatar} alt={senderName} className="w-8 h-8 rounded-full border border-[#1a73e8] bg-white" />
                              <div>
                                <h5 className="text-xs font-bold">{senderName}</h5>
                                <span className="text-[10px] text-[#1a73e8] font-mono font-bold">
                                  {msg.group_name || space.name} &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            {isDarkMode && (
                              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold">
                                ANONYMOUS
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-normal leading-relaxed text-[#202124] dark:text-[#e8eaed]">
                            {msg.content}
                          </p>
                        </div>

                        {/* Bottom-Right Half: Comments Sub-Rectangles */}
                        <div className="dual-split-bottom-right space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#d97706]">
                            <span>Opponent & Fellow Member Comments ({msg.comments?.length || 0})</span>
                            <div className="flex gap-2">
                              <button onClick={() => handleSwipeLeftComment(msg.id)} className="hover:underline flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" /> Comment
                              </button>
                            </div>
                          </div>

                          {/* Render Sub-Rectangles for Comments */}
                          {msg.comments && msg.comments.length > 0 && (
                            <div className="space-y-2">
                              {msg.comments.map(cmt => {
                                const cmtName = isDarkMode ? `Ghost Commenter` : cmt.profile?.username || 'Member';
                                return (
                                  <div key={cmt.id} className="google-sub-rectangle space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                      <span className="text-[#1a73e8]">{cmtName}</span>
                                      <span className="text-[#5f6368]">{new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-[#202124] dark:text-[#e8eaed]">{cmt.content}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* SINGLE GROUP STANDARD X-STYLE RECTANGLE */
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img src={senderAvatar} alt={senderName} className="w-9 h-9 rounded-full border border-[#1a73e8] bg-white" />
                            <div>
                              <h5 className="text-xs font-bold flex items-center gap-1.5">
                                {senderName}
                                {isMyMessage && !isDarkMode && (
                                  <span className="text-[9px] bg-[#1a73e8]/20 text-[#1a73e8] px-2 py-0.2 rounded-full font-mono font-bold">YOU</span>
                                )}
                              </h5>
                              <span className="text-[10px] text-[#5f6368] font-mono">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Quick Reactions Bar */}
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDoubleTapReact(msg.id, '🔥')} className="p-1 hover:bg-[#1a73e8]/10 rounded-full transition text-xs">🔥</button>
                            <button onClick={() => handleDoubleTapReact(msg.id, '🚀')} className="p-1 hover:bg-[#1a73e8]/10 rounded-full transition text-xs">🚀</button>
                            <button onClick={() => handleDoubleTapReact(msg.id, '❤️')} className="p-1 hover:bg-[#1a73e8]/10 rounded-full transition text-xs">❤️</button>
                          </div>
                        </div>

                        {/* Main Message Text */}
                        <p className="text-sm font-normal leading-relaxed mb-4 text-[#202124] dark:text-[#e8eaed]">
                          {msg.content}
                        </p>

                        {/* Interactive Bar: Swipe Left / Right simulation */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#dadce0]/40 text-xs font-semibold text-[#5f6368]">
                          <button 
                            onClick={() => handleSwipeLeftComment(msg.id)}
                            className="hover:text-[#1a73e8] transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-[#1a73e8]" />
                            <span>Comment (Swipe Left)</span>
                          </button>

                          <button 
                            onClick={() => handleSwipeRightViewComments(msg.id)}
                            className="hover:text-[#1a73e8] transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-[#d97706]" />
                            <span>Comments ({msg.comments?.length || 0})</span>
                          </button>
                        </div>

                        {/* Sub-Rectangle Comments Container */}
                        {(isExpanded || hasComments) && (
                          <div className="mt-4 pt-3 border-t border-[#dadce0]/30 space-y-2">
                            {msg.comments?.map(cmt => {
                              const cmtName = isDarkMode ? `Ghost Commenter` : cmt.profile?.username || 'Member';
                              return (
                                <div key={cmt.id} className="google-sub-rectangle space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-[#1a73e8]">{cmtName}</span>
                                    <span className="text-[#5f6368]">{new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-xs text-[#202124] dark:text-[#e8eaed]">{cmt.content}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Inline Comment Input (Triggered by Swipe Left) */}
                        {isReplying && (
                          <div className="mt-3 flex gap-2 pt-2 border-t border-[#dadce0]/30">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-grow px-3 py-2 rounded-xl border text-xs outline-none bg-white dark:bg-[#121316] border-[#dadce0] dark:border-[#303134]"
                            />
                            <button
                              onClick={() => handleAddComment(msg.id)}
                              className="google-pill-btn py-1.5 px-4 text-xs font-bold"
                            >
                              Post Comment
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })
            )}

          </div>

          {/* CHAT INPUT BAR */}
          <form onSubmit={handleSendMessage} className="flex gap-3 pt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Post message to space, ${isDarkMode ? 'Anonymous Phantom' : currentUser?.username}...`}
              className={`flex-grow px-5 py-3.5 rounded-full border text-sm outline-none ${
                isDarkMode ? 'bg-[#1e1f23] border-[#303134] text-white' : 'bg-white border-[#dadce0] text-[#202124]'
              } focus:border-[#1a73e8]`}
              id="message_input"
            />
            <button
              type="submit"
              disabled={sendLoading || !newMessage.trim()}
              className="google-pill-btn py-3.5 px-6 shrink-0"
              id="message_send_btn"
            >
              {sendLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>

        </section>

      </main>

    </div>
  );
}
