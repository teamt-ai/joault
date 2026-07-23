'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  UserPlus, 
  LogOut, 
  FolderLock, 
  ArrowRight, 
  Check, 
  X, 
  Copy, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import { dbService, Profile, Space, SpaceRequest } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SpaceRequest[]>([]);
  
  // Create Space State
  const [createOpen, setCreateOpen] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [createdSpace, setCreatedSpace] = useState<Space | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Join Space State
  const [joinOpen, setJoinOpen] = useState(false);
  const [authProtocol, setAuthProtocol] = useState('');
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Admin Request Status Updates
  const [adminLoadingId, setAdminLoadingId] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          router.push('/login');
          return;
        }
        setUser(u);
        
        // Fetch spaces and requests in parallel
        const [mySpaces, myPendingRequests] = await Promise.all([
          dbService.getMySpaces(u.id),
          dbService.getPendingRequestsForOwner(u.id)
        ]);

        setSpaces(mySpaces);
        setPendingRequests(myPendingRequests);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [router]);

  // Periodic refresh for join requests (essential for real-time vibe in demo mode)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const myPendingRequests = await dbService.getPendingRequestsForOwner(user.id);
        setPendingRequests(myPendingRequests);
        const mySpaces = await dbService.getMySpaces(user.id);
        setSpaces(mySpaces);
      } catch (err) {
        console.error('Error refreshing requests:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await dbService.logout();
    router.push('/');
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceName || !user) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const space = await dbService.createSpace(spaceName, user.id);
      setCreatedSpace(space);
      setSpaceName('');
      
      // Refresh spaces list
      const mySpaces = await dbService.getMySpaces(user.id);
      setSpaces(mySpaces);
      
      // Trigger canvas-confetti if loaded
      if (typeof window !== 'undefined') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b4f30', '#dca385', '#2b1d19']
        });
      }
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create space.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authProtocol || !user) return;
    setJoinLoading(true);
    setJoinError(null);
    setJoinSuccessMsg(null);
    try {
      await dbService.requestToJoinSpace(authProtocol, user.id);
      setJoinSuccessMsg('Access request successfully sent! Please wait for the Space creator to approve it.');
      setAuthProtocol('');
    } catch (err: any) {
      setJoinError(err.message || 'Failed to send request.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    setAdminLoadingId(requestId);
    try {
      await dbService.updateRequestStatus(requestId, status);
      // Refresh lists
      if (user) {
        const [mySpaces, myPendingRequests] = await Promise.all([
          dbService.getMySpaces(user.id),
          dbService.getPendingRequestsForOwner(user.id)
        ]);
        setSpaces(mySpaces);
        setPendingRequests(myPendingRequests);
      }
    } catch (err) {
      console.error('Failed to update request:', err);
    } finally {
      setAdminLoadingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center text-txt-muted gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
        <span className="text-sm font-semibold tracking-wider">Syncing Joault Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-bg-deep">
      {/* Ambient background glows */}
      <div className="ambient-bg top-[-300px] left-[-200px]" />
      <div className="ambient-bg bottom-[-300px] right-[-200px] opacity-50" />

      {/* Navigation */}
      <header className="relative z-10 w-full border-b border-border-light bg-bg-card/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span className="font-outfit font-bold text-base text-bg-deep">J</span>
            </div>
            <span className="font-outfit font-semibold text-xl tracking-wider text-gradient">Joault</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <img 
                src={user?.avatar_url} 
                alt={user?.username} 
                className="w-8 h-8 rounded-full border border-brand-primary bg-bg-deep"
              />
              <span className="text-sm font-medium text-txt-primary">{user?.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-txt-muted hover:text-brand-accent transition cursor-pointer"
              title="Logout"
              id="dashboard_logout_btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Actions */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="glow-card bg-bg-card rounded-2xl p-6">
            <h2 className="font-outfit font-semibold text-lg mb-4 text-gradient">Quick Actions</h2>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setCreateOpen(true);
                  setCreatedSpace(null);
                  setCreateError(null);
                  setJoinOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-txt-primary font-semibold transition text-sm flex items-center justify-center gap-2 shadow shadow-brand-primary-light/35 cursor-pointer"
                id="action_create_space_btn"
              >
                <Plus className="w-4 h-4" /> Create Space
              </button>
              
              <button
                onClick={() => {
                  setJoinOpen(true);
                  setJoinSuccessMsg(null);
                  setJoinError(null);
                  setCreateOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-bg-deep hover:bg-bg-hover text-brand-accent font-semibold transition text-sm flex items-center justify-center gap-2 border border-border-light cursor-pointer"
                id="action_join_space_btn"
              >
                <UserPlus className="w-4 h-4" /> Join Space
              </button>
            </div>
          </div>

          {/* User info card for mobile */}
          <div className="glow-card bg-bg-card rounded-2xl p-6 flex md:hidden items-center gap-4">
            <img 
              src={user?.avatar_url} 
              alt={user?.username} 
              className="w-12 h-12 rounded-full border border-brand-primary bg-bg-deep"
            />
            <div>
              <h4 className="font-semibold text-txt-primary">{user?.username}</h4>
              <p className="text-xs text-txt-muted">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Spaces and Requests Lists */}
        <section className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Modals/Form Panel - Dynamic Placement */}
          {createOpen && (
            <div className="glow-card bg-bg-card rounded-2xl p-6 border-brand-primary/40 relative">
              <button 
                onClick={() => setCreateOpen(false)} 
                className="absolute top-4 right-4 text-txt-muted hover:text-txt-primary"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-outfit font-semibold text-xl mb-4 text-brand-accent flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create a New Space
              </h2>

              {!createdSpace ? (
                <form onSubmit={handleCreateSpace} className="space-y-4">
                  {createError && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{createError}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Space Name</label>
                    <input
                      type="text"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      placeholder="e.g. Creative Squad, Strategy Room"
                      className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-light focus:border-border-focus focus:outline-none text-sm text-txt-primary placeholder:text-txt-muted/50 transition"
                      id="create_space_input"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="py-2.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-txt-primary text-sm font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                    id="create_space_submit_btn"
                  >
                    {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Space'}
                  </button>
                </form>
              ) : (
                <div className="space-y-5 bg-bg-deep/40 p-5 rounded-xl border border-border-light">
                  <div className="flex items-center gap-2 text-brand-accent text-sm font-semibold">
                    <Sparkles className="w-4 h-4" /> Space Created Successfully!
                  </div>
                  <p className="text-xs text-txt-muted leading-relaxed">
                    Share this unique <strong>Auth Protocol</strong> code with members. They will require this code to submit an access request. You must approve their request before they can join.
                  </p>
                  
                  <div className="flex items-center gap-2 bg-bg-input p-3.5 rounded-lg border border-border-light justify-between">
                    <code className="text-sm font-bold font-mono text-txt-primary tracking-wider">{createdSpace.auth_protocol}</code>
                    <button
                      onClick={() => copyToClipboard(createdSpace.auth_protocol)}
                      className="text-txt-muted hover:text-brand-accent transition p-1"
                      title="Copy Code"
                      id="copy_protocol_btn"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCreateOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-txt-muted hover:text-txt-primary transition"
                    >
                      Close Panel
                    </button>
                    <Link
                      href={`/space/${createdSpace.id}`}
                      className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-txt-primary text-xs font-semibold transition flex items-center gap-1"
                    >
                      Enter Space <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {joinOpen && (
            <div className="glow-card bg-bg-card rounded-2xl p-6 border-brand-primary/40 relative">
              <button 
                onClick={() => setJoinOpen(false)} 
                className="absolute top-4 right-4 text-txt-muted hover:text-txt-primary"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-outfit font-semibold text-xl mb-4 text-brand-accent flex items-center gap-2">
                <FolderLock className="w-5 h-5" /> Join a Space
              </h2>

              <form onSubmit={handleJoinSpace} className="space-y-4">
                {joinError && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{joinError}</span>
                  </div>
                )}
                {joinSuccessMsg && (
                  <div className="p-3 rounded-lg bg-brand-primary-light/35 border border-brand-primary/30 text-brand-accent text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-brand-accent" />
                    <span>{joinSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Space Auth Protocol Code</label>
                  <input
                    type="text"
                    value={authProtocol}
                    onChange={(e) => setAuthProtocol(e.target.value)}
                    placeholder="e.g. SPACE-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 rounded-xl bg-bg-input border border-border-light focus:border-border-focus focus:outline-none text-sm text-txt-primary placeholder:text-txt-muted/50 transition font-mono tracking-wider"
                    id="join_space_input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={joinLoading}
                  className="py-2.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-txt-primary text-sm font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                  id="join_space_submit_btn"
                >
                  {joinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Access'}
                </button>
              </form>
            </div>
          )}

          {/* Pending Requests (Owner's Admin Panel) */}
          {pendingRequests.length > 0 && (
            <div className="glow-card bg-bg-card rounded-2xl p-6 border-brand-primary/30 animate-pulse-gentle">
              <h2 className="font-outfit font-semibold text-lg mb-4 text-brand-accent flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-accent" /> Pending Access Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-bg-deep/50 p-4 rounded-xl border border-border-light flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img 
                        src={req.profile?.avatar_url} 
                        alt={req.profile?.username} 
                        className="w-10 h-10 rounded-full border border-brand-primary/50 bg-bg-deep shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-semibold text-sm text-txt-primary truncate">{req.profile?.username}</h4>
                        <p className="text-xs text-txt-muted truncate mb-1">{req.profile?.email}</p>
                        <span className="text-[10px] bg-brand-primary-light/50 px-2 py-0.5 rounded text-brand-accent border border-brand-primary/30 font-medium">
                          Space: {req.space?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full mt-2">
                      <button
                        onClick={() => handleRequestStatus(req.id, 'approved')}
                        disabled={adminLoadingId === req.id}
                        className="flex-1 py-2 rounded-lg bg-green-950/60 hover:bg-green-900/60 text-green-300 border border-green-800/40 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {adminLoadingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestStatus(req.id, 'rejected')}
                        disabled={adminLoadingId === req.id}
                        className="flex-1 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joined Spaces List */}
          <div className="glow-card bg-bg-card rounded-2xl p-6">
            <h2 className="font-outfit font-semibold text-xl mb-6 text-txt-primary flex items-center gap-2">
              <Compass className="w-5.5 h-5.5 text-brand-accent" /> Your Active Spaces
            </h2>

            {spaces.length === 0 ? (
              <div className="text-center py-16 px-4 bg-bg-deep/40 rounded-xl border border-dashed border-border-light flex flex-col items-center justify-center gap-4">
                <FolderLock className="w-12 h-12 text-txt-muted/30" />
                <div>
                  <h3 className="font-outfit font-semibold text-lg text-txt-primary mb-1">No Active Spaces Found</h3>
                  <p className="text-sm text-txt-muted max-w-sm">
                    You haven't created or joined any spaces yet. Use the actions on the left to start a space or request entry.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spaces.map((space) => (
                  <Link 
                    key={space.id} 
                    href={`/space/${space.id}`}
                    className="p-5 rounded-xl bg-bg-deep/50 hover:bg-bg-hover border border-border-light hover:border-brand-accent/40 transition duration-300 group flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-outfit font-semibold text-lg text-txt-primary group-hover:text-brand-accent transition mb-1">{space.name}</h3>
                      <div className="flex gap-3 text-xs text-txt-muted">
                        <span>Role: {space.owner_id === user?.id ? 'Owner' : 'Member'}</span>
                        <span>&bull;</span>
                        <span>Code: <code className="font-mono">{space.auth_protocol.substring(0, 11)}...</code></span>
                      </div>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-bg-input flex items-center justify-center group-hover:bg-brand-primary group-hover:text-txt-primary transition duration-300">
                      <ArrowRight className="w-4 h-4 text-txt-muted group-hover:text-txt-primary transition" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}
