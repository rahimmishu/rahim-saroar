import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onIdTokenChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

// ─── Types ────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  // Helper: force a manual refresh of the current user object
  // (call this after updateProfile so navbar re-renders with new photoURL/displayName)
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

// ─── Provider ─────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * ✅ KEY FIX: Use onIdTokenChanged instead of onAuthStateChanged.
     *
     * onAuthStateChanged → fires only on sign-in / sign-out
     * onIdTokenChanged   → fires on sign-in / sign-out AND whenever the
     *                      ID token refreshes (which happens after
     *                      currentUser.reload() is called).
     *
     * This means after updateProfile() + reload(), the navbar will
     * automatically re-render with the new displayName / photoURL.
     */
    const unsubscribe = onIdTokenChanged(auth, (currentUser) => {
      setUser(currentUser ? { ...currentUser } : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /** Call this after updateProfile to force an immediate context refresh */
  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      // Spread into a new object so React detects the reference change
      setUser({ ...auth.currentUser! });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);
