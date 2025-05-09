// import React, { useState, useEffect } from 'react';
// import { Wand, Copy, Bookmark, MessageCircle, Briefcase, Edit } from 'lucide-react';
// import Button from './Button';
// import Dropdown from './Dropdown';
// import Toast from './Toast';
// import { useTheme } from '../context/ThemeContext';
// import { useSettings } from '../context/SettingsContext';
// import { useAuth } from '../context/AuthContext';
// import { generatePrompt } from '../services/api';

// // Define options for dropdowns
// const platforms = [
//   { id: 'openai', name: 'OpenAI' },
//   { id: 'claude', name: 'Claude' },
//   { id: 'gemini', name: 'Gemini' },
// ];

// const roles = [
//   { id: 'writer', name: 'Writer' },
//   { id: 'developer', name: 'Developer' },
//   { id: 'marketer', name: 'Marketer' },
//   { id: 'educator', name: 'Educator' },
//   { id: 'researcher', name: 'Researcher' }
// ];

// const industries = [
//   { id: 'tech', name: 'Technology' },
//   { id: 'finance', name: 'Finance' },
//   { id: 'healthcare', name: 'Healthcare' },
//   { id: 'education', name: 'Education' },
//   { id: 'marketing', name: 'Marketing' }
// ];

// const tones = [
//   { id: 'professional', name: 'Professional' },
//   { id: 'casual', name: 'Casual' },
//   { id: 'friendly', name: 'Friendly' },
//   { id: 'formal', name: 'Formal' },
//   { id: 'persuasive', name: 'Persuasive' }
// ];

// const PromptGenerator = () => {
//   const { theme } = useTheme();
//   const { settings } = useSettings();
//   const { currentUser, userToken } = useAuth();
  
//   // State for selected text and prompt
//   const [selectedText, setSelectedText] = useState('');
//   const [pageInfo, setPageInfo] = useState({ url: '', title: '' });
//   const [generatedPrompt, setGeneratedPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
  
//   // State for dropdown options
//   const [selectedOptions, setSelectedOptions] = useState({
//     platform: settings.defaultPlatform,
//     role: settings.defaultRole,
//     industry: settings.defaultIndustry,
//     tone: settings.defaultTone,
//     context: ''
//   });
  
//   // State for UI controls
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
  
//   // Load selected text from chrome storage
//   useEffect(() => {
//     chrome.storage.local.get(['selectedText', 'pageUrl', 'pageTitle'], (result) => {
//       if (result.selectedText) {
//         setSelectedText(result.selectedText);
//       }
      
//       setPageInfo({
//         url: result.pageUrl || window.location.href,
//         title: result.pageTitle || document.title
//       });
      
//       // Generate a starting prompt template
//       updatePromptTemplate();
//     });
//   }, []);
  
//   // Update the prompt template when options change
//   useEffect(() => {
//     updatePromptTemplate();
//   }, [selectedOptions, selectedText]);
  
//   // Function to update the prompt template
//   const updatePromptTemplate = () => {
//     if (!selectedText) return;
    
//     const { platform, role, industry, tone, context } = selectedOptions;
    
//     const platformName = platforms.find(p => p.id === platform)?.name || platform;
//     const roleName = roles.find(r => r.id === role)?.name || role;
//     const industryName = industries.find(i => i.id === industry)?.name || industry;
//     const toneName = tones.find(t => t.id === tone)?.name || tone;
    
//     let promptTemplate = `You are a ${toneName} ${roleName} in ${industryName} using ${platformName}.\nPlease write in a ${toneName.toLowerCase()} tone.\n`;
    
//     if (context) {
//       promptTemplate += `\n${context}\n`;
//     }
    
//     promptTemplate += `\nHelp me improve the following text:\n\n${selectedText}`;
    
//     setGeneratedPrompt(promptTemplate);
//   };
  
//   // Function to handle dropdown changes
//   const handleOptionChange = (type, value) => {
//     setSelectedOptions(prev => ({
//       ...prev,
//       [type]: value
//     }));
//   };
  
//   // Function to toggle dropdown visibility
//   const toggleDropdown = (type) => {
//     setActiveDropdown(activeDropdown === type ? null : type);
//   };
  
//   // Function to copy prompt to clipboard
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(generatedPrompt);
//       setToastMessage('Copied to clipboard!');
//       setShowToast(true);
      
//       if (currentUser) {
//         // Log this action to the backend
//         // logPromptAction(promptId, 'copy');
//       }
//     } catch (err) {
//       setToastMessage('Failed to copy');
//       setShowToast(true);
//       console.error('Failed to copy:', err);
//     }
//   };
  
//   // Function to save prompt
//   const handleSave = () => {
//     if (!currentUser) {
//       setToastMessage('Please sign in to save');
//       setShowToast(true);
//       return;
//     }
    
