// import { useState, useEffect } from 'react';
// import { 
//   loginWithEmail, 
//   registerWithEmail, 
//   logout, 
//   onAuthChange
//   // Remove getCurrentUser since it's not being used
// } from '../utils/firebaseClient';
// import type { User } from 'firebase/auth';

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthChange((authUser) => {
//       setUser(authUser);
//       setLoading(false);
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   // Login with email and password
//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await loginWithEmail(email, password);
//       return true;
//     } catch (err: any) {
//       setError(err.message || 'Failed to login');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register new user
//   const register = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await registerWithEmail(email, password);
//       return true;
//     } catch (err: any) {
//       setError(err.message || 'Failed to register');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sign out
//   const signOut = async () => {
//     try {
//       setLoading(true);
//       await logout();
//       return true;
//     } catch (err: any) {
//       setError(err.message || 'Failed to logout');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     signOut,
//     isAuthenticated: !!user
//   };
// }

import { useEffect, useState } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  logout,
  waitForFirebaseAuth,
} from '../utils/firebaseClient';
import type { User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser]     = useState<User | null>(null);
  const [ready, setReady]   = useState(false);      // ⇢ auth initialised
  const [error, setError]   = useState<string | null>(null);
  const [busy , setBusy]    = useState(false);      // ⇢ login / register …

  /* one-shot listener – resolves when Firebase emits first state */
  useEffect(() => {
    waitForFirebaseAuth()
      .then(u => setUser(u))
      .finally(() => setReady(true));
  }, []);

  /* ---------------- auth actions ---------------- */

  const login = async (email: string, password: string) => {
    setBusy(true); setError(null);
    try {
      await loginWithEmail(email, password);
      setUser(await waitForFirebaseAuth());
      return true;
    } catch (e: any) {
      setError(e.message ?? 'Failed to login'); return false;
    } finally { setBusy(false); }
  };

  const register = async (email: string, password: string) => {
    setBusy(true); setError(null);
    try {
      await registerWithEmail(email, password);
      setUser(await waitForFirebaseAuth());
      return true;
    } catch (e: any) {
      setError(e.message ?? 'Failed to register'); return false;
    } finally { setBusy(false); }
  };

  const signOut = async () => {
    setBusy(true); setError(null);
    try { await logout(); setUser(null); return true; }
    catch (e: any) { setError(e.message ?? 'Failed to logout'); return false; }
    finally { setBusy(false); }
  };

  return {
    user,
    ready,               // <-- use this instead of “loading”
    busy,
    error,
    login,
    register,
    signOut,
    isAuthenticated: !!user,
  };
}
