// src/services/auth.ts
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
  } from 'firebase/auth';
  import { initializeApp } from 'firebase/app';
  
  // Firebase configuration - should be imported from a config file
  // This will need to be replaced with your actual Firebase config
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  
  /**
   * Sign in with Google popup
   */
  export const signInWithGoogle = async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  
  /**
   * Sign out the current user
   */
  export const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  /**
   * Get the current user if they're authenticated
   */
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  
  /**
   * Subscribe to auth state changes
   */
  export const subscribeToAuthChanges = (
    callback: (user: User | null) => void
  ): (() => void) => {
    return onAuthStateChanged(auth, callback);
  };
  
  /**
   * Get the current authentication token
   */
  export const getAuthToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };