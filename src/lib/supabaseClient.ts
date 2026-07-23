import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if we should run in demo/mock mode
export const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

if (isDemoMode) {
  console.warn('Supabase URL or Anon Key is missing. Running Joault in DEMO MODE with localStorage fallback.');
}

// Real Supabase client instance
export const supabase = !isDemoMode 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Helper interfaces
export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}

export interface Space {
  id: string;
  name: string;
  owner_id: string;
  auth_protocol: string;
  created_at: string;
}

export interface SpaceMember {
  id: string;
  space_id: string;
  profile_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  profile?: Profile;
}

export interface SpaceRequest {
  id: string;
  space_id: string;
  profile_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profile?: Profile;
  space?: Space;
}

export interface Message {
  id: string;
  space_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

// -------------------------------------------------------------
// LOCAL STORAGE MOCK DATABASE (For Demo Mode)
// -------------------------------------------------------------
const getLocalStorageData = <T>(key: string, defaultVal: T): T => {
  if (typeof window === 'undefined') return defaultVal;
  const val = localStorage.getItem(`joault_${key}`);
  return val ? JSON.parse(val) : defaultVal;
};

const setLocalStorageData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`joault_${key}`, JSON.stringify(data));
};

// Initialize Mock Data
const initMockData = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem('joault_initialized')) {
    const defaultProfiles: Profile[] = [
      { id: 'usr-owner', username: 'alex_creator', email: 'alex@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex' },
      { id: 'usr-member1', username: 'sarah_designer', email: 'sarah@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah' },
      { id: 'usr-member2', username: 'john_dev', email: 'john@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=john' },
    ];

    const defaultSpaces: Space[] = [
      { id: 'space-alpha', name: 'Design Space', owner_id: 'usr-owner', auth_protocol: 'SPACE-COFFEE-BREW-9922', created_at: new Date().toISOString() }
    ];

    const defaultMembers: SpaceMember[] = [
      { id: 'mem-1', space_id: 'space-alpha', profile_id: 'usr-owner', role: 'owner', joined_at: new Date().toISOString() },
      { id: 'mem-2', space_id: 'space-alpha', profile_id: 'usr-member1', role: 'member', joined_at: new Date().toISOString() }
    ];

    const defaultRequests: SpaceRequest[] = [
      { id: 'req-1', space_id: 'space-alpha', profile_id: 'usr-member2', status: 'pending', created_at: new Date().toISOString() }
    ];

    const defaultMessages: Message[] = [
      { id: 'msg-1', space_id: 'space-alpha', sender_id: 'usr-owner', content: 'Welcome to the Design Space! Under the new design layout, everyone gets their own box.', created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 'msg-2', space_id: 'space-alpha', sender_id: 'usr-member1', content: 'Yes, this is incredibly organized. Clean layout!', created_at: new Date(Date.now() - 1800000).toISOString() }
    ];

    setLocalStorageData('profiles', defaultProfiles);
    setLocalStorageData('spaces', defaultSpaces);
    setLocalStorageData('members', defaultMembers);
    setLocalStorageData('requests', defaultRequests);
    setLocalStorageData('messages', defaultMessages);
    localStorage.setItem('joault_initialized', 'true');
  }
};

// Call initialization
if (typeof window !== 'undefined') {
  initMockData();
}

