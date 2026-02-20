import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  goal: string | null;
  timezone: string;
  focus_area: string;
  tier: string;
  xp: number;
  streak: number;
  notifications_on: boolean;
  silent_mode: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, displayName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id'>>) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 = no rows — profile hasn't been created yet
      if (error.code !== 'PGRST116') {
        console.warn('fetchProfile error:', error.message);
      }
      return null;
    }
    return data as Profile;
  }

  useEffect(() => {
    // Restore persisted session on mount
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Listen for all future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function signUp(
    email: string,
    password: string,
    displayName: string,
  ): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;

    const userId = data.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: userId,
        display_name: displayName,
      });
      if (insertError) console.warn('Profile insert error:', insertError.message);
    }
    return null;
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async function updateProfile(
    updates: Partial<Omit<Profile, 'id'>>,
  ): Promise<string | null> {
    if (!user) return 'Not signed in';
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates })
      .select()
      .single();
    if (error) return error.message;
    setProfile(data as Profile);
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
