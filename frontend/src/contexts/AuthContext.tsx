// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle, 
  signOut, 
  getCurrentUser, 
  subscribeToAuthChanges 
} from '../services/auth';
import { UserProfile } from '../types/prompt';
import { userService } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setUserProfile(null);
        return;
      }

      try {
        const profile = await userService.getProfile();
        setUserProfile(profile as UserProfile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // Sign in handler
  const handleSignIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
      setUserProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    error,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};