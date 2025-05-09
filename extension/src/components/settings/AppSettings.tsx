import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../hooks/useSettings';
import Toggle from '../common/Toggle';
import './AppSettings.css';

interface AppSettingsProps {
  platforms: { id: string; name: string }[];
  roleIndustries: { id: string; name: string }[];
  tones: { id: string; name: string }[];
}

const AppSettings: React.FC<AppSettingsProps> = ({
  platforms,
  roleIndustries,
  tones
}) => {
  const { theme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className={`app-settings ${theme}`}>
      <h3 className="app-settings__title">Default Settings</h3>
      
      <div className="app-settings__row">
        <label>Default Platform</label>
        <select
          value={settings.defaultPlatform}
          onChange={(e) => updateSetting('defaultPlatform', e.target.value)}
          className="app-settings__select"
        >
          {platforms.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      
      <div className="app-settings__row">
        <label>Default Role</label>
        <select
          value={settings.defaultRole}
          onChange={(e) => updateSetting('defaultRole', e.target.value)}
          className="app-settings__select"
        >
          {roleIndustries.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      
      <div className="app-settings__row">
        <label>Default Tone</label>
        <select
          value={settings.defaultTone}
          onChange={(e) => updateSetting('defaultTone', e.target.value)}
          className="app-settings__select"
        >
          {tones.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      
      <div className="app-settings__row">
        <label>Save History</label>
        <Toggle
          checked={settings.saveHistory}
          onChange={(checked) => updateSetting('saveHistory', checked)}
          size="sm"
        />
      </div>
      
      <div className="app-settings__row">
        <label>Dark Theme</label>
        <Toggle
          checked={settings.theme === 'dark'}
          onChange={(checked) => updateSetting('theme', checked ? 'dark' : 'light')}
          size="sm"
        />
      </div>
      
      <div className="app-settings__footer">
        <button
          onClick={resetSettings}
          className="app-settings__reset"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default AppSettings;