//     setToastMessage('Prompt saved!');
//     setShowToast(true);
    
//     // TODO: Save prompt to Firebase
//   };
  
//   // Function to generate AI-enhanced prompt
//   const handleGenerate = async () => {
//     if (!selectedText || !currentUser) {
//       setToastMessage(currentUser ? 'No text selected' : 'Please sign in');
//       setShowToast(true);
//       return;
//     }
    
//     setIsGenerating(true);
    
//     try {
//       const response = await generatePrompt({
//         selectedText,
//         platformId: selectedOptions.platform,
//         roleId: selectedOptions.role,
//         industryId: selectedOptions.industry,
//         formattingOptions: settings.formattingOptions,
//         pageUrl: pageInfo.url,
//         pageTitle: pageInfo.title,
//         context: selectedOptions.context
//       }, userToken);
      
//       if (response && response.generatedPrompt) {
//         setGeneratedPrompt(response.generatedPrompt);
//         setToastMessage('Prompt generated!');
//         setShowToast(true);
//       }
//     } catch (error) {
//       console.error('Error generating prompt:', error);
//       setToastMessage('Failed to generate prompt');
//       setShowToast(true);
//     } finally {
//       setIsGenerating(false);
//     }
//   };
  
//   // Function to replace text on the page
//   const handleReplace = () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         type: 'REPLACE_TEXT',
//         payload: { text: generatedPrompt }
//       });
//     });
    
//     setToastMessage('Text replaced!');
//     setShowToast(true);
//   };
  
//   return (
//     <div className="p-3 relative">
//       <div className={`border rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-300'}`}>
//         <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-60">{generatedPrompt}</pre>
//       </div>
      
//       <div className="absolute bottom-3 right-3 flex space-x-2">
//         <Dropdown
//           type="platform"
//           options={platforms}
//           selectedValue={selectedOptions.platform}
//           onChange={handleOptionChange}
//           isOpen={activeDropdown === 'platform'}
//           onToggle={toggleDropdown}
//           icon={<Wand size={14} className="text-white" />}
//         />
//         <Dropdown
//           type="role"
//           options={roles}
//           selectedValue={selectedOptions.role}
//           onChange={handleOptionChange}
//           isOpen={activeDropdown === 'role'}
//           onToggle={toggleDropdown}
//           icon={<Briefcase size={14} className="text-white" />}
//         />
//         <Dropdown
//           type="tone"
//           options={tones}
//           selectedValue={selectedOptions.tone}
//           onChange={handleOptionChange}
//           isOpen={activeDropdown === 'tone'}
//           onToggle={toggleDropdown}
//           icon={<MessageCircle size={14} className="text-white" />}
//         />
//         <Dropdown
//           type="context"
//           options={[]}
//           selectedValue={selectedOptions.context}
//           onChange={handleOptionChange}
//           isOpen={activeDropdown === 'context'}
//           onToggle={toggleDropdown}
//           icon={<Edit size={14} className="text-white" />}
//           allowCustom={true}
//         />
//       </div>
      
//       <div className="mt-4 flex justify-between items-center">
//         <Button 
//           variant="secondary" 
//           size="small" 
//           onClick={handleGenerate}
//           disabled={isGenerating || !selectedText}
//           icon={<Wand size={12} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />}
//         >
//           {isGenerating ? 'Generating...' : 'AI Generate'}
//         </Button>
        
//         <div className="flex space-x-2">
//           <Button 
//             variant="primary" 
//             size="small" 
//             onClick={handleCopy}
//             icon={<Copy size={12} />}
//           >
//             Copy
//           </Button>
//           <Button 
//             variant="secondary" 
//             size="small" 
//             onClick={handleSave}
//             icon={<Bookmark size={12} />}
//           >
//             Save
//           </Button>
//         </div>
//       </div>
      
//       <Toast
//         message={toastMessage}
//         isVisible={showToast}
//         onClose={() => setShowToast(false)}
//       />
//     </div>
//   );
// };

// export default PromptGenerator;

import React, { useState, useEffect } from 'react';
import {
  Wand,
  Copy,
  Bookmark,
  MessageCircle,
  Briefcase,
  Edit,
} from 'lucide-react';
import Button from './Button';
import Dropdown from './Dropdown';
import Toast from './Toast';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import {
  generatePrompt,
  logPromptAction,
} from '../services/api';

// Define options for dropdowns
const platforms = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'gemini', name: 'Gemini' },
];

const roles = [
  { id: 'writer', name: 'Writer' },
  { id: 'developer', name: 'Developer' },
  { id: 'marketer', name: 'Marketer' },
  { id: 'educator', name: 'Educator' },
  { id: 'researcher', name: 'Researcher' },
];

