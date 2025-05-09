// src/components/Overlay/PromptResult.tsx
import React, { useState } from 'react';
import Button from '../../common/Button';
import { Prompt, PromptActionType } from '../../types/prompt';
import { copyToClipboard, replaceSelectedText } from '../../utils/text-selection';
import { promptService } from '../../services/api';

interface PromptResultProps {
  prompt: Prompt | null;
  onBack: () => void;
  onClose: () => void;
}

const PromptResult: React.FC<PromptResultProps> = ({
  prompt,
  onBack,
  onClose,
}) => {
  const [actionStatus, setActionStatus] = useState<{
    type: PromptActionType | null;
    success: boolean;
    message: string;
  }>({
    type: null,
    success: false,
    message: '',
  });
  
  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!prompt) return;
    
    try {
      // Copy to clipboard
      const success = await copyToClipboard(prompt.generatedPrompt);
      
      if (success) {
        // Log action to backend
        await promptService.logAction(prompt.id, 'copy');
        
        // Update status
        setActionStatus({
          type: 'copy',
          success: true,
          message: 'Copied to clipboard!',
        });
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setActionStatus({
            type: null,
            success: false,
            message: '',
          });
        }, 3000);
      } else {
        throw new Error('Failed to copy to clipboard');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      
      setActionStatus({
        type: 'copy',
        success: false,
        message: 'Failed to copy to clipboard',
      });
    }
  };
  
  // Handle replace selected text
  const handleReplace = async () => {
    if (!prompt) return;
    
    try {
      // Replace selected text
      const success = replaceSelectedText(prompt.generatedPrompt);
      
      if (success) {
        // Log action to backend
        await promptService.logAction(prompt.id, 'replace');
        
        // Update status
        setActionStatus({
          type: 'replace',
          success: true,
          message: 'Text replaced!',
        });
        
        // Close overlay after successful replacement
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error('Cannot replace text in this context');
      }
    } catch (error) {
      console.error('Error replacing text:', error);
      
      setActionStatus({
        type: 'replace',
        success: false,
        message: 'Cannot replace text in this context. Try selecting text in an editable area.',
      });
    }
  };
  
  // Handle send to platform
  const handleSend = async () => {
    if (!prompt) return;
    
    try {
      // In a real implementation, you would integrate with the specific AI platform
      // For now, just copy to clipboard and log the action
      await copyToClipboard(prompt.generatedPrompt);
      await promptService.logAction(prompt.id, 'send');
      
      // Update status
      setActionStatus({
        type: 'send',
        success: true,
        message: `Ready to paste into ${prompt.platformId}!`,
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setActionStatus({
          type: null,
          success: false,
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error sending to platform:', error);
      
      setActionStatus({
        type: 'send',
        success: false,
        message: 'Failed to send to platform',
      });
    }
  };
  
  // If no prompt, show error and back button
  if (!prompt) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">No prompt generated. Please try again.</p>
        <Button variant="primary" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Generated Prompt:</h4>
        <div className="text-xs text-gray-500">
          For {prompt.platformId === 'chatgpt' ? 'ChatGPT' : 
              prompt.platformId === 'claude' ? 'Claude' : 
              prompt.platformId === 'gemini' ? 'Gemini' : 
              prompt.platformId}
        </div>
      </div>
      
      {/* Generated Prompt */}
      <div className="border rounded p-3 bg-white mb-4 max-h-60 overflow-y-auto">
        <p className="text-gray-800 text-sm whitespace-pre-wrap">{prompt.generatedPrompt}</p>
      </div>
      
      {/* Status Message */}
      {actionStatus.message && (
        <div 
          className={`mb-4 p-2 rounded text-sm ${
            actionStatus.success 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}
        >
          {actionStatus.message}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          onClick={handleCopy}
          variant="primary"
          fullWidth
          className="flex-1"
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          }
        >
          Copy
        </Button>
        
        <Button
          onClick={handleReplace}
          variant="primary"
          fullWidth
          className="flex-1"
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          }
        >
          Replace
        </Button>
      </div>
      
      {/* Send to platform button */}
      <Button
        onClick={handleSend}
        variant="secondary"
        fullWidth
        icon={
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        }
      >
        {`Send to ${prompt.platformId === 'chatgpt' ? 'ChatGPT' : 
                 prompt.platformId === 'claude' ? 'Claude' : 
                 prompt.platformId === 'gemini' ? 'Gemini' : 
                 prompt.platformId}`}
      </Button>
      
      {/* Footer with back button */}
      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          icon={
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          }
        >
          Back
        </Button>
        
        <div className="text-xs text-gray-500">
          Created with Promptability AI
        </div>
      </div>
    </div>
  );
};

export default PromptResult;