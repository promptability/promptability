// src/components/Popup/Settings.tsx
import React, { useState } from 'react';
import Button from '../../common/Button';
import Dropdown, { DropdownOption } from '../../common/Dropdown';
import { useAuth } from '../../contexts/AuthContext';
import { DEFAULT_PLATFORMS, Platform } from '../../types/prompt';

interface UserSettings {
  defaultPlatformId: string;
  defaultRoleId: string;
  defaultIndustryId: string;
  appendInstructions: boolean;
  shouldTruncate: boolean;
}

const Settings: React.FC = () => {
  const { currentUser, userProfile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [settings, setSettings] = useState<UserSettings>({
    defaultPlatformId: 'chatgpt', // Default
    defaultRoleId: '',
    defaultIndustryId: '',
    appendInstructions: true,
    shouldTruncate: false,
  });
  
  // Convert platforms to dropdown options
  const platformOptions: DropdownOption[] = DEFAULT_PLATFORMS.map((platform: Platform) => ({
    id: platform.id,
    label: platform.name,
    // In a real implementation, you would use actual icons here
    icon: <span className="text-lg">{platform.name[0]}</span>,
  }));
  
  // Role options - these would come from your backend in a real implementation
  const roleOptions: DropdownOption[] = [
    { id: '', label: 'None' },
    { id: 'writer', label: 'Writer' },
    { id: 'developer', label: 'Developer' },
    { id: 'marketer', label: 'Marketing Professional' },
    { id: 'researcher', label: 'Researcher' },
    { id: 'student', label: 'Student' },
  ];
  
  // Industry options - these would come from your backend in a real implementation
  const industryOptions: DropdownOption[] = [
    { id: '', label: 'None' },
    { id: 'tech', label: 'Technology' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance' },
    { id: 'education', label: 'Education' },
    { id: 'marketing', label: 'Marketing' },
  ];
  
  // Handle platform change
  const handlePlatformChange = (option: DropdownOption) => {
    setSettings(prev => ({
      ...prev,
      defaultPlatformId: option.id,
    }));
  };
  
  // Handle role change
  const handleRoleChange = (option: DropdownOption) => {
    setSettings(prev => ({
      ...prev,
      defaultRoleId: option.id,
    }));
  };
  
  // Handle industry change
  const handleIndustryChange = (option: DropdownOption) => {
    setSettings(prev => ({
      ...prev,
      defaultIndustryId: option.id,
    }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      setSaveSuccess(false);
      
      // This would normally update the user's profile in the backend
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would be:
      // await userService.updateProfile({ settings });
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
        {userProfile?.photoURL ? (
          <img 
            src={userProfile.photoURL} 
            alt={userProfile.displayName || 'User'} 
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-800 font-medium">
              {userProfile?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">
            {userProfile?.displayName || currentUser?.email?.split('@')[0] || 'User'}
          </div>
          <div className="text-xs text-gray-500">
            {currentUser?.email}
          </div>
        </div>
      </div>
      
      {/* Default Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Default Settings</h3>
        
        <div className="space-y-3">
          {/* Default Platform */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Default AI Platform
            </label>
            <Dropdown
              options={platformOptions}
              selectedId={settings.defaultPlatformId}
              onChange={handlePlatformChange}
              placeholder="Select default platform"
            />
          </div>
          
          {/* Default Role */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Default Role
            </label>
            <Dropdown
              options={roleOptions}
              selectedId={settings.defaultRoleId}
              onChange={handleRoleChange}
              placeholder="Select default role"
            />
          </div>
          
          {/* Default Industry */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Default Industry
            </label>
            <Dropdown
              options={industryOptions}
              selectedId={settings.defaultIndustryId}
              onChange={handleIndustryChange}
              placeholder="Select default industry"
            />
          </div>
        </div>
      </div>
      
      {/* Formatting Options */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Formatting Options</h3>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="appendInstructions"
              name="appendInstructions"
              checked={settings.appendInstructions}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="appendInstructions" className="ml-2 block text-sm text-gray-700">
              Include instructions by default
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shouldTruncate"
              name="shouldTruncate"
              checked={settings.shouldTruncate}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="shouldTruncate" className="ml-2 block text-sm text-gray-700">
              Keep prompts concise by default
            </label>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="p-2 bg-green-50 text-green-700 text-sm rounded">
          Settings saved successfully!
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="text-gray-700"
        >
          Sign Out
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveSettings}
          loading={isLoading}
        >
          Save Settings
        </Button>
      </div>
      
      {/* Version info */}
      <div className="text-xs text-gray-400 text-center pt-2">
        Promptability AI v1.0.0
      </div>
    </div>
  );
};

export default Settings;