// -------------------------------------------------------------
// UNIFIED DATA SERVICE (Abstracts Real Supabase vs Demo Mode)
// -------------------------------------------------------------
export const dbService = {
  // --- AUTH METHODS ---
  async getCurrentUser(): Promise<Profile | null> {
    if (isDemoMode) {
      const activeUser = getLocalStorageData<Profile | null>('active_user', null);
      return activeUser;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data || null;
  },

  async signUp(username: string, email: string): Promise<{ success: boolean; error?: string; profile?: Profile }> {
    if (isDemoMode) {
      const profiles = getLocalStorageData<Profile[]>('profiles', []);
      const existing = profiles.find(p => p.username === username || p.email === email);
      if (existing) {
        return { success: false, error: 'Username or email already exists in mock database.' };
      }
      
      const newProfile: Profile = {
        id: `usr-${Math.random().toString(36).substr(2, 9)}`,
        username,
        email,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`
      };
      
      profiles.push(newProfile);
      setLocalStorageData('profiles', profiles);
      setLocalStorageData('active_user', newProfile);
      return { success: true, profile: newProfile };
    }

    // Real sign up using Supabase Auth
    // Use dummy email password auth, we pass username in options metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'dummy-password-joault-123',
      options: {
        data: { username }
      }
    });

    if (error) return { success: false, error: error.message };
    
    // Auth trigger handle_new_user should automatically create the profile,
    // but we can query it or wait a split second
    if (data.user) {
      const newProfile: Profile = {
        id: data.user.id,
        username,
        email,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`
      };
      return { success: true, profile: newProfile };
    }
    return { success: false, error: 'Sign up failed.' };
  },

  async login(email: string): Promise<{ success: boolean; error?: string; profile?: Profile }> {
    if (isDemoMode) {
      const profiles = getLocalStorageData<Profile[]>('profiles', []);
      const user = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { success: false, error: 'User email not found in mock database.' };
      }
      setLocalStorageData('active_user', user);
      return { success: true, profile: user };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-joault-123'
    });

    if (error) return { success: false, error: error.message };
    
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      return { success: true, profile: profile || undefined };
    }
    return { success: false, error: 'Login failed.' };
  },

  async logout(): Promise<void> {
    if (isDemoMode) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('joault_active_user');
      }
      return;
    }
    await supabase.auth.signOut();
  },

  // --- SPACES ---
  async getMySpaces(userId: string): Promise<Space[]> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      
      // Filter spaces where user is a member
      const joinedSpaceIds = members
        .filter(m => m.profile_id === userId)
        .map(m => m.space_id);
      
      return spaces.filter(s => s.owner_id === userId || joinedSpaceIds.includes(s.id));
    }

    // Query spaces the user owns or belongs to
    const { data, error } = await supabase
      .from('spaces')
      .select(`
        *,
        space_members!inner(profile_id)
      `)
      .eq('space_members.profile_id', userId);

    if (error) {
      // Fallback query if the complex inner join fails RLS
      const { data: ownedSpaces } = await supabase.from('spaces').select('*').eq('owner_id', userId);
      const { data: memberRows } = await supabase.from('space_members').select('space_id').eq('profile_id', userId);
      const memberSpaceIds = (memberRows || []).map((m: any) => m.space_id);
      const { data: joinedSpaces } = await supabase.from('spaces').select('*').in('id', memberSpaceIds);
      
      const allSpaces = [...(ownedSpaces || []), ...(joinedSpaces || [])];
      // remove duplicates
      const uniqueSpaces = allSpaces.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      return uniqueSpaces;
    }

    return data || [];
  },

  async createSpace(name: string, ownerId: string): Promise<Space> {
    // Generate secure auth protocol: SPACE-XXXX-XXXX-XXXX
    const randSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const authProtocol = `SPACE-${randSegment()}-${randSegment()}-${randSegment()}`;

    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      
      const newSpace: Space = {
        id: `space-${Math.random().toString(36).substr(2, 9)}`,
        name,
        owner_id: ownerId,
        auth_protocol: authProtocol,
        created_at: new Date().toISOString()
      };

      spaces.push(newSpace);
      setLocalStorageData('spaces', spaces);

      // Add owner as member
      const newMember: SpaceMember = {
        id: `mem-${Math.random().toString(36).substr(2, 9)}`,
        space_id: newSpace.id,
        profile_id: ownerId,
        role: 'owner',
        joined_at: new Date().toISOString()
      };
      members.push(newMember);
      setLocalStorageData('members', members);

      return newSpace;
    }

    const { data, error } = await supabase
      .from('spaces')
      .insert({ name, owner_id: ownerId, auth_protocol: authProtocol })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async requestToJoinSpace(authProtocol: string, userId: string): Promise<SpaceRequest> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const space = spaces.find(s => s.auth_protocol.trim() === authProtocol.trim());
      if (!space) {
        throw new Error('Invalid Space Auth Protocol code. Space not found.');
      }

      // Check if already a member
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      const isMember = members.some(m => m.space_id === space.id && m.profile_id === userId);
      if (isMember) {
        throw new Error('You are already a member of this space.');
      }

      // Check if request already exists
      const requests = getLocalStorageData<SpaceRequest[]>('requests', []);
      const existingReq = requests.find(r => r.space_id === space.id && r.profile_id === userId);
      if (existingReq) {
        if (existingReq.status === 'pending') {
          throw new Error('You already have a pending request for this space.');
        } else if (existingReq.status === 'approved') {
          throw new Error('Your request was already approved.');
        }
      }

      const newRequest: SpaceRequest = {
        id: `req-${Math.random().toString(36).substr(2, 9)}`,
        space_id: space.id,
        profile_id: userId,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      requests.push(newRequest);
      setLocalStorageData('requests', requests);
      return newRequest;
    }

    // Real Supabase
    // 1. Find space by auth protocol
    const { data: space, error: spaceErr } = await supabase
      .from('spaces')
      .select('id')
      .eq('auth_protocol', authProtocol)
      .single();

    if (spaceErr || !space) {
      throw new Error('Invalid Space Auth Protocol code. Space not found.');
    }

    // 2. Insert into space_requests
    const { data: request, error: reqErr } = await supabase
      .from('space_requests')
      .insert({ space_id: space.id, profile_id: userId })
      .select()
      .single();

    if (reqErr) {
      if (reqErr.code === '23505') { // Unique constraint violation
        throw new Error('You already have a pending or processed request for this space.');
      }
      throw new Error(reqErr.message);
    }

    return request;
  },

  async getSpaceDetails(spaceId: string): Promise<Space> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const space = spaces.find(s => s.id === spaceId);
      if (!space) throw new Error('Space not found');
      return space;
    }

    const { data, error } = await supabase.from('spaces').select('*').eq('id', spaceId).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
    if (isDemoMode) {
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);
      
      return members
        .filter(m => m.space_id === spaceId)
        .map(m => ({
          ...m,
          profile: profiles.find(p => p.id === m.profile_id)
        }));
    }

    const { data, error } = await supabase
      .from('space_members')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('space_id', spaceId);

    if (error) throw new Error(error.message);
    return data || [];
  },

  // --- JOIN REQUESTS MANAGEMENT ---
  async getPendingRequestsForOwner(ownerId: string): Promise<SpaceRequest[]> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const requests = getLocalStorageData<SpaceRequest[]>('requests', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);

      const ownedSpaceIds = spaces.filter(s => s.owner_id === ownerId).map(s => s.id);
      
      return requests
        .filter(r => ownedSpaceIds.includes(r.space_id) && r.status === 'pending')
        .map(r => ({
          ...r,
          profile: profiles.find(p => p.id === r.profile_id),
          space: spaces.find(s => s.id === r.space_id)
        }));
    }

    // Real Supabase
    // Select requests where the associated space's owner_id is the user
    const { data, error } = await supabase
      .from('space_requests')
      .select(`
        *,
        profile:profiles(*),
        space:spaces(*)
      `)
      .eq('status', 'pending');

    if (error) throw new Error(error.message);
    
    // Filter rows on client side to ensure security check holds
    return (data || []).filter((req: any) => req.space?.owner_id === ownerId);
  },

  async updateRequestStatus(requestId: string, status: 'approved' | 'rejected'): Promise<void> {
    if (isDemoMode) {
      const requests = getLocalStorageData<SpaceRequest[]>('requests', []);
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      
      const reqIdx = requests.findIndex(r => r.id === requestId);
      if (reqIdx === -1) throw new Error('Request not found');
      
      requests[reqIdx].status = status;
      setLocalStorageData('requests', requests);

      // If approved, add to members
      if (status === 'approved') {
        const req = requests[reqIdx];
        const alreadyMember = members.some(m => m.space_id === req.space_id && m.profile_id === req.profile_id);
        if (!alreadyMember) {
          members.push({
            id: `mem-${Math.random().toString(36).substr(2, 9)}`,
            space_id: req.space_id,
            profile_id: req.profile_id,
            role: 'member',
            joined_at: new Date().toISOString()
          });
          setLocalStorageData('members', members);
        }
      }
      return;
    }

    const { error } = await supabase
      .from('space_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) throw new Error(error.message);
  },

  // --- MESSAGES ---
  async getMessages(spaceId: string): Promise<Message[]> {
    if (isDemoMode) {
      const messages = getLocalStorageData<Message[]>('messages', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);

      return messages
        .filter(m => m.space_id === spaceId)
        .map(m => ({
          ...m,
          profile: profiles.find(p => p.id === m.sender_id)
        }))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('space_id', spaceId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async sendMessage(spaceId: string, senderId: string, content: string): Promise<Message> {
    if (isDemoMode) {
      const messages = getLocalStorageData<Message[]>('messages', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);

      const newMsg: Message = {
        id: `msg-${Math.random().toString(36).substr(2, 9)}`,
        space_id: spaceId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString()
      };

      messages.push(newMsg);
      setLocalStorageData('messages', messages);
      
      newMsg.profile = profiles.find(p => p.id === senderId);

      // Trigger a synthetic custom event for realtime simulation in browser tabs
      if (typeof window !== 'undefined') {
        const event = new CustomEvent(`joault_new_message_${spaceId}`, { detail: newMsg });
        window.dispatchEvent(event);
      }

      return newMsg;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({ space_id: spaceId, sender_id: senderId, content })
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Realtime subscription wrapper
  subscribeToMessages(spaceId: string, callback: (message: Message) => void): () => void {
    if (isDemoMode) {
      const handleCustomEvent = (e: Event) => {
        const customEvent = e as CustomEvent<Message>;
        callback(customEvent.detail);
      };
      
      if (typeof window !== 'undefined') {
        window.addEventListener(`joault_new_message_${spaceId}`, handleCustomEvent);
      }
      
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener(`joault_new_message_${spaceId}`, handleCustomEvent);
        }
      };
    }

    // Supabase Realtime subscription
    const channel = supabase
      .channel(`space_messages_${spaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `space_id=eq.${spaceId}`
        },
        async (payload: any) => {
          // Fetch the profile for the sender
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single();
          
          const fullMessage: Message = {
            id: payload.new.id,
            space_id: payload.new.space_id,
            sender_id: payload.new.sender_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            profile: profile || undefined
          };
          callback(fullMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
