// // extension/src/components/LoginSignup.tsx
// import { useState } from 'react';
// import { auth, googleProvider } from '../utils/firebaseClient';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup
// } from 'firebase/auth';

// export default function LoginSignup() {
//   const [mode, setMode] = useState<'login'|'signup'>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string|null>(null);
//   const [token, setToken] = useState('');

//   const handleEmail = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       const cred = mode === 'signup'
//         ? await createUserWithEmailAndPassword(auth, email, password)
//         : await signInWithEmailAndPassword(auth, email, password);

//       const idToken = await cred.user.getIdToken();
//       setToken(idToken);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleGoogle = async () => {
//     setError(null);
//     try {
//       const cred = await signInWithPopup(auth, googleProvider);
//       const idToken = await cred.user.getIdToken();
//       setToken(idToken);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 360, margin: 'auto' }}>
//       <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>

//       {/* Email / Password Form */}
//       <form onSubmit={handleEmail}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//           style={{ width: '100%', marginBottom: 8 }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//           style={{ width: '100%', marginBottom: 12 }}
//         />
//         <button type="submit" style={{ width: '100%', marginBottom: 12 }}>
//           {mode === 'login' ? 'Login' : 'Sign Up'}
//         </button>
//       </form>

//       {/* Divider */}
//       <div style={{ textAlign: 'center', margin: '12px 0' }}>— or —</div>

//       {/* Google Sign-In */}
//       <button
//         onClick={handleGoogle}
//         style={{
//           width: '100%',
//           background: '#4285F4',
//           color: 'white',
//           padding: '8px 0',
//           border: 'none',
//           borderRadius: 4,
//           cursor: 'pointer'
//         }}
//       >
//         {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
//       </button>

//       {/* Toggle mode */}
//       <p style={{ marginTop: 12, textAlign: 'center' }}>
//         {mode === 'login'
//           ? "Don't have an account?"
//           : 'Already have an account?'}{' '}
//         <button
//           onClick={() => {
//             setMode(mode === 'login' ? 'signup' : 'login');
//             setError(null);
//             setToken('');
//           }}
//           style={{ textDecoration: 'underline', background: 'none', border: 0, color: '#007bff', cursor: 'pointer' }}
//         >
//           {mode === 'login' ? 'Sign Up' : 'Login'}
//         </button>
//       </p>

//       {/* Error & Token Display */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {token && (
//         <div style={{ marginTop: 20 }}>
//           <h4>Your Firebase ID Token</h4>
//           <textarea
//             readOnly
//             value={token}
//             rows={6}
//             style={{ width: '100%', fontSize: 12 }}
//           />
//           <p style={{ fontSize: 12 }}>Copy this into Postman’s <code>id_token</code> env var.</p>
//         </div>
//       )}
//     </div>
//   );
// }
