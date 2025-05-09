import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Header from '../layout/Header';
import AppSettings from './AppSettings';
import ProfileSettings from './ProfileSettings';
import { Cog, User, LogOut, Info } from 'lucide-react';
import './SettingsPage.css';

interface SettingsPageProps {
  onBack: () => void;
  platforms: { id: string; name: string }[];
  roleIndustries: { id: string; name: string }[];
  tones: { id: string; name: string }[];
}

type Tab = 'app' | 'profile' | 'about';

const SettingsPage: React.FC<SettingsPageProps> = ({
  onBack, platforms, roleIndustries, tones
}) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('app');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm('Log out?')) return;
    setIsLoggingOut(true);
    await signOut();
    window.location.reload();
  };

  return (
    <div className={`settings-page ${theme}`}>
      <Header
        title="Settings"
        onSettingsClick={() => {}}
        onClose={onBack}
        showBackButton
        onBackClick={onBack}
      />

      <div className="settings-page__body">
        <aside className="settings-page__sidebar">
          <button
            onClick={() => setActiveTab('app')}
            className={`settings-page__nav-btn ${activeTab==='app'? 'active':''}`}
          >
            <Cog />App
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`settings-page__nav-btn ${activeTab==='profile'? 'active':''}`}
          >
            <User />Profile
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`settings-page__nav-btn ${activeTab==='about'? 'active':''}`}
          >
            <Info />About
          </button>
          {user && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="settings-page__nav-btn logout"
            >
              <LogOut />{isLoggingOut?'Logging out...':'Log Out'}
            </button>
          )}
        </aside>

        <main className="settings-page__content">
          {activeTab==='app'     && <AppSettings platforms={platforms} roleIndustries={roleIndustries} tones={tones} />}
          {activeTab==='profile' && <ProfileSettings />}
          {activeTab==='about'   && (
            <div className="settings-page__about">
              <h3>About Promptability AI</h3>
              <p>Chrome extension for optimized AI prompts.</p>
              <ul>
                <li>Version: 1.0.0</li>
                <li>Updated: April 29, 2025</li>
                <li>Developer: Promptability Team</li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
