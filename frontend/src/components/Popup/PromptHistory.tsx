// src/components/Popup/PromptHistory.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import { Prompt } from '../../types/prompt';
import { promptService } from '../../services/api';
import { copyToClipboard } from '../../utils/text-selection';

const PromptHistory: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Fetch prompts on component mount
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const promptsData = await promptService.getPrompts();
        
        // Sort by created date (newest first)
        promptsData.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setPrompts(promptsData);
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError('Failed to load your prompt history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrompts();
  }, []);
  
  // Handle copy to clipboard
  const handleCopy = async (prompt: Prompt) => {
    try {
      const success = await copyToClipboard(prompt.generatedPrompt);
      
      if (success) {
        // Log the copy action
        await promptService.logAction(prompt.id, 'copy');
        
        // Show copied indicator
        setCopiedId(prompt.id);
        
        // Hide copied indicator after 2 seconds
        setTimeout(() => {
          setCopiedId(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    // If today, just show the time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, show the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Get platform display name
  const getPlatformName = (platformId: string): string => {
    switch (platformId) {
      case 'chatgpt':
        return 'ChatGPT';
      case 'claude':
        return 'Claude';
      case 'gemini':
        return 'Gemini';
      default:
        return platformId;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner size="md" className="text-blue-600 mb-4" />
        <p className="text-gray-500">Loading your prompt history...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        <p className="font-medium mb-2">Failed to load prompts</p>
        <p className="text-sm">{error}</p>
        <Button 
          variant="primary" 
          size="sm" 
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // Empty state
  if (prompts.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-gray-400 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No prompts yet</h3>
        <p className="text-gray-500 text-sm mb-4">
          Select text on any webpage and use Promptability to generate your first prompt
        </p>
      </div>
    );
  }
  
  // Render prompt history
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
      {prompts.map((prompt) => (
        <div 
          key={prompt.id} 
          className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between mb-1">
            <div className="text-xs text-gray-500">
              {formatDate(prompt.createdAt)}
            </div>
            <div className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
              {getPlatformName(prompt.platformId)}
            </div>
          </div>
          
          {/* Selected text preview */}
          <div className="text-xs text-gray-500 mb-2 line-clamp-1">
            <span className="font-medium">Original:</span> {prompt.selectedText}
          </div>
          
          {/* Generated prompt preview */}
          <div className="text-sm text-gray-800 mb-2 line-clamp-2">
            {prompt.generatedPrompt}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(prompt)}
              className="text-xs"
              icon={
                copiedId === prompt.id ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-green-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                    />
                  </svg>
                )
              }
            >
              {copiedId === prompt.id ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromptHistory;