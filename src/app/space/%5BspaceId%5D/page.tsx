'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  Copy, 
  Check, 
  Users, 
  Loader2, 
  ShieldAlert, 
  Sparkles, 
  CheckSquare, 
  X,
  Plus,
  MessageSquareOff
} from 'lucide-react';
import { 
  dbService, 
  Profile, 
  Space, 
  SpaceMember, 
  Message, 
  SpaceRequest 
} from '@/lib/supabaseClient';

export default function SpacePage() {
  const router = useRouter();
  const params = useParams();
  const spaceId = params?.spaceId as string;

  const [user, setUser] = useState<Profile | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SpaceRequest[]>([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Admin state inside room
  const [adminLoadingId, setAdminLoadingId] = useState<string | null>(null);

  // Auto-scroll refs for each member box
  const scrollRefs = useRef<{ [profileId: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!spaceId) return;

    async function loadSpaceData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          router.push('/login');
          return;
        }
        setUser(u);

        // Fetch Space Details
        const spaceDetails = await dbService.getSpaceDetails(spaceId);
        setSpace(spaceDetails);

        // Fetch Space Members
        const spaceMembers = await dbService.getSpaceMembers(spaceId);
        setMembers(spaceMembers);

        // Check if user is a member or owner of this space
        const isMember = spaceMembers.some(m => m.profile_id === u.id) || spaceDetails.owner_id === u.id;
        if (!isMember) {
          router.push('/dashboard');
          return;
        }

        // Fetch Messages
        const spaceMessages = await dbService.getMessages(spaceId);
        setMessages(spaceMessages);

        // Fetch pending requests if owner
        if (spaceDetails.owner_id === u.id) {
          const reqs = await dbService.getPendingRequestsForOwner(u.id);
          const spaceReqs = reqs.filter(r => r.space_id === spaceId);
          setPendingRequests(spaceReqs);
        }

      } catch (err) {
        console.error('Error loading space:', err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadSpaceData();
  }, [spaceId, router]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!spaceId || loading) return;

    const unsubscribe = dbService.subscribeToMessages(spaceId, (newMsg) => {
      setMessages(prev => {
        // Prevent duplicate appending
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      unsubscribe();
    };
  }, [spaceId, loading]);

  // Periodic poll for members list & requests (simulates realtime join events)
  useEffect(() => {
    if (!spaceId || !space || !user) return;
    
    const interval = setInterval(async () => {
      try {
        const spaceMembers = await dbService.getSpaceMembers(spaceId);
        setMembers(spaceMembers);

        if (space.owner_id === user.id) {
          const reqs = await dbService.getPendingRequestsForOwner(user.id);
          const spaceReqs = reqs.filter(r => r.space_id === spaceId);
          setPendingRequests(spaceReqs);
        }
      } catch (err) {
        console.error('Error polling space members:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [spaceId, space, user]);

  // Scroll to bottom helper for member boxes
  useEffect(() => {
    // Scroll all scroll areas to bottom when messages list updates
    members.forEach(member => {
      const el = scrollRefs.current[member.profile_id];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [messages, members]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !space) return;

    setSendLoading(true);
    try {
      const msg = await dbService.sendMessage(space.id, user.id, newMessage.trim());
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendLoading(false);
    }
  };

  const handleApproveJoin = async (requestId: string) => {
    setAdminLoadingId(requestId);
    try {
      await dbService.updateRequestStatus(requestId, 'approved');
      
      // Update local state
      const spaceMembers = await dbService.getSpaceMembers(spaceId);
      setMembers(spaceMembers);
      
      if (user && space) {
        const reqs = await dbService.getPendingRequestsForOwner(user.id);
        const spaceReqs = reqs.filter(r => r.space_id === spaceId);
        setPendingRequests(spaceReqs);
      }
    } catch (err) {
      console.error('Error approving request:', err);
    } finally {
      setAdminLoadingId(null);
    }
  };

  const handleRejectJoin = async (requestId: string) => {
    setAdminLoadingId(requestId);
    try {
      await dbService.updateRequestStatus(requestId, 'rejected');
      if (user) {
        const reqs = await dbService.getPendingRequestsForOwner(user.id);
        const spaceReqs = reqs.filter(r => r.space_id === spaceId);
        setPendingRequests(spaceReqs);
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    } finally {
      setAdminLoadingId(null);
    }
  };

  const copyToClipboard = () => {
    if (!space) return;
    navigator.clipboard.writeText(space.auth_protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center text-txt-muted gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
        <span className="text-sm font-semibold tracking-wider">Entering Space...</span>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center text-txt-muted gap-4">
        <ShieldAlert className="w-12 h-12 text-brand-primary" />
        <span className="text-sm font-semibold">Space not found or permission denied.</span>
        <Link href="/dashboard" className="px-4 py-2 bg-brand-primary rounded-xl text-txt-primary text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col bg-bg-deep overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="ambient-bg top-[-300px] left-[-300px] opacity-40" />
      <div className="ambient-bg bottom-[-300px] right-[-300px] opacity-40" />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-border-light bg-bg-card/75 backdrop-blur-md px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="p-2 rounded-lg bg-bg-deep hover:bg-bg-hover text-txt-muted hover:text-brand-accent transition border border-border-light"
              id="space_back_btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-outfit font-semibold text-lg text-txt-primary leading-tight">{space.name}</h1>
              <p className="text-[11px] text-txt-muted flex items-center gap-1">
                <Users className="w-3 h-3 text-brand-accent" /> {members.length} members
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-txt-muted uppercase tracking-wider font-semibold">Auth Protocol</span>
              <span className="font-mono text-xs text-brand-accent font-semibold">{space.auth_protocol}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-bg-input hover:bg-bg-hover text-brand-accent border border-border-light transition cursor-pointer"
              title="Copy Auth Protocol Key"
              id="space_copy_protocol_btn"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Panel */}
      <div className="relative z-10 flex-grow flex overflow-hidden w-full max-w-7xl mx-auto">
        
        {/* Sidebar details */}
        <aside className="w-64 border-r border-border-light bg-bg-card/30 p-6 flex-col gap-6 hidden md:flex overflow-y-auto">
          {/* Members list */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-txt-muted uppercase tracking-wider mb-2">Space Members</h3>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-bg-hover/30 transition">
                  <img 
                    src={member.profile?.avatar_url} 
                    alt={member.profile?.username} 
                    className="w-8 h-8 rounded-full border border-brand-primary/40 bg-bg-deep shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h5 className="font-semibold text-xs text-txt-primary truncate">
                      {member.profile?.username}
                    </h5>
                    <span className="text-[9px] text-txt-muted capitalize block">
                      {member.role} {member.profile_id === user?.id && '(You)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin panel for joining approval */}
          {space.owner_id === user?.id && pendingRequests.length > 0 && (
            <div className="mt-6 border-t border-border-light pt-6 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" /> Access Requests
              </h3>
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-bg-input p-3 rounded-lg border border-border-light flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={req.profile?.avatar_url} 
                        alt={req.profile?.username} 
                        className="w-6 h-6 rounded-full bg-bg-deep border border-brand-primary/30"
                      />
                      <span className="text-xs font-semibold text-txt-primary truncate">{req.profile?.username}</span>
                    </div>
                    <div className="flex gap-1.5 w-full">
                      <button
                        onClick={() => handleApproveJoin(req.id)}
                        disabled={adminLoadingId === req.id}
                        className="flex-1 py-1 rounded bg-green-950/65 text-green-300 border border-green-800/40 text-[10px] font-semibold transition flex items-center justify-center cursor-pointer"
                      >
                        {adminLoadingId === req.id ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectJoin(req.id)}
                        disabled={adminLoadingId === req.id}
                        className="flex-1 py-1 rounded bg-red-950/65 text-red-300 border border-red-800/40 text-[10px] font-semibold transition flex items-center justify-center cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Member Boxes Grid */}
        <main className="flex-grow flex flex-col overflow-hidden bg-bg-deep/20 relative">
          
          {/* Scrollable grid area for member boxes */}
          <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full max-h-full items-start">
              
              {members.map((member) => {
                const memberMessages = messages.filter(m => m.sender_id === member.profile_id);
                const isCurrentUser = member.profile_id === user?.id;

                return (
                  <div 
                    key={member.id} 
                    className={`glow-card bg-bg-card rounded-2xl border transition duration-300 flex flex-col h-[28rem] max-h-[28rem] relative overflow-hidden ${
                      isCurrentUser ? 'border-brand-accent/50 shadow-md shadow-brand-primary-light/20' : 'border-border-light'
                    }`}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border-light bg-bg-deep/40 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.profile?.avatar_url} 
                          alt={member.profile?.username} 
                          className={`w-8 h-8 rounded-full border bg-bg-deep ${
                            isCurrentUser ? 'border-brand-accent' : 'border-brand-primary/40'
                          }`}
                        />
                        <div>
                          <h4 className="font-semibold text-xs text-txt-primary flex items-center gap-1.5">
                            {member.profile?.username}
                            {isCurrentUser && (
                              <span className="text-[9px] bg-brand-accent/20 px-1.5 py-0.5 rounded text-brand-accent font-bold">
                                You
                              </span>
                            )}
                          </h4>
                          <span className="text-[9px] text-txt-muted capitalize block">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Messages container inside member card */}
                    <div 
                      ref={(el) => {
                        scrollRefs.current[member.profile_id] = el;
                      }}
                      className="flex-grow overflow-y-auto p-4 space-y-3.5 scroll-smooth"
                    >
                      {memberMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
                          <MessageSquareOff className="w-8 h-8 text-txt-muted mb-2" />
                          <p className="text-[10px] text-txt-muted">No messages posted yet</p>
                        </div>
                      ) : (
                        memberMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex flex-col gap-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}
                          >
                            <div 
                              className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                                isCurrentUser 
                                  ? 'bg-brand-primary text-txt-primary rounded-tr-none' 
                                  : 'bg-bg-input text-txt-primary border border-border-light rounded-tl-none'
                              }`}
                            >
                              {msg.content}
                            </div>
                            <span className="text-[9px] text-txt-muted px-1.5">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Bottom messaging input */}
          <footer className="p-4 border-t border-border-light bg-bg-card/50 backdrop-blur-md shrink-0 relative z-20">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Post a message to your space box..."
                className="flex-grow px-5 py-3.5 rounded-xl bg-bg-input border border-border-light focus:border-border-focus focus:outline-none text-xs text-txt-primary placeholder:text-txt-muted/50 transition"
                id="message_input_field"
                required
              />
              <button
                type="submit"
                disabled={sendLoading || !newMessage.trim()}
                className="p-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-txt-primary font-semibold transition shrink-0 shadow-lg shadow-brand-primary-light/40 disabled:opacity-50 cursor-pointer"
                id="message_send_btn"
              >
                {sendLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </footer>

        </main>
      </div>
    </div>
  );
}
