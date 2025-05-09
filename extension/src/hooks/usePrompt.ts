import { useState, useEffect } from 'react';
// Remove the unused imports
// import { generatePrompt, savePrompt, getPromptHistory } from '../utils/api';

interface SelectedOptions {
  platform: string;
  role: string;
  industry: string;
  tone: string;
  context: string;
}

interface PageInfo {
  url: string;
  title: string;
}

interface PromptHistory {
  id: string;
  generatedPrompt: string;
  selectedText: string;
  createdAt: string;
  favorite?: boolean;
}

const DEFAULT_OPTIONS: SelectedOptions = {
  platform: 'chatgpt',
  role: 'writer',
  industry: 'tech',
  tone: 'professional',
  context: ''
};

export function usePrompt() {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedText, setSelectedTextState] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() => {
    // Load saved options from localStorage if available
    const savedOptions = localStorage.getItem('promptOptions');
    if (savedOptions) {
      try {
        return JSON.parse(savedOptions);
      } catch (e) {
        console.error('Error parsing saved options:', e);
      }
    }
    return DEFAULT_OPTIONS;
  });
  
  const [pageInfo, setPageInfo] = useState<PageInfo>({ url: '', title: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<PromptHistory[]>([]);

  // Save options whenever they change
  useEffect(() => {
    localStorage.setItem('promptOptions', JSON.stringify(selectedOptions));
    if (selectedText) {
      generatePromptText();
    }
  }, [selectedOptions, selectedText]);

  const setSelectedText = (text: string, url?: string, title?: string) => {
    setSelectedTextState(text);
    
    // Update page info if provided
    if (url || title) {
      setPageInfo(prev => ({
        url: url || prev.url,
        title: title || prev.title
      }));
    }
  };

  const generatePromptText = async () => {
    if (!selectedText) return;
    
    try {
      setIsLoading(true);
      
      const { platform, role, tone, context } = selectedOptions;
      
      // We're not actually using this variable in the code,
      // so we can comment it out to avoid the warning
      /*
      const promptRequest = {
        selectedText: selectedText,
        platformId: platform,
        roleId: role,
        industryId: industry,
        templateId: tone,
        formattingOptions: {
          appendInstructions: true,
          shouldTruncate: false
        },
        pageUrl: pageInfo.url,
        pageTitle: pageInfo.title
      };
      */
      
      // For development/demo purposes:
      // Production implementation would use the API call:
      // const result = await generatePrompt(promptRequest);
      // setPrompt(result.generatedPrompt);
      
      // Demo implementation:
      setTimeout(() => {
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        const roleName = role.charAt(0).toUpperCase() + role.slice(1);
        const toneName = tone.charAt(0).toUpperCase() + tone.slice(1);
        
        const generatedPrompt = 
          `You are a ${toneName} ${roleName} using ${platformName}. Please write in a ${toneName.toLowerCase()} tone.` +
          `\n${context ? context + '\n' : ''}Help me improve the following text:\n\n"${selectedText}"`;
        
        setPrompt(generatedPrompt);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setIsLoading(false);
    }
  };

  const updateOption = (type: string, value: string) => {
    setSelectedOptions(prev => {
      if (type === 'role') {
        // Handle combined role-industry values (e.g., "writer-tech")
        const [role, industry] = value.split('-');
        return {
          ...prev,
          role,
          industry
        };
      }
      return {
        ...prev,
        [type]: value
      };
    });
  };

  const updateContext = (text: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      context: text
    }));
  };

  const regeneratePrompt = async () => {
    await generatePromptText();
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => {
        console.log('Copied prompt to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy prompt:', err);
      });
  };

  const saveCurrentPrompt = async () => {
    try {
      setIsLoading(true);
      // Production implementation would use:
      // await savePrompt({
      //   generatedPrompt: prompt,
      //   selectedText,
      //   platformId: selectedOptions.platform,
      //   roleId: selectedOptions.role,
      //   industryId: selectedOptions.industry,
      //   templateId: selectedOptions.tone,
      //   pageUrl: pageInfo.url,
      //   pageTitle: pageInfo.title
      // });
      
      // For now just log and simulate delay
      console.log('Saving prompt:', {
        prompt,
        selectedText,
        selectedOptions,
        pageInfo
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      
      // Production implementation would use:
      // const results = await getPromptHistory();
      // setHistory(results);
      
      // Demo implementation:
      setTimeout(() => {
        setHistory([
          {
            id: '1',
            generatedPrompt: 'You are a Professional Writer using ChatGPT. Please write in a professional tone. Help me improve the following text: "This is a sample text that needs improvement"',
            selectedText: 'This is a sample text that needs improvement',
            createdAt: new Date().toISOString(),
            favorite: true
          },
          {
            id: '2',
            generatedPrompt: 'You are a Casual Designer using Claude. Please write in a casual tone. Help me improve the following text: "Another sample text for demonstration"',
            selectedText: 'Another sample text for demonstration',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading prompt history:', error);
      setIsLoading(false);
    }
  };

  return {
    prompt,
    selectedText,
    selectedOptions,
    pageInfo,
    isLoading,
    history,
    setSelectedText,
    updateOption,
    updateContext,
    regeneratePrompt,
    copyPrompt,
    saveCurrentPrompt,
    loadHistory
  };
}