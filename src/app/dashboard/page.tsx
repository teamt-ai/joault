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
  Clock,
  Compass,
  Search,
  Key,
  Users,
  Layers
} from 'lucide-react';
import { dbService, Profile, Space, SpaceRequest } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SpaceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Invite Second Group State (Dual-Group Shared Chat Mode!)
  const [inviteGroupOpen, setInviteGroupOpen] = useState<string | null>(null);
  const [guestProtocol, setGuestProtocol] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Admin Request Status Updates
  const [adminLoadingId, setAdminLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const u = await dbService.getCurrentUser();
        if (!u) {
          router.push('/');
          return;
        }

        setUser(u);
        
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
      
      const mySpaces = await dbService.getMySpaces(user.id);
      setSpaces(mySpaces);
      
      if (typeof window !== 'undefined') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#000000', '#737373', '#ffffff']
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
      setJoinSuccessMsg('Access request successfully sent! Please wait for the Space Admin to approve it.');
      setAuthProtocol('');
    } catch (err: any) {
      setJoinError(err.message || 'Failed to send request.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleInviteSecondGroup = async (spaceId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!guestProtocol || !user) return;
    setInviteLoading(true);
    setInviteError(null);
    try {
      await dbService.inviteSecondGroupToSpace(spaceId, guestProtocol);
      setGuestProtocol('');
      setInviteGroupOpen(null);
      const mySpaces = await dbService.getMySpaces(user.id);
      setSpaces(mySpaces);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to link group.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    setAdminLoadingId(requestId);
    try {
      await dbService.updateRequestStatus(requestId, status);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSpaces = spaces.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.auth_protocol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black gap-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <span className="text-xs font-bold tracking-wider">Syncing Joault Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f1419] font-sans select-none">
      
      {/* THREADS MINIMALIST HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/95 border-b border-[#f0f0f1] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-black text-lg">
              J
            </div>
            <span className="font-outfit font-black text-2xl tracking-tight hidden sm:inline">Joault</span>
          </Link>

          <div className="flex-grow max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spaces, protocol codes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-zinc-200 bg-zinc-100 text-xs outline-none focus:bg-white focus:border-black transition"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200">
              <img src={user?.avatar_url} alt={user?.username} className="w-6 h-6 rounded-full border border-black bg-white" />
              <span className="text-xs font-bold">{user?.username}</span>
            </div>

            <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-black transition" title="Logout">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      </header>

      {/* DASHBOARD CONTENT GRID */}
      <main className="max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        
        {/* SIDEBAR ACTIONS */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 space-y-4">
            <h2 className="font-outfit font-bold text-base">Space Controls</h2>
            
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { setCreateOpen(true); setCreatedSpace(null); setCreateError(null); setJoinOpen(false); }}
                className="w-full py-3 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Space
              </button>
              
              <button
                onClick={() => { setJoinOpen(true); setJoinSuccessMsg(null); setJoinError(null); setCreateOpen(false); }}
                className="w-full py-3 rounded-full border border-zinc-200 text-xs font-bold hover:bg-zinc-100 transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Join via Auth Protocol
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-zinc-200 space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Metrics</h4>
            <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-2xl border border-zinc-200 text-xs">
              <span className="font-medium text-zinc-600">Active Spaces</span>
              <span className="font-bold">{spaces.length}</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-2xl border border-zinc-200 text-xs">
              <span className="font-medium text-zinc-600">Pending Requests</span>
              <span className="font-bold text-amber-600">{pendingRequests.length}</span>
            </div>
          </div>
        </section>

        {/* MAIN SPACES FEED */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Create Space Modal */}
          {createOpen && (
            <div className="bg-white rounded-3xl p-6 border border-black shadow-sm relative space-y-4">
              <button onClick={() => setCreateOpen(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-outfit font-bold text-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create a New Space
              </h2>

              {!createdSpace ? (
                <form onSubmit={handleCreateSpace} className="space-y-4">
                  {createError && <span className="text-xs text-red-600 block">{createError}</span>}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Space Name</label>
                    <input
                      type="text"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      placeholder="e.g. Design Collective"
                      className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-zinc-100 text-xs outline-none focus:bg-white focus:border-black"
                      required
                    />
                  </div>
                  <button type="submit" disabled={createLoading} className="px-6 py-3 rounded-full bg-black text-white text-xs font-bold">
                    {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Space & Protocol'}
                  </button>
                </form>
              ) : (
                <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs">
                  <span className="font-bold text-emerald-600 block">Space Created!</span>
                  <p className="text-zinc-500">Share this unique Auth Protocol code with members:</p>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-zinc-200 font-mono font-bold">
                    <span>{createdSpace.auth_protocol}</span>
                    <button onClick={() => copyToClipboard(createdSpace.auth_protocol, createdSpace.id)} className="text-zinc-400 hover:text-black">
                      {copiedId === createdSpace.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <Link href={`/space/${createdSpace.id}`} className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold inline-block">
                    Enter Space Room
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Join Space Modal */}
          {joinOpen && (
            <div className="bg-white rounded-3xl p-6 border border-black shadow-sm relative space-y-4">
              <button onClick={() => setJoinOpen(false)} className="absolute top-5 right-5 text-zinc-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-outfit font-bold text-lg flex items-center gap-2">
                <FolderLock className="w-4 h-4" /> Join Space via Auth Protocol
              </h2>

              <form onSubmit={handleJoinSpace} className="space-y-4">
                {joinError && <span className="text-xs text-red-600 block">{joinError}</span>}
                {joinSuccessMsg && <span className="text-xs text-emerald-600 font-bold block">{joinSuccessMsg}</span>}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Auth Protocol Code</label>
                  <input
                    type="text"
                    value={authProtocol}
                    onChange={(e) => setAuthProtocol(e.target.value)}
                    placeholder="e.g. SPACE-COFFEE-9922"
                    className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-zinc-100 text-xs font-mono outline-none focus:bg-white focus:border-black"
                    required
                  />
                </div>
                <button type="submit" disabled={joinLoading} className="px-6 py-3 rounded-full bg-black text-white text-xs font-bold">
                  {joinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request Access'}
                </button>
              </form>
            </div>
          )}

          {/* Pending Requests Admin Panel */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-amber-300 space-y-4">
              <h2 className="font-outfit font-bold text-base text-amber-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Pending Approvals ({pendingRequests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <img src={req.profile?.avatar_url} alt={req.profile?.username} className="w-7 h-7 rounded-full border border-black bg-white" />
                      <div>
                        <h4 className="font-bold">{req.profile?.username}</h4>
                        <span className="text-[10px] text-zinc-400 block font-mono">Space: {req.space?.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRequestStatus(req.id, 'approved')} className="flex-1 py-1.5 rounded-full bg-black text-white font-bold text-[11px]">
                        Approve
                      </button>
                      <button onClick={() => handleRequestStatus(req.id, 'rejected')} className="flex-1 py-1.5 rounded-full border border-zinc-300 font-bold text-[11px]">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Spaces Grid */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-outfit font-bold text-lg flex items-center gap-2">
                <Compass className="w-5 h-5" /> Your Spaces
              </h2>
              <span className="text-xs text-zinc-400 font-mono">{filteredSpaces.length} Active</span>
            </div>

            {filteredSpaces.length === 0 ? (
              <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-xs text-zinc-400">
                No active spaces found. Click "Create Space" to start.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSpaces.map((space) => {
                  const isOwner = space.owner_id === user?.id;
                  const hasGuestGroup = !!space.guest_space_name;

                  return (
                    <div key={space.id} className="p-5 rounded-2xl border border-zinc-200 hover:border-black transition flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-outfit font-bold text-base">{space.name}</h3>
                          <button onClick={() => copyToClipboard(space.auth_protocol, space.id)} className="text-zinc-400 hover:text-black">
                            {copiedId === space.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">{space.auth_protocol}</p>

                        {hasGuestGroup && (
                          <div className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                            Dual Group Shared: {space.guest_space_name}
                          </div>
                        )}
                      </div>

                      {/* Invite Second Group for Owner */}
                      {isOwner && !hasGuestGroup && (
                        <div>
                          {inviteGroupOpen === space.id ? (
                            <form onSubmit={(e) => handleInviteSecondGroup(space.id, e)} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                              {inviteError && <span className="text-[10px] text-red-600 block">{inviteError}</span>}
                              <input
                                type="text"
                                value={guestProtocol}
                                onChange={(e) => setGuestProtocol(e.target.value)}
                                placeholder="2nd Group Auth Protocol"
                                className="w-full px-3 py-1 rounded-full border text-xs font-mono"
                                required
                              />
                              <div className="flex gap-2">
                                <button type="submit" className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full">Link Group</button>
                                <button type="button" onClick={() => setInviteGroupOpen(null)} className="text-[10px] text-zinc-400">Cancel</button>
                              </div>
                            </form>
                          ) : (
                            <button onClick={() => setInviteGroupOpen(space.id)} className="text-[11px] font-bold text-zinc-500 hover:text-black">
                              + Invite Second Group to Space
                            </button>
                          )}
                        </div>
                      )}

                      <Link href={`/space/${space.id}`} className="w-full py-2 px-4 rounded-full bg-black text-white text-xs font-bold text-center">
                        Enter Chat Space &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}
