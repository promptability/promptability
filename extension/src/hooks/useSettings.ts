import { useState, useEffect } from 'react';

interface Settings {
  defaultPlatform: string;
  defaultRole: string;
  defaultTone: string;
  saveHistory: boolean;
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: Settings = {
  defaultPlatform: 'chatgpt',
  defaultRole: 'writer-tech',
  defaultTone: 'professional',
  saveHistory: true,
  theme: 'dark'
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage if available
    const savedSettings = localStorage.getItem('promptabilitySettings');
    if (savedSettings) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('promptabilitySettings', JSON.stringify(settings));
    
    // Apply theme from settings
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Update a single setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings
  };
}