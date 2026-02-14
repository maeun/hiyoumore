import React, { createContext, useState, useEffect } from "react";
import { supabase } from './supabaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear old Firebase sessionStorage on first load
    if (sessionStorage.getItem('isLoggedIn')) {
      sessionStorage.clear();
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Provide backward-compatible derived state
  const isLoggedIn = !!session;
  const token = session?.access_token || '';
  const refreshToken = session?.refresh_token || '';
  const platform = user?.app_metadata?.provider || '';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoggedIn,
        token,
        refreshToken,
        platform,
        loading,
        // Deprecated setters (no-op for backward compatibility)
        setIsLoggedIn: () => {},
        setToken: () => {},
        setRefreshToken: () => {},
        setPlatform: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
