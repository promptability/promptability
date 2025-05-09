import React from 'react';
import { ArrowLeft, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import Button from './Button';

// Import your platform, role, industry, and tone options
import { 
  platforms,
  roles,
  industries,
  tones
} from '../utils/options';

const Settings = ({ onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSetting, updateFormattingOption, resetSettings } = useSettings();
  
  const handleSwitchToggle = (key) => {
    if (key.includes('.')) {
      // Handle nested keys like 'formattingOptions.appendInstructions'
      const [parent, child] = key.split('.');
      if (parent === 'formattingOptions') {
        updateFormattingOption(child, !settings.formattingOptions[child]);
      }
    } else {
      // Handle top-level keys
      updateSetting(key, !settings[key]);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`px-3 py-2 flex justify-between items-center ${
        theme === 'dark' ? 'bg-gray-950 border-b border-gray-800' : 'bg-gray-100 border-b border-gray-300'
      }`}>
        <button onClick={onBack} className="flex items-center space-x-1">
          <ArrowLeft size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          <span className="font-semibold text-sm">Promptability</span>
        </button>
        <div className="flex items-center space-x-2">
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
            onClick={onBack}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="p-4 space-y-4 overflow-y-auto flex-grow">
        <h2 className="text-sm font-medium">Default Settings</h2>
        
        {/* Default Platform */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Default Platform</label>
          <select
            value={settings.defaultPlatform}
            onChange={(e) => updateSetting('defaultPlatform', e.target.value)}
            className={`border rounded p-1 text-xs ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        {/* Default Role */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Default Role</label>
          <select
            value={settings.defaultRole}
            onChange={(e) => updateSetting('defaultRole', e.target.value)}
            className={`border rounded p-1 text-xs ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        
        {/* Default Industry */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Default Industry</label>
          <select
            value={settings.defaultIndustry}
            onChange={(e) => updateSetting('defaultIndustry', e.target.value)}
            className={`border rounded p-1 text-xs ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {industries.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>
        
        {/* Default Tone */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Default Tone</label>
          <select
            value={settings.defaultTone}
            onChange={(e) => updateSetting('defaultTone', e.target.value)}
            className={`border rounded p-1 text-xs ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {tones.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        
        <h2 className="text-sm font-medium mt-6">Options</h2>
        
        {/* Save History */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Save History</label>
          <div
            onClick={() => handleSwitchToggle('saveHistory')}
            className={`w-10 h-5 rounded-full cursor-pointer relative ${
              settings.saveHistory ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                settings.saveHistory ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>
        
        {/* Add Context */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Add Context to Prompts</label>
          <div
            onClick={() => handleSwitchToggle('shouldAddContext')}
            className={`w-10 h-5 rounded-full cursor-pointer relative ${
              settings.shouldAddContext ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                settings.shouldAddContext ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>
        
        {/* Append Instructions */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Append Instructions</label>
          <div
            onClick={() => handleSwitchToggle('formattingOptions.appendInstructions')}
            className={`w-10 h-5 rounded-full cursor-pointer relative ${
              settings.formattingOptions.appendInstructions ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                settings.formattingOptions.appendInstructions ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>
        
        {/* Keep Prompts Concise */}
        <div className="flex items-center justify-between">
          <label className="text-xs">Keep Prompts Concise</label>
          <div
            onClick={() => handleSwitchToggle('formattingOptions.shouldTruncate')}
            className={`w-10 h-5 rounded-full cursor-pointer relative ${
              settings.formattingOptions.shouldTruncate ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                settings.formattingOptions.shouldTruncate ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className={`px-4 py-3 ${
        theme === 'dark' ? 'bg-gray-950 border-t border-gray-800' : 'bg-gray-100 border-t border-gray-300'
      }`}>
        <Button 
          variant="secondary" 
          size="small" 
          onClick={resetSettings}
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;