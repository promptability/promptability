// src/components/Overlay/Overlay.tsx
import React, { useState, useEffect } from 'react';
import { getSelectionPosition } from '../../utils/text-selection';
import PromptForm from './PromptForm';
import PromptResult from './PromptResult';
import { Prompt } from '../../types/prompt';
import Button from '../../common/Button';

interface OverlayProps {
  selectedText: string;
  pageUrl: string;
  pageTitle: string;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({
  selectedText,
  pageUrl,
  pageTitle,
  onClose,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<Prompt | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  
  // Calculate position based on text selection
  useEffect(() => {
    const { top, left } = getSelectionPosition();
    setPosition({ top, left });
  }, [selectedText]);
  
  // Handle prompt generation completion
  const handlePromptGenerated = (prompt: Prompt) => {
    setGeneratedPrompt(prompt);
    setIsGenerating(false);
    setShowForm(false);
  };
  
  // Handle generation start
  const handleGenerating = () => {
    setIsGenerating(true);
  };
  
  // Handle back button from result to form
  const handleBackToForm = () => {
    setShowForm(true);
  };
  
  // Determine the max width of the overlay for responsiveness
  const overlayMaxWidth = window.innerWidth <= 768 ? 'calc(100% - 32px)' : '450px';
  
  return (
    <div
      className="absolute bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)',
        maxWidth: overlayMaxWidth,
        width: '450px',
        maxHeight: '80vh',
        zIndex: 10000,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2">
        <h3 className="text-lg font-medium">Promptability AI</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          className="!bg-transparent !text-white hover:!bg-blue-700"
          aria-label="Close"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </Button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {showForm ? (
          <PromptForm
            selectedText={selectedText}
            pageUrl={pageUrl}
            pageTitle={pageTitle}
            onGenerate={handlePromptGenerated}
            onGenerating={handleGenerating}
            isGenerating={isGenerating}
            onClose={onClose}
          />
        ) : (
          <PromptResult
            prompt={generatedPrompt}
            onBack={handleBackToForm}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default Overlay;