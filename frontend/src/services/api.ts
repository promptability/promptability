// src/services/api.ts
import { PromptGenerationRequest, Prompt } from '../types/prompt';
import { getAuth } from 'firebase/auth';

// Base API URL - should come from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://promptability-api.vercel.app/api';

/**
 * Get authentication token for API requests
 */
async function getAuthToken(): Promise<string> {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  return currentUser.getIdToken();
}

/**
 * Base API request function with authentication
 */
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  try {
    const token = await getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API service for prompt-related operations
 */
export const promptService = {
  /**
   * Generate a prompt using the selected text and options
   */
  generatePrompt: async (request: PromptGenerationRequest): Promise<Prompt> => {
    return apiRequest<Prompt>('/prompts/generate', 'POST', request);
  },
  
  /**
   * Log a prompt action (copy, replace, send)
   */
  logAction: async (promptId: string, actionType: string): Promise<{ ok: boolean }> => {
    return apiRequest<{ ok: boolean }>(`/prompts/${promptId}/action/${actionType}`, 'POST');
  },
  
  /**
   * Get all prompts for the current user
   */
  getPrompts: async (): Promise<Prompt[]> => {
    return apiRequest<Prompt[]>('/prompts');
  },
  
  /**
   * Get a specific prompt by ID
   */
  getPrompt: async (promptId: string): Promise<Prompt> => {
    return apiRequest<Prompt>(`/prompts/${promptId}`);
  }
};

/**
 * API service for user profile operations
 */
export const userService = {
  /**
   * Get the current user's profile
   */
  getProfile: async () => {
    return apiRequest('/user/profile');
  },
  
  /**
   * Update the user's profile
   */
  updateProfile: async (profileData: any) => {
    return apiRequest('/user/profile', 'PUT', profileData);
  }
};