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
  Compass,
  Search,
  Key,
  Shield,
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
          router.push('/login');
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
          colors: ['#1a73e8', '#34a853', '#ffffff']
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
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center text-[#1a73e8] gap-4 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a73e8]" />
        <span className="text-sm font-bold tracking-wider">Syncing Joault Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#202124] font-sans select-none">
      
      {/* GOOGLE WORKSPACE NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#dadce0] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[#1a73e8] flex items-center justify-center text-white font-black text-xl shadow-md">
              J
            </div>
            <span className="font-outfit font-black text-2xl tracking-tight hidden sm:inline">Joault</span>
          </Link>

          <div className="flex-grow max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#5f6368]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spaces, protocol codes..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#dadce0] bg-[#f1f3f4] text-sm outline-none focus:bg-white focus:border-[#1a73e8]"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2.5 bg-[#f1f3f4] px-3.5 py-1.5 rounded-full border border-[#dadce0]">
              <img 
                src={user?.avatar_url} 
                alt={user?.username} 
                className="w-7 h-7 rounded-full bg-white border border-[#1a73e8]"
              />
              <span className="text-xs font-bold text-[#202124]">{user?.username}</span>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-[#5f6368] hover:text-[#1a73e8] transition cursor-pointer"
              title="Logout"
              id="dashboard_logout_btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
        
        {/* SIDEBAR ACTIONS */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[28px] p-6 border border-[#dadce0] shadow-sm space-y-4">
            <h2 className="font-outfit font-bold text-lg text-[#202124]">Space Controls</h2>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setCreateOpen(true);
                  setCreatedSpace(null);
                  setCreateError(null);
                  setJoinOpen(false);
                }}
                className="google-pill-btn w-full py-3.5 text-xs font-bold"
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
                className="google-pill-outlined w-full py-3.5 text-xs font-bold"
                id="action_join_space_btn"
              >
                <UserPlus className="w-4 h-4" /> Join via Auth Protocol
              </button>
            </div>
          </div>

          {/* WORKSPACE METRICS */}
          <div className="bg-white rounded-[28px] p-6 border border-[#dadce0] shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#5f6368] uppercase tracking-wider">Workspace Metrics</h4>
            
            <div className="flex justify-between items-center bg-[#f8f9fa] p-3.5 rounded-2xl border border-[#dadce0]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1a73e8]" />
                <span className="text-xs text-[#5f6368] font-medium">Active Spaces</span>
              </div>
              <span className="font-outfit font-bold text-sm text-[#202124]">{spaces.length}</span>
            </div>

            <div className="flex justify-between items-center bg-[#f8f9fa] p-3.5 rounded-2xl border border-[#dadce0]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#d97706]" />
                <span className="text-xs text-[#5f6368] font-medium">Pending Requests</span>
              </div>
              <span className="font-outfit font-bold text-sm text-[#d97706]">{pendingRequests.length}</span>
            </div>
          </div>
        </section>

        {/* SPACES GRID & MODALS */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Create Space Modal */}
          {createOpen && (
            <div className="bg-white rounded-[28px] p-6 border border-[#1a73e8]/40 shadow-lg relative space-y-4">
              <button onClick={() => setCreateOpen(false)} className="absolute top-5 right-5 text-[#5f6368] hover:text-[#202124]">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-outfit font-bold text-xl text-[#1a73e8] flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create a New Group Space
              </h2>

              {!createdSpace ? (
                <form onSubmit={handleCreateSpace} className="space-y-4">
                  {createError && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>{createError}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Space Name</label>
                    <input
                      type="text"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      placeholder="e.g. Design Collective, Engineering Squad"
                      className="w-full px-4 py-3 rounded-2xl border border-[#dadce0] bg-[#f1f3f4] text-sm outline-none focus:border-[#1a73e8]"
                      id="create_space_input"
                      required
                    />
                  </div>
                  <button type="submit" disabled={createLoading} className="google-pill-btn py-3 px-6 text-xs font-bold">
                    {createLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Space & Auth Protocol'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 bg-[#f8f9fa] p-5 rounded-2xl border border-[#dadce0]">
                  <div className="flex items-center gap-2 text-[#1a73e8] text-sm font-bold">
                    <Sparkles className="w-4 h-4 text-[#d97706]" /> Space Generated Successfully!
                  </div>
                  <p className="text-xs text-[#5f6368]">
                    Share this unique <strong>Auth Protocol</strong> code with members. Anyone inputting this code will view your space details and can request to join.
                  </p>
                  
                  <div className="flex items-center gap-2 bg-white p-3.5 rounded-xl border border-[#dadce0] justify-between">
                    <code className="text-sm font-bold font-mono text-[#1a73e8] tracking-wider">{createdSpace.auth_protocol}</code>
                    <button
                      onClick={() => copyToClipboard(createdSpace.auth_protocol, createdSpace.id)}
                      className="text-[#5f6368] hover:text-[#1a73e8] transition p-1 cursor-pointer"
                    >
                      {copiedId === createdSpace.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <Link href={`/space/${createdSpace.id}`} className="google-pill-btn py-2 px-5 text-xs font-bold">
                    Enter Space Room <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Join Space Modal */}
          {joinOpen && (
            <div className="bg-white rounded-[28px] p-6 border border-[#1a73e8]/40 shadow-lg relative space-y-4">
              <button onClick={() => setJoinOpen(false)} className="absolute top-5 right-5 text-[#5f6368] hover:text-[#202124]">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-outfit font-bold text-xl text-[#1a73e8] flex items-center gap-2">
                <FolderLock className="w-5 h-5" /> Join Space via Auth Protocol
              </h2>

              <form onSubmit={handleJoinSpace} className="space-y-4">
                {joinError && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>{joinError}</span>
                  </div>
                )}
                {joinSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs flex items-center gap-2 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{joinSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#5f6368] uppercase tracking-wider mb-2">Auth Protocol Code</label>
                  <input
                    type="text"
                    value={authProtocol}
                    onChange={(e) => setAuthProtocol(e.target.value)}
                    placeholder="e.g. SPACE-COFFEE-9922"
                    className="w-full px-4 py-3 rounded-2xl border border-[#dadce0] bg-[#f1f3f4] text-sm outline-none font-mono tracking-wider focus:border-[#1a73e8]"
                    id="join_space_input"
                    required
                  />
                </div>
                <button type="submit" disabled={joinLoading} className="google-pill-btn py-3 px-6 text-xs font-bold">
                  {joinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Inspect Space & Request Access'}
                </button>
              </form>
            </div>
          )}

          {/* Pending Requests Admin Panel */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-[28px] p-6 border border-[#d97706]/40 shadow-sm space-y-4">
              <h2 className="font-outfit font-bold text-lg text-[#d97706] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#d97706]" /> Pending Access Approvals ({pendingRequests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-[#f8f9fa] p-4 rounded-2xl border border-[#dadce0] flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img 
                        src={req.profile?.avatar_url} 
                        alt={req.profile?.username} 
                        className="w-9 h-9 rounded-full border border-[#1a73e8] bg-white shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-[#202124] truncate">{req.profile?.username}</h4>
                        <p className="text-xs text-[#5f6368] truncate mb-1">{req.profile?.email}</p>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#1a73e8] border border-[#dadce0] font-mono font-bold">
                          Space: {req.space?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full mt-2">
                      <button
                        onClick={() => handleRequestStatus(req.id, 'approved')}
                        disabled={adminLoadingId === req.id}
                        className="flex-1 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRequestStatus(req.id, 'rejected')}
                        disabled={adminLoadingId === req.id}
                        className="flex-1 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Spaces Grid */}
          <div className="bg-white rounded-[28px] p-6 border border-[#dadce0] shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="font-outfit font-bold text-xl text-[#202124] flex items-center gap-2.5">
                <Compass className="w-5.5 h-5.5 text-[#1a73e8]" /> Your Group Spaces
              </h2>
              <span className="text-xs text-[#5f6368] font-mono font-semibold">{filteredSpaces.length} Spaces Active</span>
            </div>

            {filteredSpaces.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#f8f9fa] rounded-2xl border border-dashed border-[#dadce0] flex flex-col items-center justify-center gap-3">
                <FolderLock className="w-10 h-10 text-[#9aa0a6]" />
                <h3 className="font-outfit font-bold text-base">No Spaces Found</h3>
                <p className="text-xs text-[#5f6368] max-w-sm">
                  Click "Create Space" to generate your first group space and Auth Protocol.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSpaces.map((space) => {
                  const isOwner = space.owner_id === user?.id;
                  const hasGuestGroup = !!space.guest_space_name;

                  return (
                    <div 
                      key={space.id} 
                      className="p-5 rounded-2xl bg-[#f8f9fa] hover:bg-white border border-[#dadce0] hover:border-[#1a73e8]/50 transition duration-200 flex flex-col justify-between gap-4 shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-outfit font-bold text-base text-[#202124]">
                              {space.name}
                            </h3>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                              isOwner 
                                ? 'bg-[#1a73e8]/10 text-[#1a73e8] border-[#1a73e8]/30' 
                                : 'bg-white text-[#5f6368] border-[#dadce0]'
                            }`}>
                              {isOwner ? 'Owner' : 'Member'}
                            </span>
                          </div>

                          <button
                            onClick={() => copyToClipboard(space.auth_protocol, space.id)}
                            className="text-[#5f6368] hover:text-[#1a73e8] transition p-1.5 rounded-lg bg-white border border-[#dadce0] cursor-pointer"
                            title="Copy Protocol Code"
                          >
                            {copiedId === space.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <p className="text-xs text-[#5f6368] font-mono flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-[#d97706]" /> {space.auth_protocol}
                        </p>

                        {/* Dual Group Tag */}
                        {hasGuestGroup && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 border border-purple-500/30 text-[10px] font-bold">
                            <Layers className="w-3 h-3 text-purple-600" /> Dual Group Shared Mode with: {space.guest_space_name}
                          </div>
                        )}
                      </div>

                      {/* Invite Second Group Button for Owner */}
                      {isOwner && !hasGuestGroup && (
                        <div>
                          {inviteGroupOpen === space.id ? (
                            <form onSubmit={(e) => handleInviteSecondGroup(space.id, e)} className="p-3 bg-white rounded-xl border border-[#1a73e8]/30 space-y-2 mt-2">
                              {inviteError && <span className="text-[10px] text-red-600 block">{inviteError}</span>}
                              <input
                                type="text"
                                value={guestProtocol}
                                onChange={(e) => setGuestProtocol(e.target.value)}
                                placeholder="Enter 2nd Group's Auth Protocol"
                                className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono"
                                required
                              />
                              <div className="flex gap-2">
                                <button type="submit" disabled={inviteLoading} className="google-pill-btn py-1 px-3 text-[10px]">
                                  {inviteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Link 2nd Group'}
                                </button>
                                <button type="button" onClick={() => setInviteGroupOpen(null)} className="text-[10px] text-[#5f6368]">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => setInviteGroupOpen(space.id)}
                              className="text-[11px] text-[#1a73e8] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Users className="w-3.5 h-3.5" /> Invite Another Group into this Chat Space
                            </button>
                          )}
                        </div>
                      )}
                      
                      <Link 
                        href={`/space/${space.id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#1a73e8] text-[#1a73e8] hover:text-white text-xs font-bold transition duration-200 flex items-center justify-between border border-[#dadce0] shadow-xs"
                      >
                        <span>Enter Chat Space</span>
                        <ArrowRight className="w-4 h-4" />
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
