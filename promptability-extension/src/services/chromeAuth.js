// src/services/chromeAuth.js

import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';    // <- IMPORT it (don't redefine it! ✅)

// Sign in with Google using Chrome's identity API
export const signInWithChromeIdentity = () => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error("Chrome identity error:", chrome.runtime.lastError);
        return reject(chrome.runtime.lastError || new Error("Failed to get auth token"));
      }

      try {
        const credential = GoogleAuthProvider.credential(null, token);
        const result = await signInWithCredential(auth, credential);
        resolve(result.user);
      } catch (error) {
        console.error("Firebase sign-in error:", error);
        reject(error);
      }
    });
  });
};

// Sign out from Firebase
export const signOut = async () => {
  try {
    await auth.signOut();
    chrome.identity.clearAllCachedAuthTokens();
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// ✅ EXPORT auth so your context can use it
export { auth };