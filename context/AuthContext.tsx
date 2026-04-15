import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase'; // 🔥 Supabase কানেকশন

// ─── Types ────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithFacebook: () => Promise<{ error: any }>;
  // Helper: force a manual refresh of the current user object (Old backward compatibility)
  refreshUser: () => Promise<{ error: any }>;
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
    }).catch(error => {
      console.error('[AuthContext] getSession error:', error);
      setLoading(false);
    });

    // সেশন পরিবর্তন (লগইন/লগআউট) হলে ট্র্যাক করবে
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('[AuthContext] login error:', error);
      return { error };
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    try {
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
    } catch (error) {
      console.error('[AuthContext] signup error:', error);
      return { error };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('[AuthContext] logout error:', error);
      return { error };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error };
    } catch (error) {
      console.error('[AuthContext] signInWithGoogle error:', error);
      return { error };
    }
  }, []);

  const signInWithFacebook = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error };
    } catch (error) {
      console.error('[AuthContext] signInWithFacebook error:', error);
      return { error };
    }
  }, []);

  /** Call this after updateProfile to force an immediate context refresh */
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser({ ...data.user });
      }
      return { error: null };
    } catch (error) {
      console.error('[AuthContext] refreshUser error:', error);
      return { error };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      signInWithGoogle,
      signInWithFacebook,
      refreshUser,
    }),
    [user, loading, login, signup, logout, signInWithGoogle, signInWithFacebook, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);