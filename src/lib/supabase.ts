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

// Bypass the Web Locks API — stale locks from hot reloads cause 10s timeouts in dev
authOptions.lock = (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: authOptions });
