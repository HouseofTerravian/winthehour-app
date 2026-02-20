import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const authOptions: Record<string, any> = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

// Only set custom storage on native — let web use its default localStorage
if (Platform.OS !== 'web') {
  authOptions.storage = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
}

// Must run before createClient — Supabase checks navigator.locks in its constructor.
// Hiding it forces Supabase to use its in-memory mutex instead, which has no stale
// lock issues on page refresh.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  try {
    Object.defineProperty(Navigator.prototype, 'locks', {
      get: () => undefined,
      configurable: true,
    });
  } catch {
    try { (window.navigator as any).locks = undefined; } catch { /* ignore */ }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: authOptions });
