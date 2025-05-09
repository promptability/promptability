import React, { useState, useEffect } from 'react';
import { Wand, Sun, Moon, X, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PromptGenerator from './PromptGenerator';
import Settings from './Settings';
import Toast from './Toast';
import Button from './Button';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, signInWithGoogle, logout, isAuthenticated } = useAuth();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Check if user needs to be prompted to sign in
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
  }, [isAuthenticated]);
  
  // Handle sign in
  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const success = await signInWithGoogle();
      if (success) {
        setShowAuthPrompt(false);
        setToastMessage('Signed in successfully');
        setShowToast(true);
      } else {
        setToastMessage('Failed to sign in');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setToastMessage('Error signing in');
      setShowToast(true);
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      setToastMessage('Signed out');
      setShowToast(true);
    } catch (error) {
      console.error('Sign out error:', error);
      setToastMessage('Error signing out');
      setShowToast(true);
    }
  };
  
  // Handle close extension
  const handleClose = () => {
    window.close();
  };
  
  // Render content based on state
  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }
  
  return (
    <div className={`w-full h-full flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`px-3 py-2 flex justify-between items-center ${
        theme === 'dark' ? 'bg-gray-950 border-b border-gray-800' : 'bg-gray-100 border-b border-gray-300'
      }`}>
        <div className="flex items-center space-x-1">
          <Wand size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
          <span className="font-semibold text-sm">Promptability</span>
        </div>
        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <button
              onClick={handleSignOut}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              title="Sign out"
            >
              <img 
                src={currentUser?.photoURL || 'https://via.placeholder.com/24'} 
                alt="Profile" 
                className="w-4 h-4 rounded-full"
              />
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <SettingsIcon size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? (
              <Sun size={14} className="text-gray-400" />
            ) : (
              <Moon size={14} className="text-gray-600" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        {showAuthPrompt ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <Wand size={40} className="text-blue-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Welcome to Promptability</h2>
            <p className="text-sm text-center mb-6 max-w-xs">
              Sign in to generate AI-optimized prompts and save your history.
            </p>
            <Button
              variant="primary"
              size="medium"
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="w-full max-w-xs"
            >
              {isAuthenticating ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </div>
        ) : (
          <PromptGenerator />
        )}
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default App;