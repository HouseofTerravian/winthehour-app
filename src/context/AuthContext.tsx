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
    let mounted = true;

    // getSession() reliably reads the persisted session on startup
    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
        if (!s?.user) setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    // onAuthStateChange handles all subsequent transitions (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (!s?.user) {
        setProfile(null);
        setLoading(false);
      }
    });

    // Safety net — never leave the app stuck on the loading screen
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile in a separate effect — never call Supabase inside onAuthStateChange
  useEffect(() => {
    if (!user) return;
    let active = true;
    fetchProfile(user.id)
      .then(p => { if (active) setProfile(p); })
      .catch(e => console.warn('fetchProfile:', e))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.id]);

  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function signUp(
    email: string,
    password: string,
    displayName: string,
  ): Promise<string | null> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) return error.message;

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
