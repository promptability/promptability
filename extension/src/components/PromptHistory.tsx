import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Prompt } from '../models/promptability';
import Header from './layout/Header';
import { Copy, Star, Trash, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PromptHistoryProps {
  onBack: () => void;
  onSelectPrompt: (prompt: Prompt) => void;
}

type SortField = 'date' | 'platform';
type SortDirection = 'asc' | 'desc';

const PromptHistory: React.FC<PromptHistoryProps> = ({ onBack, onSelectPrompt }) => {
  const { theme } = useTheme();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Load prompt history on mount
  useEffect(() => {
    loadPromptHistory();
  }, []);

  // Load prompt history from the API
  const loadPromptHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would call your backend API
      // const response = await getPromptHistory();
      // setPrompts(response);
      
      // Mock data for development
      setTimeout(() => {
        const mockPrompts: Prompt[] = [
          {
            id: '1',
            userId: 'user1',
            selectedText: 'This is a sample text that needs improvement',
            generatedPrompt: 'You are a Professional Writer using ChatGPT. Please write in a professional tone. Help me improve the following text: "This is a sample text that needs improvement"',
            roleId: 'writer',
            industryId: 'tech',
            templateId: 'professional',
            platformId: 'chatgpt',
            formattingOptions: {
              appendInstructions: true,
              shouldTruncate: false
            },
            pageUrl: 'https://example.com',
            pageTitle: 'Example Page',
            createdAt: new Date().toISOString(),
            favorite: true
          },
          {
            id: '2',
            userId: 'user1',
            selectedText: 'Another sample text for demonstration',
            generatedPrompt: 'You are a Casual Designer using Claude. Please write in a casual tone. Help me improve the following text: "Another sample text for demonstration"',
            roleId: 'designer',
            industryId: 'fashion',
            templateId: 'casual',
            platformId: 'claude',
            formattingOptions: {
              appendInstructions: true,
              shouldTruncate: false
            },
            pageUrl: 'https://example.com/page2',
            pageTitle: 'Another Example',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            favorite: false
          },
          {
            id: '3',
            userId: 'user1',
            selectedText: 'A third sample text to show filtering',
            generatedPrompt: 'You are a Friendly Marketer using Gemini. Please write in a friendly tone. Help me improve the following text: "A third sample text to show filtering"',
            roleId: 'marketer',
            industryId: 'finance',
            templateId: 'friendly',
            platformId: 'gemini',
            formattingOptions: {
              appendInstructions: true,
              shouldTruncate: false
            },
            pageUrl: 'https://example.com/page3',
            pageTitle: 'Third Example',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            favorite: true
          }
        ];
        
        setPrompts(mockPrompts);
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to load prompt history');
      setIsLoading(false);
      console.error('Error loading prompt history:', err);
    }
  };

  // Toggle favorite status for a prompt
  const handleToggleFavorite = async (id: string, isFavorite: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent's onClick
    
    try {
      // In a real implementation, this would call your backend API
      // await toggleFavoritePrompt(id, !isFavorite);
      
      // Update locally for now
      setPrompts(prevPrompts => 
        prevPrompts.map(prompt => 
          prompt.id === id 
            ? { ...prompt, favorite: !isFavorite } 
            : prompt
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Delete a prompt
  const handleDeletePrompt = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent's onClick
    
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    try {
      // In a real implementation, this would call your backend API
      // await deletePrompt(id);
      
      // Update locally for now
      setPrompts(prevPrompts => prevPrompts.filter(prompt => prompt.id !== id));
    } catch (err) {
      console.error('Error deleting prompt:', err);
    }
  };

  // Copy prompt text to clipboard
  const handleCopyPrompt = (text: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent's onClick
    
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show toast or some indication (in a real implementation)
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort prompts
  const filteredAndSortedPrompts = () => {
    let result = [...prompts];
    
    // Apply favorites filter
    if (filter === 'favorites') {
      result = result.filter(prompt => prompt.favorite);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(prompt => 
        prompt.selectedText.toLowerCase().includes(query) ||
        prompt.generatedPrompt.toLowerCase().includes(query) ||
        prompt.platformId.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'platform') {
        comparison = a.platformId.localeCompare(b.platformId);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  };

  // Get the sorted and filtered prompts
  const displayPrompts = filteredAndSortedPrompts();

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={12} className="ml-1" />
      : <ArrowDown size={12} className="ml-1" />;
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Prompt History"
        onSettingsClick={() => {}}
        onClose={onBack}
        showBackButton={true}
        onBackClick={onBack}
      />

      <div className={`p-3 border-b ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-2 pl-8 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <svg
            className={`absolute left-2.5 top-2.5 h-4 w-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className={`flex px-3 py-2 text-xs font-medium border-b ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-1 mr-2 rounded ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`px-2 py-1 flex items-center rounded ${
            filter === 'favorites'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Star size={12} className="mr-1" />
          Favorites
        </button>
        <div className="flex-grow"></div>
        <div className="flex items-center">
          <button
            onClick={() => handleSort('date')}
            className={`px-2 py-1 mr-2 flex items-center rounded ${
              sortField === 'date'
                ? 'text-blue-500'
                : 'text-gray-500'
            }`}
          >
            <Calendar size={12} className="mr-1" />
            Date
            {renderSortIcon('date')}
          </button>
          <button
            onClick={() => handleSort('platform')}
            className={`px-2 py-1 flex items-center rounded ${
              sortField === 'platform'
                ? 'text-blue-500'
                : 'text-gray-500'
            }`}
          >
            Platform
            {renderSortIcon('platform')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : displayPrompts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {filter === 'favorites'
              ? 'No favorite prompts found. Star prompts to add them to your favorites.'
              : searchQuery
                ? 'No prompts match your search query.'
                : 'No prompts found. Start creating prompts to build your history.'}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {displayPrompts.map(prompt => (
              <div
                key={prompt.id}
                onClick={() => onSelectPrompt(prompt)}
                className={`p-3 rounded-lg border cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 hover:bg-gray-800'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                    prompt.platformId === 'chatgpt'
                      ? 'bg-green-100 text-green-800'
                      : prompt.platformId === 'claude'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {prompt.platformId}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      className={`p-1 rounded-full ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      onClick={(e) => handleCopyPrompt(prompt.generatedPrompt, e)}
                      title="Copy prompt"
                    >
                      <Copy size={14} className="text-gray-500" />
                    </button>
                    <button
                      className={`p-1 rounded-full ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      onClick={(e) => handleToggleFavorite(prompt.id, !!prompt.favorite, e)}
                      title={prompt.favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        size={14}
                        className={prompt.favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}
                      />
                    </button>
                    <button
                      className={`p-1 rounded-full ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      onClick={(e) => handleDeletePrompt(prompt.id, e)}
                      title="Delete prompt"
                    >
                      <Trash size={14} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-1">
                  <div className="text-xs font-medium text-gray-500">Original Text:</div>
                  <div className="text-xs break-words line-clamp-1 mb-1">
                    {prompt.selectedText}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500">Generated Prompt:</div>
                  <div className="text-xs break-words line-clamp-2">
                    {prompt.generatedPrompt}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500">
                    <Calendar size={10} className="mr-1" />
                    {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-1.5 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    } text-xs`}>
                      {prompt.roleId}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    } text-xs`}>
                      {prompt.templateId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptHistory;