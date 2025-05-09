// src/components/Popup/Popup.tsx
/// <reference types="chrome" />
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../common/Button';
import LoginForm from './LoginForm';
import PromptHistory from './PromptHistory';
import Settings from './Settings';

type PopupTab = 'history' | 'settings';

const Popup: React.FC = () => {
  const { currentUser, userProfile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<PopupTab>('history');
  const [hasSelection, setHasSelection] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [tabUrl, setTabUrl] = useState<string>('');
  const [tabTitle, setTabTitle] = useState<string>('');
  
  // Check for text selection on active tab
  useEffect(() => {
    const checkSelection = async () => {
      // Get the currently active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (activeTab && activeTab.id) {
        setTabUrl(activeTab.url || '');
        setTabTitle(activeTab.title || '');
        
        // Send message to content script to check selection
        try {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: 'checkSelection' },
            (response) => {
              if (response && response.hasSelection) {
                setHasSelection(true);
                setSelectedText(response.text);
              } else {
                setHasSelection(false);
                setSelectedText('');
              }
            }
          );
        } catch (error) {
          console.error('Error sending message to content script:', error);
        }
      }
    };
    
    checkSelection();
  }, []);
  
  // Handle showing overlay on the active tab
  const handleShowOverlay = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: 'showOverlay' }
      );
      
      // Close the popup
      window.close();
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab: PopupTab) => {
    setActiveTab(tab);
  };
  
  // If not logged in, show login form
  if (!currentUser && !isLoading) {
    return <LoginForm />;
  }
  
  return (
    <div className="w-96 p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Promptability AI</h2>
        <p className="text-sm text-gray-500">
          Smart Prompt Generator for AI
        </p>
      </div>
      
      {/* Selection Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        {hasSelection ? (
          <div>
            <p className="text-sm font-medium text-blue-800 mb-2">
              Text selected on this page
            </p>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {selectedText.length > 100 
                ? `${selectedText.substring(0, 100)}...` 
                : selectedText}
            </p>
            <Button 
              variant="primary"
              size="sm"
              onClick={handleShowOverlay}
              fullWidth
            >
              Generate Prompt from Selection
            </Button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            <p>No text selected on this page.</p>
            <p className="mt-1">Select text on any webpage to generate an optimized prompt.</p>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-1 text-sm font-medium ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('history')}
          >
            Prompt History
          </button>
          
          <button
            className={`py-2 px-1 text-sm font-medium ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('settings')}
          >
            Settings
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'history' && <PromptHistory />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
};

export default Popup;