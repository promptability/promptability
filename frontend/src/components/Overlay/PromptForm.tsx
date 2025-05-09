// src/components/Overlay/PromptForm.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../common/Button';
// import Spinner from '../../common/Spinner';
import Dropdown, { DropdownOption } from '../../common/Dropdown';
import { 
  Prompt, 
  DEFAULT_PLATFORMS, 
  Platform, 
  PromptGenerationRequest,
  FormattingOptions
} from '../../types/prompt';
import { promptService } from '../../services/api';
import { getCurrentUser } from '../../services/auth';

interface PromptFormProps {
  selectedText: string;
  pageUrl: string;
  pageTitle: string;
  onGenerate: (prompt: Prompt) => void;
  onGenerating: () => void;
  isGenerating: boolean;
  onClose: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  selectedText,
  pageUrl,
  pageTitle,
  onGenerate,
  onGenerating,
  isGenerating,
  onClose,
}) => {
  // Form state
  const [platformId, setPlatformId] = useState<string>('chatgpt'); // Default to ChatGPT
  const [roleId, setRoleId] = useState<string>('');
  const [industryId, setIndustryId] = useState<string>('');
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>({
    appendInstructions: true,
    shouldTruncate: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Check login status on mount
  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);
  
  // Convert platforms to dropdown options
  const platformOptions: DropdownOption[] = DEFAULT_PLATFORMS.map((platform: Platform) => ({
    id: platform.id,
    label: platform.name,
    // In a real implementation, you would use actual icons here
    icon: <span className="text-lg">{platform.name[0]}</span>,
  }));
  
  // Role options - these would come from your backend in a real implementation
  // Just adding placeholders for now
  const roleOptions: DropdownOption[] = [
    { id: 'writer', label: 'Writer' },
    { id: 'developer', label: 'Developer' },
    { id: 'marketer', label: 'Marketing Professional' },
    { id: 'researcher', label: 'Researcher' },
    { id: 'student', label: 'Student' },
  ];
  
  // Industry options - these would come from your backend in a real implementation
  const industryOptions: DropdownOption[] = [
    { id: 'tech', label: 'Technology' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance' },
    { id: 'education', label: 'Education' },
    { id: 'marketing', label: 'Marketing' },
  ];
  
  // Handle platform change
  const handlePlatformChange = (option: DropdownOption) => {
    setPlatformId(option.id);
  };
  
  // Handle role change
  const handleRoleChange = (option: DropdownOption) => {
    setRoleId(option.id);
  };
  
  // Handle industry change
  const handleIndustryChange = (option: DropdownOption) => {
    setIndustryId(option.id);
  };
  
  // Handle formatting option change
  const handleFormattingOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    setFormattingOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setError('Please log in to generate prompts');
      return;
    }
    
    // Reset error and indicate loading
    setError(null);
    onGenerating();
    
    // Create request payload
    const requestPayload: PromptGenerationRequest = {
      selectedText,
      platformId,
      formattingOptions,
      roleId: roleId || undefined,
      industryId: industryId || undefined,
      pageUrl,
      pageTitle,
    };
    
    try {
      // Call API to generate prompt
      const generatedPrompt = await promptService.generatePrompt(requestPayload);
      
      // Pass generated prompt to parent component
      onGenerate(generatedPrompt);
    } catch (err) {
      console.error('Error generating prompt:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate prompt');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Selected Text Preview */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selected Text:
        </label>
        <div className="border rounded p-2 bg-gray-50 text-gray-800 text-sm max-h-32 overflow-y-auto">
          {selectedText.length > 300 
            ? `${selectedText.substring(0, 300)}...` 
            : selectedText}
        </div>
      </div>
      
      {/* Target AI Platform */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target AI Platform:
        </label>
        <Dropdown
          options={platformOptions}
          selectedId={platformId}
          onChange={handlePlatformChange}
          placeholder="Select AI platform"
        />
      </div>
      
      {/* Role Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Role (optional):
        </label>
        <Dropdown
          options={roleOptions}
          selectedId={roleId}
          onChange={handleRoleChange}
          placeholder="Select your role"
        />
      </div>
      
      {/* Industry Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry (optional):
        </label>
        <Dropdown
          options={industryOptions}
          selectedId={industryId}
          onChange={handleIndustryChange}
          placeholder="Select your industry"
        />
      </div>
      
      {/* Formatting Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Formatting Options:
        </label>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="appendInstructions"
              name="appendInstructions"
              checked={formattingOptions.appendInstructions}
              onChange={handleFormattingOptionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="appendInstructions" className="ml-2 block text-sm text-gray-700">
              Include instructions
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shouldTruncate"
              name="shouldTruncate"
              checked={formattingOptions.shouldTruncate}
              onChange={handleFormattingOptionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="shouldTruncate" className="ml-2 block text-sm text-gray-700">
              Keep it concise
            </label>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isGenerating}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={isGenerating}
          disabled={isGenerating || !isLoggedIn}
        >
          {isGenerating ? 'Generating...' : 'Generate Prompt'}
        </Button>
      </div>
      
      {/* Not Logged In Message */}
      {!isLoggedIn && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Please log in via the extension popup to generate prompts.
        </div>
      )}
    </form>
  );
};

export default PromptForm;