const industries = [
  { id: 'tech', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'marketing', name: 'Marketing' },
];

const tones = [
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'formal', name: 'Formal' },
  { id: 'persuasive', name: 'Persuasive' },
];

const PromptGenerator = () => {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const { currentUser } = useAuth();

  // State
  const [selectedText, setSelectedText] = useState('');
  const [pageInfo, setPageInfo] = useState({ url: '', title: '' });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptId, setPromptId] = useState(null); // capture ID for logPromptAction
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({
    platform: settings.defaultPlatform,
    role: settings.defaultRole,
    industry: settings.defaultIndustry,
    tone: settings.defaultTone,
    context: '',
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load selected text from chrome storage
  useEffect(() => {
    chrome.storage.local.get(
      ['selectedText', 'pageUrl', 'pageTitle'],
      (result) => {
        if (result.selectedText) {
          setSelectedText(result.selectedText);
        }
        setPageInfo({
          url: result.pageUrl || window.location.href,
          title: result.pageTitle || document.title,
        });
      }
    );
  }, []);

  // Function to handle dropdown changes
  const handleOptionChange = (type, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const toggleDropdown = (type) => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setToastMessage('Copied to clipboard!');
      setShowToast(true);

      if (currentUser && promptId) {
        await logPromptAction(promptId, 'copy');
      }
    } catch (err) {
      setToastMessage('Failed to copy');
      setShowToast(true);
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      setToastMessage('Please sign in to save');
      setShowToast(true);
      return;
    }
    if (!promptId) {
      setToastMessage('Please generate a prompt first');
      setShowToast(true);
      return;
    }

    setToastMessage('Prompt saved!');
    setShowToast(true);
    await logPromptAction(promptId, 'save');
  };

  const handleGenerate = async () => {
    if (!selectedText || !currentUser) {
      setToastMessage(currentUser ? 'No text selected' : 'Please sign in');
      setShowToast(true);
      return;
    }

    setIsGenerating(true);
    setPromptId(null); // clear last promptId before starting

    try {
      const response = await generatePrompt({
        selectedText,
        platformId: selectedOptions.platform,
        roleId: selectedOptions.role,
        industryId: selectedOptions.industry,
        formattingOptions: settings.formattingOptions,
        pageUrl: pageInfo.url,
        pageTitle: pageInfo.title,
        subcategoryId: null,
      });

      if (response && response.generatedPrompt) {
        setGeneratedPrompt(response.generatedPrompt);
        setPromptId(response.id); // save ID for future logPromptAction
        setToastMessage('Prompt generated!');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      setToastMessage('Failed to generate prompt');
      setShowToast(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-3 relative">
      <div
        className={`border rounded-lg p-3 ${
          theme === 'dark'
            ? 'bg-gray-950 border-gray-800'
            : 'bg-white border-gray-300'
        }`}
      >
        <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-60">
          {generatedPrompt || 'Your generated prompt will appear here...'}
        </pre>
      </div>

      <div className="absolute bottom-3 right-3 flex space-x-2">
        <Dropdown
          type="platform"
          options={platforms}
          selectedValue={selectedOptions.platform}
          onChange={handleOptionChange}
          isOpen={activeDropdown === 'platform'}
          onToggle={toggleDropdown}
          icon={<Wand size={14} className="text-white" />}
        />
        <Dropdown
          type="role"
          options={roles}
          selectedValue={selectedOptions.role}
          onChange={handleOptionChange}
          isOpen={activeDropdown === 'role'}
          onToggle={toggleDropdown}
          icon={<Briefcase size={14} className="text-white" />}
        />
        <Dropdown
          type="tone"
          options={tones}
          selectedValue={selectedOptions.tone}
          onChange={handleOptionChange}
          isOpen={activeDropdown === 'tone'}
          onToggle={toggleDropdown}
          icon={<MessageCircle size={14} className="text-white" />}
        />
        <Dropdown
          type="context"
          options={[]}
          selectedValue={selectedOptions.context}
          onChange={handleOptionChange}
          isOpen={activeDropdown === 'context'}
          onToggle={toggleDropdown}
          icon={<Edit size={14} className="text-white" />}
          allowCustom={true}
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="secondary"
          size="small"
          onClick={handleGenerate}
          disabled={isGenerating || !selectedText}
          icon={
            <Wand
              size={12}
              className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            />
          }
        >
          {isGenerating ? 'Generating...' : 'AI Generate'}
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="small"
            onClick={handleCopy}
            icon={<Copy size={12} />}
          >
            Copy
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={handleSave}
            icon={<Bookmark size={12} />}
          >
            Save
          </Button>
        </div>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default PromptGenerator;