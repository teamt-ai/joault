import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mnyqfavcpuoxekfgzcvn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueXFmYXZjcHVveGVrZmd6Y3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MTgyNjQsImV4cCI6MjEwMDM5NDI2NH0.ekJws3ajF9Sf9GqgWD7d1rLp6vumUo1GX5rfqFXzMqQ';

export const isDemoMode = false;

// Real Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


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
  guest_space_id?: string | null; // For Dual-Group Mode
  guest_space_name?: string | null;
  is_anonymous_mode?: boolean;     // Dark Mode Anonymous Toggle
}

export interface SpaceMember {
  id: string;
  space_id: string;
  profile_id: string;
  role: 'owner' | 'member';
  joined_at: string;
  group_name?: string;             // Member's home group name
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

export interface Comment {
  id: string;
  message_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  group_tag?: string;             // 'fellow' or 'opponent'
  profile?: Profile;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  sender_id: string;
  emoji: string;
  created_at: string;
}

export interface Message {
  id: string;
  space_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  group_name?: string;
  profile?: Profile;
  comments?: Comment[];
  reactions?: MessageReaction[];
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
  
  if (!localStorage.getItem('joault_initialized_v2')) {
    const defaultProfiles: Profile[] = [
      { id: 'usr-owner', username: 'Alex (Creator)', email: 'alex@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex' },
      { id: 'usr-member1', username: 'Sarah (Designer)', email: 'sarah@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah' },
      { id: 'usr-member2', username: 'Marcus (Dev)', email: 'marcus@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=marcus' },
      { id: 'usr-guest1', username: 'Rival Group Lead', email: 'rival@example.com', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=rival' }
    ];

    const defaultSpaces: Space[] = [
      { 
        id: 'space-alpha', 
        name: 'Design Collective', 
        owner_id: 'usr-owner', 
        auth_protocol: 'SPACE-COFFEE-9922', 
        created_at: new Date().toISOString(),
        guest_space_id: 'space-beta',
        guest_space_name: 'Engineering Opponents',
        is_anonymous_mode: false
      },
      {
        id: 'space-beta',
        name: 'Engineering Opponents',
        owner_id: 'usr-guest1',
        auth_protocol: 'SPACE-TECH-4411',
        created_at: new Date().toISOString(),
        is_anonymous_mode: false
      }
    ];

    const defaultMembers: SpaceMember[] = [
      { id: 'mem-1', space_id: 'space-alpha', profile_id: 'usr-owner', role: 'owner', joined_at: new Date().toISOString(), group_name: 'Design Collective' },
      { id: 'mem-2', space_id: 'space-alpha', profile_id: 'usr-member1', role: 'member', joined_at: new Date().toISOString(), group_name: 'Design Collective' },
      { id: 'mem-3', space_id: 'space-alpha', profile_id: 'usr-guest1', role: 'member', joined_at: new Date().toISOString(), group_name: 'Engineering Opponents' }
    ];

    const defaultRequests: SpaceRequest[] = [
      { id: 'req-1', space_id: 'space-alpha', profile_id: 'usr-member2', status: 'pending', created_at: new Date().toISOString() }
    ];

    const defaultMessages: Message[] = [
      { 
        id: 'msg-1', 
        space_id: 'space-alpha', 
        sender_id: 'usr-owner', 
        content: 'Welcome to Joault! Swipe left to comment, swipe right to view comments, or double tap to launch Joault gift emojis!', 

        created_at: new Date(Date.now() - 3600000).toISOString(),
        group_name: 'Design Collective'
      },
      { 
        id: 'msg-2', 
        space_id: 'space-alpha', 
        sender_id: 'usr-guest1', 
        content: 'Our rival group is in this same space! Check out the split-rectangle view in Dual Group Mode.', 
        created_at: new Date(Date.now() - 1800000).toISOString(),
        group_name: 'Engineering Opponents'
      }
    ];

    const defaultComments: Comment[] = [
      { id: 'cmt-1', message_id: 'msg-1', sender_id: 'usr-member1', content: 'This rectangle feed layout feels super smooth!', created_at: new Date(Date.now() - 3000000).toISOString(), group_tag: 'fellow' },
      { id: 'cmt-2', message_id: 'msg-2', sender_id: 'usr-owner', content: 'Challenge accepted! Let the collaboration begin.', created_at: new Date(Date.now() - 1200000).toISOString(), group_tag: 'opponent' }
    ];

    const defaultReactions: MessageReaction[] = [
      { id: 'react-1', message_id: 'msg-1', sender_id: 'usr-member1', emoji: '🔥', created_at: new Date().toISOString() },
      { id: 'react-2', message_id: 'msg-1', sender_id: 'usr-owner', emoji: '🚀', created_at: new Date().toISOString() }
    ];

    setLocalStorageData('profiles', defaultProfiles);
    setLocalStorageData('spaces', defaultSpaces);
    setLocalStorageData('members', defaultMembers);
    setLocalStorageData('requests', defaultRequests);
    setLocalStorageData('messages', defaultMessages);
    setLocalStorageData('comments', defaultComments);
    setLocalStorageData('reactions', defaultReactions);
    localStorage.setItem('joault_initialized_v2', 'true');
  }
};

if (typeof window !== 'undefined') {
  initMockData();
}

// -------------------------------------------------------------
// UNIFIED DATA SERVICE (Abstracts Real Supabase vs Demo Mode)
// -------------------------------------------------------------
export function extractProfileFromSession(session: any): Profile {
  if (!session || !session.user) {
    return { id: '', username: 'User', email: '', avatar_url: '' };
  }
  const meta = session.user.user_metadata || {};
  const username = meta.full_name || meta.name || meta.username || session.user.email?.split('@')[0] || 'User';
  const avatar = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.email}`;

  try {
    supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email || '',
      username: username.toLowerCase().replace(/\s+/g, '_'),
      updated_at: new Date().toISOString()
    });
  } catch (e) {}


  return {
    id: session.user.id,
    username: username,
    email: session.user.email || '',
    avatar_url: avatar
  };
}

export const dbService = {
  // --- AUTH METHODS ---
  async getCurrentUser(): Promise<Profile | null> {
    if (!supabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        let profileData: Profile | null = null;
        try {
          const res = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          profileData = res.data;
        } catch (e) {}

        return profileData || extractProfileFromSession(session);
      }
    } catch (e) {
      console.warn("Session check notice:", e);
    }
    return null;
  },


  async signUp(username: string, email: string, password?: string): Promise<{ success: boolean; error?: string; profile?: Profile }> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim() || cleanEmail.split('@')[0];

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
        data: { username: cleanUsername }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Sign up failed.' };
    }

    const newProfile: Profile = {
      id: data.user.id,
      username: cleanUsername,
      email: cleanEmail,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`
    };

    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: cleanEmail,
        username: cleanUsername.toLowerCase().replace(/\s+/g, '_'),
        updated_at: new Date().toISOString()
      });
    } catch (e) {}

    return { success: true, profile: newProfile };
  },


  async login(email: string, password?: string): Promise<{ success: boolean; error?: string; profile?: Profile }> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Invalid login credentials.' };
    }

    let profile: Profile | null = null;
    try {
      const res = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      profile = res.data;
    } catch (e) {}

    const activeProf: Profile = profile || {
      id: data.user.id,
      username: cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`
    };

    return { success: true, profile: activeProf };
  },



  async loginWithGoogle(): Promise<{ success: boolean; error?: string; profile?: Profile }> {

    if (!isDemoMode && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
          }
        });
        if (!error) {
          return { success: true };
        }
      } catch (err: any) {
        console.warn("Google OAuth notice:", err);
      }
    }
    const googleUser: Profile = {
      id: `usr-google-${Date.now()}`,
      username: 'Google User',
      email: 'user.google@gmail.com',
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=google'
    };
    setLocalStorageData('active_user', googleUser);
    return { success: true, profile: googleUser };
  },



  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('joault_active_user');
    }
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
  },


  // --- SPACES ---
  async getMySpaces(userId: string): Promise<Space[]> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      return spaces;
    }

    const { data } = await supabase.from('spaces').select('*');
    return data || [];
  },

  async createSpace(name: string, ownerId: string, customProtocol?: string): Promise<Space> {
    const randSegment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const authProtocol = customProtocol?.trim() || `SPACE-${randSegment()}-${randSegment()}`;

    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      
      const newSpace: Space = {
        id: `space-${Math.random().toString(36).substr(2, 9)}`,
        name,
        owner_id: ownerId,
        auth_protocol: authProtocol,
        created_at: new Date().toISOString(),
        is_anonymous_mode: false
      };

      spaces.push(newSpace);
      setLocalStorageData('spaces', spaces);

      members.push({
        id: `mem-${Math.random().toString(36).substr(2, 9)}`,
        space_id: newSpace.id,
        profile_id: ownerId,
        role: 'owner',
        joined_at: new Date().toISOString(),
        group_name: name
      });
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


  async inviteSecondGroupToSpace(spaceId: string, guestSpaceAuthProtocol: string): Promise<Space> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const currentSpace = spaces.find(s => s.id === spaceId);
      const guestSpace = spaces.find(s => s.auth_protocol.trim() === guestSpaceAuthProtocol.trim());

      if (!currentSpace) throw new Error('Current Space not found.');
      if (!guestSpace) throw new Error('Invalid Auth Protocol for the second group.');
      if (currentSpace.id === guestSpace.id) throw new Error('Cannot invite your own group into the same space.');

      currentSpace.guest_space_id = guestSpace.id;
      currentSpace.guest_space_name = guestSpace.name;

      setLocalStorageData('spaces', spaces);
      return currentSpace;
    }

    const { data: guestSpace } = await supabase.from('spaces').select('*').eq('auth_protocol', guestSpaceAuthProtocol).single();
    if (!guestSpace) throw new Error('Guest Space Auth Protocol not found.');

    const { data, error } = await supabase.from('spaces').update({
      guest_space_id: guestSpace.id,
      guest_space_name: guestSpace.name
    }).eq('id', spaceId).select().single();

    if (error) throw new Error(error.message);
    return data;
  },

  async toggleSpaceAnonymousMode(spaceId: string, isAnonymous: boolean): Promise<boolean> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const space = spaces.find(s => s.id === spaceId);
      if (space) {
        space.is_anonymous_mode = isAnonymous;
        setLocalStorageData('spaces', spaces);
      }
      return isAnonymous;
    }

    await supabase.from('spaces').update({ is_anonymous_mode: isAnonymous }).eq('id', spaceId);
    return isAnonymous;
  },

  async requestToJoinSpace(authProtocol: string, userId: string): Promise<SpaceRequest> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      const space = spaces.find(s => s.auth_protocol.trim() === authProtocol.trim());
      if (!space) {
        throw new Error('Invalid Space Auth Protocol code. Space not found.');
      }

      const requests = getLocalStorageData<SpaceRequest[]>('requests', []);
      const newRequest: SpaceRequest = {
        id: `req-${Math.random().toString(36).substr(2, 9)}`,
        space_id: space.id,
        profile_id: userId,
        status: 'pending',
        created_at: new Date().toISOString(),
        space
      };
      
      requests.push(newRequest);
      setLocalStorageData('requests', requests);
      return newRequest;
    }

    const { data: space } = await supabase.from('spaces').select('*').eq('auth_protocol', authProtocol).single();
    if (!space) throw new Error('Invalid Space Auth Protocol code.');

    const { data, error } = await supabase.from('space_requests').insert({ space_id: space.id, profile_id: userId }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getSpaceById(spaceId: string): Promise<Space | null> {
    if (isDemoMode) {
      const spaces = getLocalStorageData<Space[]>('spaces', []);
      return spaces.find(s => s.id === spaceId) || null;
    }
    const { data } = await supabase.from('spaces').select('*').eq('id', spaceId).single();
    return data || null;
  },

  async getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
    if (isDemoMode) {
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);
      return members
        .filter(m => m.space_id === spaceId)
        .map(m => ({ ...m, profile: profiles.find(p => p.id === m.profile_id) }));
    }
    const { data } = await supabase.from('space_members').select('*, profile:profiles(*)').eq('space_id', spaceId);
    return data || [];
  },

  async getPendingRequestsForOwner(ownerId: string): Promise<SpaceRequest[]> {
    if (isDemoMode) {
      const requests = getLocalStorageData<SpaceRequest[]>('requests', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);
      const spaces = getLocalStorageData<Space[]>('spaces', []);

      return requests
        .filter(r => r.status === 'pending')
        .map(r => ({
          ...r,
          profile: profiles.find(p => p.id === r.profile_id),
          space: spaces.find(s => s.id === r.space_id)
        }));
    }
    const { data } = await supabase.from('space_requests').select('*, profile:profiles(*), space:spaces(*)').eq('status', 'pending');
    return data || [];
  },

  async updateRequestStatus(requestId: string, status: 'approved' | 'rejected'): Promise<void> {
    if (isDemoMode) {
      const requests = getLocalStorageData<SpaceRequest[]>('requests', []);
      const members = getLocalStorageData<SpaceMember[]>('members', []);
      const req = requests.find(r => r.id === requestId);
      if (req) {
        req.status = status;
        setLocalStorageData('requests', requests);

        if (status === 'approved') {
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
    await supabase.from('space_requests').update({ status }).eq('id', requestId);
  },

  // --- MESSAGES, COMMENTS & REACTIONS ---
  async getMessages(spaceId: string): Promise<Message[]> {
    if (isDemoMode) {
      const messages = getLocalStorageData<Message[]>('messages', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);
      const comments = getLocalStorageData<Comment[]>('comments', []);
      const reactions = getLocalStorageData<MessageReaction[]>('reactions', []);

      return messages
        .filter(m => m.space_id === spaceId)
        .map(m => ({
          ...m,
          profile: profiles.find(p => p.id === m.sender_id),
          comments: comments.filter(c => c.message_id === m.id).map(c => ({
            ...c,
            profile: profiles.find(p => p.id === c.sender_id)
          })),
          reactions: reactions.filter(r => r.message_id === m.id)
        }))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    const { data } = await supabase.from('messages').select('*, profile:profiles(*)').eq('space_id', spaceId).order('created_at', { ascending: true });
    return data || [];
  },

  async sendMessage(spaceId: string, senderId: string, content: string, groupName?: string): Promise<Message> {
    if (isDemoMode) {
      const messages = getLocalStorageData<Message[]>('messages', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);

      const newMsg: Message = {
        id: `msg-${Math.random().toString(36).substr(2, 9)}`,
        space_id: spaceId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString(),
        group_name: groupName || 'Main Space',
        comments: [],
        reactions: []
      };

      messages.push(newMsg);
      setLocalStorageData('messages', messages);
      newMsg.profile = profiles.find(p => p.id === senderId);
      return newMsg;
    }

    const { data, error } = await supabase.from('messages').insert({ space_id: spaceId, sender_id: senderId, content }).select('*, profile:profiles(*)').single();
    if (error) throw new Error(error.message);
    return data;
  },

  async addComment(messageId: string, senderId: string, content: string, groupTag: 'fellow' | 'opponent' = 'fellow'): Promise<Comment> {
    if (isDemoMode) {
      const comments = getLocalStorageData<Comment[]>('comments', []);
      const profiles = getLocalStorageData<Profile[]>('profiles', []);

      const newCmt: Comment = {
        id: `cmt-${Math.random().toString(36).substr(2, 9)}`,
        message_id: messageId,
        sender_id: senderId,
        content,
        created_at: new Date().toISOString(),
        group_tag: groupTag,
        profile: profiles.find(p => p.id === senderId)
      };

      comments.push(newCmt);
      setLocalStorageData('comments', comments);
      return newCmt;
    }

    const { data, error } = await supabase.from('comments').insert({ message_id: messageId, sender_id: senderId, content }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async addReaction(messageId: string, senderId: string, emoji: string): Promise<MessageReaction> {
    if (isDemoMode) {
      const reactions = getLocalStorageData<MessageReaction[]>('reactions', []);
      const newReact: MessageReaction = {
        id: `react-${Math.random().toString(36).substr(2, 9)}`,
        message_id: messageId,
        sender_id: senderId,
        emoji,
        created_at: new Date().toISOString()
      };

      reactions.push(newReact);
      setLocalStorageData('reactions', reactions);

      // Trigger Joault Gift Floating Emoji Event across open space views
      if (typeof window !== 'undefined') {
        const event = new CustomEvent(`joault_gift_${messageId}`, { detail: { emoji } });
        window.dispatchEvent(event);
      }


      return newReact;
    }

    const { data } = await supabase.from('reactions').insert({ message_id: messageId, sender_id: senderId, emoji }).select().single();
    return data;
  }
};
