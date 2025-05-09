// src/components/Popup/LoginForm.tsx
import React, { useState } from 'react';
import Button from '../../common/Button';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const { signIn, error: authError, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const handleSignIn = async () => {
    try {
      setError(null);
      await signIn();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', err);
    }
  };
  
  return (
    <div className="w-80 p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to Promptability</h2>
        <p className="text-sm text-gray-500">
          Sign in to start generating optimized AI prompts
        </p>
      </div>
      
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-blue-600" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Error Message */}
      {(error || authError) && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error || (authError && authError.message) || 'Authentication error'}
        </div>
      )}
      
      {/* Sign In Button */}
      <Button
        variant="primary"
        fullWidth
        loading={isLoading}
        onClick={handleSignIn}
        className="mb-4"
        icon={
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
            <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
            <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
            <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
          </svg>
        }
      >
        Sign in with Google
      </Button>
      
      {/* Instructions */}
      <div className="text-xs text-gray-500">
        <p className="mb-1">After signing in, you can:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Select text on any webpage</li>
          <li>Generate optimized prompts for AI platforms</li>
          <li>View your prompt history</li>
          <li>Customize your prompt preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;