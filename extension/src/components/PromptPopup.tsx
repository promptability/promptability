import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { usePrompt } from '../hooks/usePrompt';
import { useToast } from '../hooks/useToast';
import Header from './layout/Header';
import Footer from './layout/Footer';
import PromptOptions from './prompt/PromptOptions';
import PromptHistory from './PromptHistory';
import SettingsPage from './settings/SettingsPage';
import { Prompt } from '../models/promptability';
import './PromptPopup.css';

interface PromptPopupProps {
  initialText?: string;
  pageUrl?: string;
  pageTitle?: string;
  onClose: () => void;
}

const platforms = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude',   name: 'Claude'   },
  { id: 'gemini',   name: 'Gemini'   },
];

const roleIndustries = [
  { id: 'writer-tech',      name: 'Writer (Tech)'      },
  { id: 'designer-fashion', name: 'Designer (Fashion)' },
  { id: 'marketer-finance', name: 'Marketer (Finance)' },
];

const tones = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual',       name: 'Casual'       },
  { id: 'friendly',     name: 'Friendly'     },
];

const PromptPopup: React.FC<PromptPopupProps> = ({
  initialText = '',
  pageUrl     = '',
  pageTitle   = '',
  onClose
}) => {
  const { theme } = useTheme();
  const { toast, showToast } = useToast();
  const [showHistory,  setShowHistory]  = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    prompt,
    selectedOptions,
    isLoading,
    setSelectedText,
    updateOption,
    updateContext,
    regeneratePrompt,
    copyPrompt,
    saveCurrentPrompt
  } = usePrompt();

  useEffect(() => {
    if (initialText) {
      setSelectedText(initialText, pageUrl, pageTitle);
    }
  }, [initialText, pageUrl, pageTitle, setSelectedText]);

  const handleCopy = () => {
    copyPrompt();
    showToast('Copied to clipboard!', 'success');
  };
  const handleSave = async () => {
    await saveCurrentPrompt();
    showToast('Prompt saved!', 'success');
  };
  const handleRegenerate = async () => {
    await regeneratePrompt();
    showToast('Prompt regenerated!', 'success');
  };
  const handleViewHistory = () => setShowHistory(true);
  const handleSelectPrompt = (p: Prompt) => {
    setSelectedText(p.selectedText);
    setShowHistory(false);
  };

  if (showSettings) {
    return (
      <SettingsPage
        onBack={() => setShowSettings(false)}
        platforms={platforms}
        roleIndustries={roleIndustries}
        tones={tones}
      />
    );
  }
  if (showHistory) {
    return (
      <PromptHistory
        onBack={() => setShowHistory(false)}
        onSelectPrompt={handleSelectPrompt}
      />
    );
  }

  return (
    <div className={`prompt-popup ${theme}`}>
      <Header
        title="Promptability AI"
        onSettingsClick={() => setShowSettings(true)}
        onClose={onClose}
      />

      <div className="prompt-popup__options-bar">
        <PromptOptions
          platforms={platforms}
          roleIndustries={roleIndustries}
          tones={tones}
          selectedOptions={selectedOptions}
          onOptionChange={updateOption}
          onContextChange={updateContext}
        />
      </div>

      <div className="prompt-popup__body">
        {isLoading ? (
          <div className="prompt-popup__spinner">
            <div className="spinner"></div>
          </div>
        ) : initialText ? (
          <div className="prompt-popup__sections">
            <div className="prompt-popup__section">
              <div className="prompt-popup__section-label">Selected Text:</div>
              <div className="prompt-popup__section-box">{initialText}</div>
            </div>
            <div className="prompt-popup__section">
              <div className="prompt-popup__section-label">Generated Prompt:</div>
              <div className="prompt-popup__section-box">
                <pre>{prompt}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="prompt-popup__placeholder">
            <div className="prompt-popup__placeholder-title">No Text Selected</div>
            <p className="prompt-popup__placeholder-text">
              Highlight text on a webpage and click the Promptability icon to generate an optimized prompt.
            </p>
          </div>
        )}
      </div>

      <Footer
        onCopy={handleCopy}
        onSave={handleSave}
        onRegenerate={handleRegenerate}
        onViewHistory={handleViewHistory}
        isLoading={isLoading}
      />

      {toast.visible && (
        <div className="prompt-popup__toast-container">
          <div className={`prompt-popup__toast prompt-popup__toast--${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPopup;
