import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase'; // 🔥 Supabase কানেকশন

// ─── Types ────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  // Helper: force a manual refresh of the current user object (Old backward compatibility)
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ─── Provider ─────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // শুরুতে সেশন চেক করবে
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // সেশন পরিবর্তন (লগইন/লগআউট) হলে ট্র্যাক করবে
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signup = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  /** Call this after updateProfile to force an immediate context refresh */
  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser({ ...data.user });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, signInWithGoogle, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);