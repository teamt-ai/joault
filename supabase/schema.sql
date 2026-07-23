-- Supabase Database Schema for Joault

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    username TEXT UNIQUE,
    email TEXT,
    avatar_url TEXT,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. Create spaces table (group chats)
CREATE TABLE IF NOT EXISTS public.spaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    auth_protocol TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create space_members table
CREATE TABLE IF NOT EXISTS public.space_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member'::text NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (space_id, profile_id)
);

-- 4. Create space_requests table (join requests)
CREATE TABLE IF NOT EXISTS public.space_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending'::text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (space_id, profile_id)
);

-- 5. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile." 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Spaces Policies
CREATE POLICY "Users can view spaces they are members of."
    ON public.spaces FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.space_members 
            WHERE space_members.space_id = spaces.id AND space_members.profile_id = auth.uid()
        ) OR owner_id = auth.uid()
    );

CREATE POLICY "Authenticated users can create spaces."
    ON public.spaces FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update/delete their spaces."
    ON public.spaces FOR ALL USING (auth.uid() = owner_id);

-- Space Members Policies
CREATE POLICY "Members can view space member list."
    ON public.space_members FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.space_members m
            WHERE m.space_id = space_members.space_id AND m.profile_id = auth.uid()
        ) OR EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_members.space_id AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can add members directly."
    ON public.space_members FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_members.space_id AND s.owner_id = auth.uid()
        )
    );

-- Space Requests Policies
CREATE POLICY "Users can view their own requests and owners can view requests for their spaces."
    ON public.space_requests FOR SELECT USING (
        auth.uid() = profile_id OR EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_requests.space_id AND s.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create join requests."
    ON public.space_requests FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Owners can update requests (approve/reject)."
    ON public.space_requests FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_requests.space_id AND s.owner_id = auth.uid()
        )
    );

-- Messages Policies
CREATE POLICY "Approved members can view messages."
    ON public.messages FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.space_members 
            WHERE space_members.space_id = messages.space_id AND space_members.profile_id = auth.uid()
        )
    );

CREATE POLICY "Approved members can insert messages."
    ON public.messages FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND EXISTS (
            SELECT 1 FROM public.space_members 
            WHERE space_members.space_id = messages.space_id AND space_members.profile_id = auth.uid()
        )
    );

-- Profile creation automation trigger when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatically add space owner as a member
CREATE OR REPLACE FUNCTION public.handle_new_space()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.space_members (space_id, profile_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_space_created
  AFTER INSERT ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_space();

-- Automatically create space member when request is approved
CREATE OR REPLACE FUNCTION public.handle_request_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    INSERT INTO public.space_members (space_id, profile_id, role)
    VALUES (NEW.space_id, NEW.profile_id, 'member')
    ON CONFLICT (space_id, profile_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_request_approved
  AFTER UPDATE ON public.space_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_request_approval();
