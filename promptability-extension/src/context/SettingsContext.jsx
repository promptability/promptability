import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// Define default settings
const defaultSettings = {
  defaultPlatform: 'openai',
  defaultRole: 'writer',
  defaultIndustry: 'tech',
  defaultTone: 'professional',
  saveHistory: true,
  shouldAddContext: true,
  formattingOptions: {
    appendInstructions: true,
    shouldTruncate: false
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from chrome storage on initial render
  useEffect(() => {
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
      setLoading(false);
    });
  }, []);

  // Save settings to chrome storage when they change
  useEffect(() => {
    if (!loading) {
      chrome.storage.local.set({ settings });
    }
  }, [settings, loading]);

  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update formatting options
  const updateFormattingOption = (key, value) => {
    setSettings(prev => ({
      ...prev,
      formattingOptions: {
        ...prev.formattingOptions,
        [key]: value
      }
    }));
  };

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Value to be provided to consumers
  const value = {
    settings,
    updateSetting,
    updateFormattingOption,
    resetSettings
  };

  // Only render children once settings have been loaded
  if (loading) {
    return null;
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};