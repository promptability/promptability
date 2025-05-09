// src/types/prompt.ts

/**
 * Formatting options for prompt generation
 */
export interface FormattingOptions {
    appendInstructions: boolean;
    shouldTruncate: boolean;
    [key: string]: boolean;
  }
  
  /**
   * Request payload for prompt generation
   */
  export interface PromptGenerationRequest {
    selectedText: string;
    platformId: string;
    formattingOptions: FormattingOptions;
    roleId?: string;
    industryId?: string;
    templateId?: string;
    pageUrl?: string;
    pageTitle?: string;
    subcategoryId?: string | null;
  }
  
  /**
   * Action types for prompt usage tracking
   */
  export type PromptActionType = 'copy' | 'replace' | 'send';
  
  /**
   * Prompt action history item
   */
  export interface PromptAction {
    id: string;
    promptId: string;
    userId: string;
    actionType: PromptActionType;
    platformId?: string;
    timestamp: string; // ISO date string
  }
  
  /**
   * Complete prompt model
   */
  export interface Prompt {
    id: string;
    userId: string;
    selectedText: string;
    generatedPrompt: string;
    roleId: string;
    industryId: string;
    subcategoryId?: string | null;
    templateId: string;
    platformId: string;
    platformFormatted: boolean;
    formattingOptions: FormattingOptions;
    pageUrl: string;
    pageTitle: string;
    createdAt: string; // ISO date string
    favorite: boolean;
    tags: string[];
    usageCount: number;
    lastUsedAt?: string | null; // ISO date string
    actionHistory: PromptAction[];
  }
  
  /**
   * Role model for prompt contextualization
   */
  export interface Role {
    id: string;
    name: string;
    description: string;
    prefix: string;
    emoji?: string;
    order: number;
    isActive: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  /**
   * Industry model for prompt contextualization
   */
  export interface Industry {
    id: string;
    name: string;
    description: string;
    emoji?: string;
    order: number;
    isActive: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  /**
   * Platform options (ChatGPT, Claude, Gemini, etc.)
   */
  export interface Platform {
    id: string;
    name: string;
    icon: string;
    description: string;
    order: number;
    isActive: boolean;
  }
  
  /**
   * Default platforms available in the app
   */
  export const DEFAULT_PLATFORMS: Platform[] = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      icon: 'openai-logo.svg',
      description: 'OpenAI\'s ChatGPT (3.5 or 4)',
      order: 1,
      isActive: true
    },
    {
      id: 'claude',
      name: 'Claude',
      icon: 'anthropic-logo.svg',
      description: 'Anthropic\'s Claude AI assistant',
      order: 2,
      isActive: true
    },
    {
      id: 'gemini',
      name: 'Gemini',
      icon: 'google-logo.svg',
      description: 'Google\'s Gemini AI',
      order: 3,
      isActive: true
    }
  ];
  
  /**
   * User profile model
   */
  export interface UserProfile {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role?: string;
    industry?: string;
    createdAt: string; // ISO date string
    lastLoginAt: string; // ISO date string
  }