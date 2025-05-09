import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from storage or default to 'dark'
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);

  // Load theme from storage on initial render
  useEffect(() => {
    chrome.storage.local.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
      }
      setLoading(false);
    });
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    if (!loading) {
      chrome.storage.local.set({ theme });
      
      // Apply theme to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, loading]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Value to be provided to consumers
  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  // Only render children once the theme has been loaded
  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};