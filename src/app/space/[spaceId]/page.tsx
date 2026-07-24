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
  Eye
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

  // Joault Gift Floating Emojis State

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

        triggerJoaultGiftsForUnseenReactions(msgs);

      } catch (err) {
        console.error('Failed to load space room:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSpaceData();
  }, [spaceId, router]);

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
        triggerJoaultGiftsForUnseenReactions(msgs);
      } catch (err) {
        console.error('Error polling room:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [spaceId]);

  const triggerJoaultGiftsForUnseenReactions = (msgs: Message[]) => {
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
    const x = Math.floor(Math.random() * 70) + 15;
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

  const handleSwipeLeftComment = (messageId: string) => {
    setReplyingMessageId(messageId === replyingMessageId ? null : messageId);
    setExpandedCommentsMessageId(messageId);
  };

  const handleSwipeRightViewComments = (messageId: string) => {
    setExpandedCommentsMessageId(messageId === expandedCommentsMessageId ? null : messageId);
  };

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
      <div className={`min-h-screen flex flex-col items-center justify-center gap-3 font-sans ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs font-bold tracking-wider">Connecting to Space Protocol...</span>
      </div>
    );
  }

  if (!space) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-3 font-sans ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <ShieldAlert className="w-10 h-10 text-red-500" />
        <span className="text-xs font-bold">Space not found or permission denied.</span>
        <Link href="/dashboard" className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isOwner = space.owner_id === currentUser?.id;
  const isDualGroupMode = !!space.guest_space_name;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode ? 'dark bg-black text-[#f7f9f9]' : 'bg-white text-[#0f1419]'
    } font-sans select-none relative overflow-x-hidden`}>
      
      {/* JOAULT GIFT FLOATING EMOJIS */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map(item => (
          <div 
            key={item.id} 
            className="joault-gift-emoji"
            style={{ left: `${item.x}%`, bottom: '15%' }}
          >
            {item.emoji}
          </div>
        ))}
      </div>


      {/* THREADS MINIMALIST HEADER */}
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
        isDarkMode ? 'bg-black/95 border-[#18181b]' : 'bg-white/95 border-[#f0f0f1]'
      } backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-outfit font-bold text-xl">{space.name}</h1>
                {isDualGroupMode && (
                  <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    Dual Group: {space.guest_space_name}
                  </span>
                )}
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  isOwner ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'
                }`}>
                  {isOwner ? 'Admin' : 'Member'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{space.auth_protocol}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAnonymousDarkMode}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                isDarkMode 
                  ? 'bg-zinc-900 text-zinc-200 border-zinc-800' 
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200'
              }`}
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Dark Mode (ANONYMOUS ON)' : 'Light Mode (Identities Shown)'}</span>
            </button>

            <button onClick={copyProtocol} className="px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 inline" /> : <Copy className="w-3.5 h-3.5 inline" />}
              <span className="ml-1">{copied ? 'Copied!' : 'Code'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ROOM MAIN CONTENT GRID */}
      <main className="max-w-6xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">
        
        {/* SIDEBAR MEMBERS */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className={`p-5 rounded-3xl border ${
            isDarkMode ? 'bg-[#09090b] border-[#18181b]' : 'bg-white border-[#f0f0f1]'
          } space-y-3`}>
            
            <h3 className="font-outfit font-bold text-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Space Members ({members.length})
            </h3>

            <div className="space-y-2">
              {members.map((mem) => {
                const profile = mem.profile;
                const isMemOwner = mem.profile_id === space.owner_id;
                
                const displayName = isDarkMode ? `Ghost Member #${mem.id.slice(-4)}` : profile?.username;
                const displayAvatar = isDarkMode ? `https://api.dicebear.com/7.x/bottts/svg?seed=ghost-${mem.id}` : profile?.avatar_url;

                return (
                  <div key={mem.id} className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={displayAvatar} alt={displayName} className="w-7 h-7 rounded-full bg-white border border-black dark:border-white" />
                      <div>
                        <h5 className="font-bold">{displayName}</h5>
                        <span className="text-[10px] text-zinc-400 block">{isMemOwner ? 'Admin' : 'Member'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </aside>

        {/* MAIN THREADS FEED */}
        <section className="lg:col-span-3 flex flex-col justify-between h-[calc(100vh-140px)]">
          
          <div className="flex-grow overflow-y-auto pr-2 space-y-4 pb-6">
            
            <div class="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold flex items-center justify-between text-zinc-500">
              <span>Swipe Left = Comment | Swipe Right = View Comments | Double Tap = React with Joault Emojis</span>
              <span className="font-mono text-[10px] font-bold">{messages.length} Messages</span>
            </div>


            {messages.length === 0 ? (
              <div className="text-center py-16 text-xs text-zinc-400">
                No messages posted yet. Start the discussion below!
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.sender_id === currentUser?.id;
                
                const senderName = isDarkMode ? `Anonymous Phantom` : msg.profile?.username || 'Member';
                const senderAvatar = isDarkMode ? `https://api.dicebear.com/7.x/bottts/svg?seed=ghost-${msg.sender_id}` : msg.profile?.avatar_url;

                const hasComments = msg.comments && msg.comments.length > 0;
                const isReplying = replyingMessageId === msg.id;
                const isExpanded = expandedCommentsMessageId === msg.id;

                return (
                  <div 
                    key={msg.id}
                    onDoubleClick={() => handleDoubleTapReact(msg.id, '🔥')}
                    className="threads-post-card rounded-2xl border border-zinc-200 dark:border-zinc-800"
                  >
                    
                    {/* DUAL GROUP DIAGONAL SPLIT MODE */}
                    {isDualGroupMode ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <img src={senderAvatar} alt={senderName} className="w-8 h-8 rounded-full bg-white border border-black dark:border-white" />
                              <div>
                                <h5 className="text-xs font-bold">{senderName}</h5>
                                <span className="text-[10px] text-zinc-400 font-mono">{msg.group_name || space.name} &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            {isDarkMode && <span className="text-[9px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">ANONYMOUS</span>}
                          </div>
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">{msg.content}</p>
                        </div>

                        {/* Comments Sub-Rectangles */}
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center text-[11px] font-bold text-zinc-500">
                            <span>Comments ({msg.comments?.length || 0})</span>
                            <button onClick={() => handleSwipeLeftComment(msg.id)} className="hover:underline flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" /> Comment
                            </button>
                          </div>
                          {msg.comments?.map(cmt => {
                            const cmtName = isDarkMode ? `Ghost Commenter` : cmt.profile?.username || 'Member';
                            return (
                              <div key={cmt.id} className="threads-sub-rectangle text-xs space-y-1">
                                <div className="flex justify-between font-bold text-[10px]">
                                  <span>{cmtName}</span>
                                  <span className="text-zinc-400">{new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-zinc-700 dark:text-zinc-300">{cmt.content}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* SINGLE GROUP THREADS RECTANGLE */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={senderAvatar} alt={senderName} className="w-8 h-8 rounded-full bg-white border border-black dark:border-white" />
                            <div>
                              <h5 className="text-xs font-bold flex items-center gap-1">
                                {senderName}
                                {isMyMessage && !isDarkMode && <span className="text-[9px] bg-black text-white px-1.5 rounded-full">YOU</span>}
                              </h5>
                              <span className="text-[10px] text-zinc-400 font-mono">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs">
                            <button onClick={() => handleDoubleTapReact(msg.id, '🔥')} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">🔥</button>
                            <button onClick={() => handleDoubleTapReact(msg.id, '🚀')} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">🚀</button>
                            <button onClick={() => handleDoubleTapReact(msg.id, '❤️')} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">❤️</button>
                          </div>
                        </div>

                        <p className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                          {msg.content}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-400">
                          <button onClick={() => handleSwipeLeftComment(msg.id)} className="hover:text-black dark:hover:text-white transition flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> Comment (Swipe Left)
                          </button>
                          <button onClick={() => handleSwipeRightViewComments(msg.id)} className="hover:text-black dark:hover:text-white transition flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Comments ({msg.comments?.length || 0})
                          </button>
                        </div>

                        {(isExpanded || hasComments) && (
                          <div className="space-y-2 pt-2">
                            {msg.comments?.map(cmt => {
                              const cmtName = isDarkMode ? `Ghost Commenter` : cmt.profile?.username || 'Member';
                              return (
                                <div key={cmt.id} className="threads-sub-rectangle text-xs space-y-1">
                                  <div className="flex justify-between font-bold text-[10px]">
                                    <span>{cmtName}</span>
                                    <span className="text-zinc-400">{new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-zinc-700 dark:text-zinc-300">{cmt.content}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {isReplying && (
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-grow px-3 py-1.5 rounded-full border text-xs outline-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                            <button onClick={() => handleAddComment(msg.id)} className="px-4 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
                              Post
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
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Post update to space, ${isDarkMode ? 'Anonymous Phantom' : currentUser?.username}...`}
              className="flex-grow px-5 py-3 rounded-full border text-xs outline-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-black dark:focus:border-white transition"
              id="message_input"
            />
            <button type="submit" disabled={sendLoading || !newMessage.trim()} className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold shrink-0">
              {sendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

        </section>

      </main>

    </div>
  );
}
