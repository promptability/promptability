/* =========================================================================
 *  Firebase client-side helpers (auth + Firestore)
 * ========================================================================= */

import { initializeApp }         from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  getIdToken as fbGetIdToken,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

/* ------------------------------------------------------------------------ */
/*  .env-driven config                                                      */
/* ------------------------------------------------------------------------ */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY                 ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN             ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID              ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET          ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID     ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID                  ?? '',
};

/* ------------------------------------------------------------------------ */
/*  Initialise services                                                     */
/* ------------------------------------------------------------------------ */
const app        = initializeApp(firebaseConfig);
const auth       = getAuth(app);
export const db  = getFirestore(app);
const googleProv = new GoogleAuthProvider();

/* ======================================================================== */
/*  Helper: wait until Firebase resolved the persisted auth state           */
/* ======================================================================== */
export function waitForFirebaseAuth(): Promise<User | null> {
  return new Promise(resolve =>
    onAuthStateChanged(auth,
      user => resolve(user),        // success
      ()   => resolve(null),        // error
    ),
  );
}

/* ======================================================================== */
/*  AUTH HELPERS                                                            */
/* ======================================================================== */
export const loginWithEmail = (email: string, pass: string) =>
  signInWithEmailAndPassword(auth, email, pass).then(c => c.user);

export const registerWithEmail = async (email: string, pass: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);

  /* first profile document */
  await setDoc(doc(db, 'users', user.uid), {
    email:      user.email,
    createdAt:  serverTimestamp(),
    lastLogin:  serverTimestamp(),
  });
  return user;
};

export const signInWithGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProv);

  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email:      user.email,
      displayName:user.displayName,
      photoURL:   user.photoURL,
      createdAt:  serverTimestamp(),
      lastLogin:  serverTimestamp(),
      signInMethod:'google',
    });
  } else {
    await updateDoc(ref, { lastLogin: serverTimestamp() });
  }
  return user;
};

export const logout          = () => signOut(auth);
export const getCurrentUser  = () => auth.currentUser;

export async function getIdToken(forceRefresh = false): Promise<string> {
  const user = auth.currentUser ?? await waitForFirebaseAuth();
  if (!user) throw new Error('User not authenticated');
  return fbGetIdToken(user, forceRefresh);
}

/* ======================================================================== */
/*  FIrestore – user profile helpers                                        */
/* ======================================================================== */
export async function createOrUpdateUserProfile(uid: string, data: any) {
  const ref  = doc(db, 'users', uid, 'profile', 'info');
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref,   { ...data, createdAt: serverTimestamp() });
  }
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'profile', 'info'));
  return snap.exists() ? convertTimestamps(snap.data()) : null;
}

/* ------------------------------------------------------------------------ */
/*  Recursively convert Firestore Timestamps → JS Date                      */
/* ------------------------------------------------------------------------ */
function convertTimestamps(obj: Record<string, any>): any {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      v instanceof Timestamp
        ? v.toDate()
        : typeof v === 'object' && v !== null
          ? convertTimestamps(v)
          : v,
    ]),
  );
}
