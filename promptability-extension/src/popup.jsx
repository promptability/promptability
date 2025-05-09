import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import App from './components/App';

const Popup = () => {
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    // Get selected text from storage
    chrome.storage.local.get(['selectedText', 'pageUrl', 'pageTitle'], (result) => {
      console.log('Retrieved from storage:', result);
      // We'll handle this data in the App component
      setInitializing(false);
    });
  }, []);
  
  if (initializing) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Popup;