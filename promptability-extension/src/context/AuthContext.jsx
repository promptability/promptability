// /*  src/context/AuthContext.jsx  */
// import React, {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//   } from 'react';
//   import { onAuthStateChanged } from 'firebase/auth';
  
//   /*
//     chromeAuth.js **must** export:
//       • auth                    – Firebase Auth instance
//       • signInWithChromeIdentity
//       • signOut                 – custom sign-out helper
//   */
//   import {
//     auth,
//     signInWithChromeIdentity,
//     signOut as chromeSignOut,     // <- alias to avoid name clash
//   } from '../services/chromeAuth';
  
//   /* ------------------------------------------------------------------ */
//   /*  Context boiler-plate                                              */
//   /* ------------------------------------------------------------------ */
  
//   const AuthContext = createContext(null);
  
//   export const useAuth = () => useContext(AuthContext);
  
//   /* ------------------------------------------------------------------ */
//   /*  Provider                                                          */
//   /* ------------------------------------------------------------------ */
  
//   export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [userToken,   setUserToken]   = useState(null);
//     const [loading,     setLoading]     = useState(true);
  
//     /* --- observe firebase auth state -------------------------------- */
//     useEffect(() => {
//       const unsubscribe = onAuthStateChanged(auth, async (user) => {
//         setCurrentUser(user);
  
//         if (user) {
//           try {
//             const token = await user.getIdToken();
//             setUserToken(token);
//             chrome.storage?.local.set({ userToken: token });
//           } catch (err) {
//             console.error('Error getting ID token:', err);
//           }
//         } else {
//           setUserToken(null);
//           chrome.storage?.local.remove('userToken');
//         }
  
//         setLoading(false);
//       });
  
//       return unsubscribe;       // clean up listener
//     }, []);
  
//     /* --- helpers ---------------------------------------------------- */
//     const signInWithGoogle = async () => {
//       try {
//         await signInWithChromeIdentity();
//         return true;
//       } catch (err) {
//         console.error('Error signing in with Google:', err);
//         return false;
//       }
//     };
  
//     const logout = async () => {
//       try {
//         await chromeSignOut();
//         return true;
//       } catch (err) {
//         console.error('Error signing out:', err);
//         return false;
//       }
//     };
  
//     /* --- value exposed to the tree --------------------------------- */
//     const value = {
//       currentUser,
//       userToken,
//       isAuthenticated: !!currentUser,
//       signInWithGoogle,
//       logout,
//     };
  
//     /* --- lazy splash while auth state is loading -------------------- */
//     if (loading) {
//       return (
//         <div className="flex h-full w-full items-center justify-center">
//           Loading …
//         </div>
//       );
//     }
  
//     /* --- render children ------------------------------------------- */
//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
//   };

/*  src/context/AuthContext.jsx  */
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
  } from 'react';
  import { onAuthStateChanged } from 'firebase/auth';
  
  /*
    chromeAuth.js **must** export:
      • auth                    – Firebase Auth instance
      • signInWithChromeIdentity
      • signOut                 – custom sign-out helper
  */
  import {
    auth,
    signInWithChromeIdentity,
    signOut as chromeSignOut, // alias
  } from '../services/chromeAuth';
  
  /* ------------------------------------------------------------------ */
  /*  Context boiler-plate                                              */
  /* ------------------------------------------------------------------ */
  
  const AuthContext = createContext(null);
  
  export const useAuth = () => useContext(AuthContext);
  
  /* ------------------------------------------------------------------ */
  /*  Provider                                                          */
  /* ------------------------------------------------------------------ */
  
  export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [loading, setLoading] = useState(true);
  
    /* --- observe firebase auth state -------------------------------- */
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
  
        if (user) {
          try {
            const token = await user.getIdToken();
            setUserToken(token);
            chrome.storage?.local.set({ userToken: token });
            console.log('✅ Token saved to chrome.storage');
          } catch (err) {
            console.error('❌ Error getting ID token:', err);
          }
        } else {
          setUserToken(null);
          chrome.storage?.local.remove('userToken');
          console.log('🚫 Removed token from chrome.storage');
        }
  
        setLoading(false);
      });
  
      return unsubscribe; // cleanup listener
    }, []);
  
    /* --- helpers ---------------------------------------------------- */
    const signInWithGoogle = async () => {
      try {
        await signInWithChromeIdentity();
        return true;
      } catch (err) {
        console.error('❌ Error signing in with Google:', err);
        return false;
      }
    };
  
    const logout = async () => {
      try {
        await chromeSignOut();
        return true;
      } catch (err) {
        console.error('❌ Error signing out:', err);
        return false;
      }
    };
  
    /* --- value exposed to the tree --------------------------------- */
    const value = {
      currentUser,
      userToken,
      isAuthenticated: !!currentUser,
      signInWithGoogle,
      logout,
    };
  
    /* --- lazy splash while auth state is loading -------------------- */
    if (loading) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          Loading authentication...
        </div>
      );
    }
  
    /* --- render children ------------------------------------------- */
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };