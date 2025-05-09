import React, { useState } from 'react';
import './LoginSignup.css';
import { Wand, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginWithEmail, registerWithEmail, signInWithGoogle } from '../../utils/firebaseClient';

interface LoginSignupProps {
  onLogin: () => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const validateForm = (): boolean => {
    setError(null);
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    setError(null);
  };

  return (
    <div className="login-signup">
      <div className="login-card">
        <div className="login-brand">
          <Wand size={24} className="login-brand-icon" />
        </div>

        <h2 className="login-title">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="login-subtitle">
          {isLogin
            ? 'Sign in to access your prompts'
            : 'Sign up to start creating optimized prompts'}
        </p>

        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="login-form">
          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={16} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={16} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="visibility-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm (only on signup) */}
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={16} />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading
              ? 'Processing...'
              : isLogin
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="divider-wrapper">
          <div className="divider" />
          <span className="divider-text">or continue with</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-google"
          disabled={isLoading}
        >
          {/* Google “G” */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="google-icon"
          >
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="login-footer">
        <p>
          {isLogin
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button onClick={toggleAuthMode} className="toggle-link">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
