// import { getIdToken } from './firebaseClient';
// import { Prompt, PromptRequest } from '../models/promptability';
// // Remove PromptAction import since it's not being used

// // API base URL - can be overridden with environment variable
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// // Default request timeout in milliseconds
// const DEFAULT_TIMEOUT = 10000;

// /**
//  * Custom error class for API errors
//  */
// export class ApiError extends Error {
//   status: number;
//   data: any;

//   constructor(message: string, status: number, data?: any) {
//     super(message);
//     this.name = 'ApiError';
//     this.status = status;
//     this.data = data;
//   }
// }

// /**
//  * Get authentication headers with Firebase token
//  */
// export async function getAuthHeaders(): Promise<Headers> {
//   try {
//     const token = await getIdToken();
//     const headers = new Headers({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     });
//     return headers;
//   } catch (error) {
//     console.error('Failed to get auth token:', error);
//     throw new ApiError('Authentication required', 401);
//   }
// }

// /**
//  * Create a fetch request with timeout
//  */
// async function fetchWithTimeout(
//   url: string, 
//   options: RequestInit, 
//   timeout: number = DEFAULT_TIMEOUT
// ): Promise<Response> {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
  
//   const response = await fetch(url, {
//     ...options,
//     signal: controller.signal
//   });
  
//   clearTimeout(id);
//   return response;
// }

// /**
//  * Generic API request function with authentication
//  */
// export async function apiRequest<T>(
//   endpoint: string, 
//   method: string = 'GET', 
//   data?: any, 
//   customHeaders?: HeadersInit,
//   timeout?: number
// ): Promise<T> {
//   try {
//     const headers = await getAuthHeaders();
    
//     // Add custom headers if provided
//     if (customHeaders) {
//       Object.entries(customHeaders).forEach(([key, value]) => {
//         headers.append(key, value);
//       });
//     }
    
//     const options: RequestInit = {
//       method,
//       headers,
//       body: data ? JSON.stringify(data) : undefined
//     };
    
//     const response = await fetchWithTimeout(
//       `${API_BASE_URL}${endpoint}`, 
//       options,
//       timeout
//     );
    
//     // Check for error responses
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);
//       throw new ApiError(
//         errorData?.detail || `API error: ${response.status}`,
//         response.status,
//         errorData
//       );
//     }
    
//     // Parse response as JSON
//     const result = await response.json();
//     return result as T;
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw error;
//     }
    
//     if (error instanceof DOMException && error.name === 'AbortError') {
//       throw new ApiError('Request timeout', 408);
//     }
    
//     console.error(`API request failed (${endpoint}):`, error);
//     throw new ApiError('Network error', 0);
//   }
// }

// /**
//  * User Profile API
//  */

// /**
//  * Get the current user's profile
//  */
// export async function getUserProfile() {
//   return apiRequest<Record<string, any>>('/profile');
// }

// /**
//  * Update the user's profile
//  */
// export async function updateUserProfile(profileData: Record<string, any>) {
//   return apiRequest<{ ok: boolean }>('/profile', 'POST', profileData);
// }

// /**
//  * Prompt API
//  */

// /**
//  * Generate a prompt based on the provided request
//  */
// export async function generatePrompt(request: PromptRequest) {
//   return apiRequest<Prompt>('/prompts/generate', 'POST', request);
// }

// /**
//  * Get all prompts for the current user
//  */
// export async function getPromptHistory() {
//   return apiRequest<Prompt[]>('/prompts');
// }

// /**
//  * Get a specific prompt by ID
//  */
// export async function getPromptById(promptId: string) {
//   return apiRequest<Prompt>(`/prompts/${promptId}`);
// }

// /**
//  * Save a prompt
//  */
// export async function savePrompt(prompt: Partial<Prompt>) {
//   return apiRequest<Prompt>('/prompts', 'POST', prompt);
// }

// /**
//  * Log an action for a prompt (e.g., copy, replace, send)
//  */
// export async function logPromptAction(promptId: string, actionType: string) {
//   return apiRequest<{ ok: boolean }>(`/prompts/${promptId}/action/${actionType}`, 'POST');
// }

// /**
//  * Update a saved prompt
//  */
// export async function updatePrompt(promptId: string, updates: Partial<Prompt>) {
//   return apiRequest<Prompt>(`/prompts/${promptId}`, 'PUT', updates);
// }

// /**
//  * Delete a saved prompt
//  */
// export async function deletePrompt(promptId: string) {
//   return apiRequest<{ ok: boolean }>(`/prompts/${promptId}`, 'DELETE');
// }

// /**
//  * Toggle favorite status for a prompt
//  */
// export async function toggleFavoritePrompt(promptId: string, isFavorite: boolean) {
//   return apiRequest<Prompt>(`/prompts/${promptId}`, 'PATCH', { favorite: isFavorite });
// }

// /**
//  * Send a prompt directly to an AI platform
//  */
// export async function sendPromptToAI(promptId: string, platformId: string) {
//   return apiRequest<{ result: string }>(`/prompts/${promptId}/send`, 'POST', { platformId });
// }

// /**
//  * Health check for the API
//  */
// export async function checkApiHealth() {
//   try {
//     const response = await fetch(`${API_BASE_URL}/health`, { 
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     });
    
//     return response.ok;
//   } catch (error) {
//     console.error('API health check failed:', error);
//     return false;
//   }
// }

// // src/utils/api.ts
// import { getIdToken } from './firebaseClient';
// import type { Prompt, PromptRequest } from '../models/promptability';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// const DEFAULT_TIMEOUT = 10000;

// export class ApiError extends Error {
//   status: number;
//   data: any;
//   constructor(message: string, status: number, data?: any) {
//     super(message);
//     this.name = 'ApiError';
//     this.status = status;
//     this.data = data;
//   }
// }

// export async function getAuthHeaders(): Promise<Headers> {
//   try {
//     const token = await getIdToken();
//     return new Headers({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     });
//   } catch (err) {
//     console.error('Failed to get auth token:', err);
//     throw new ApiError('Authentication required', 401);
//   }
// }

// async function fetchWithTimeout(
//   url: string,
//   options: RequestInit,
//   timeout: number = DEFAULT_TIMEOUT
// ): Promise<Response> {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
//   const response = await fetch(url, { ...options, signal: controller.signal });
//   clearTimeout(id);
//   return response;
// }

// export async function apiRequest<T>(
//   endpoint: string,
//   method: string = 'GET',
//   data?: any,
//   customHeaders?: HeadersInit,
//   timeout?: number
// ): Promise<T> {
//   try {
//     const headers = await getAuthHeaders();
//     if (customHeaders) {
//       Object.entries(customHeaders).forEach(([k, v]) => headers.append(k, v as string));
//     }

//     const res = await fetchWithTimeout(
//       `${API_BASE_URL}${endpoint}`,
//       { method, headers, body: data ? JSON.stringify(data) : undefined },
//       timeout
//     );

//     if (!res.ok) {
//       let errData = null;
//       try { errData = await res.json(); } catch {}
//       throw new ApiError(errData?.detail || `API error ${res.status}`, res.status, errData);
//     }

//     return (await res.json()) as T;
//   } catch (err: any) {
//     if (err.name === 'AbortError') {
//       throw new ApiError('Request timeout', 408);
//     }
//     if (err instanceof ApiError) throw err;
//     console.error('API request failed:', err);
//     throw new ApiError('Network error', 0);
//   }
// }

// /** User Profile */
// export async function getUserProfile(): Promise<Record<string, any>> {
//   return apiRequest('/profile');
// }
// export async function updateUserProfile(data: Record<string, any>) {
//   return apiRequest('/profile', 'POST', data);
// }

// /** Prompts */
// export async function generatePrompt(request: PromptRequest): Promise<Prompt> {
//   return apiRequest('/prompts/generate', 'POST', request);
// }
// export async function getPromptHistory(): Promise<Prompt[]> {
//   return apiRequest('/prompts');
// }
// export async function getPromptById(id: string): Promise<Prompt> {
//   return apiRequest(`/prompts/${id}`);
// }
// export async function savePrompt(prompt: Partial<Prompt>): Promise<Prompt> {
//   return apiRequest('/prompts', 'POST', prompt);
// }
// export async function logPromptAction(promptId: string, actionType: string) {
//   return apiRequest(`/prompts/${promptId}/action/${actionType}`, 'POST');
// }
// export async function updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
//   return apiRequest(`/prompts/${id}`, 'PUT', updates);
// }
// export async function deletePrompt(id: string): Promise<{ ok: boolean }> {
//   return apiRequest(`/prompts/${id}`, 'DELETE');
// }
// export async function toggleFavoritePrompt(id: string, fav: boolean): Promise<Prompt> {
//   return apiRequest(`/prompts/${id}`, 'PATCH', { favorite: fav });
// }
// export async function sendPromptToAI(promptId: string, platformId: string): Promise<{ result: string }> {
//   return apiRequest(`/prompts/${promptId}/send`, 'POST', { platformId });
// }
// export async function checkApiHealth(): Promise<boolean> {
//   try {
//     const res = await fetch(`${API_BASE_URL}/health`);
//     return res.ok;
//   } catch {
//     return false;
//   }
// }


// src/utils/api.ts
import { getIdToken } from './firebaseClient';
import { Prompt, PromptGenerationRequest } from '../models/promptability';

// API base URL—override with VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const DEFAULT_TIMEOUT = 10000;

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function getAuthHeaders(): Promise<Headers> {
  const headers = new Headers({ 'Content-Type': 'application/json' });

  try {
    const token = await getIdToken();

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    } else {
      // 🔹 no user logged-in → just return bare headers
      console.warn('[Promptability] no auth token – sending request anonymously');
    }
  } catch (err) {
    console.warn('[Promptability] getIdToken failed – sending request anonymously', err);
    /* keep headers as-is */
  }

  return headers;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  customHeaders?: HeadersInit,
  timeout?: number
): Promise<T> {
  try {
    const headers = await getAuthHeaders();
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([k, v]) => headers.append(k, v as string));
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}${endpoint}`,
      { method, headers, body: data ? JSON.stringify(data) : undefined },
      timeout
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new ApiError(errData?.detail || `API error: ${response.status}`, response.status, errData);
    }

    return (await response.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    console.error('Network error:', err);
    throw new ApiError('Network error', 0);
  }
}

/** User Profile */
export async function getUserProfile() {
  return apiRequest<Record<string, any>>('/profile');
}
export async function updateUserProfile(profileData: Record<string, any>) {
  return apiRequest<{ ok: boolean }>('/profile', 'POST', profileData);
}

/** Prompt endpoints */
export async function generatePrompt(req: PromptGenerationRequest) {
  return apiRequest<Prompt>('/prompts/generate', 'POST', req);
}
export async function getPromptHistory() {
  return apiRequest<Prompt[]>('/prompts');
}
export async function getPromptById(promptId: string) {
  return apiRequest<Prompt>(`/prompts/${promptId}`);
}
export async function savePrompt(prompt: Partial<Prompt>) {
  return apiRequest<Prompt>('/prompts', 'POST', prompt);
}
export async function logPromptAction(promptId: string, actionType: string) {
  return apiRequest<{ ok: boolean }>(`/prompts/${promptId}/action/${actionType}`, 'POST');
}
export async function updatePrompt(promptId: string, updates: Partial<Prompt>) {
  return apiRequest<Prompt>(`/prompts/${promptId}`, 'PUT', updates);
}
export async function deletePrompt(promptId: string) {
  return apiRequest<{ ok: boolean }>(`/prompts/${promptId}`, 'DELETE');
}
export async function toggleFavoritePrompt(promptId: string, isFavorite: boolean) {
  return apiRequest<Prompt>(`/prompts/${promptId}`, 'PATCH', { favorite: isFavorite });
}
export async function sendPromptToAI(promptId: string, platformId: string) {
  return apiRequest<{ result: string }>(`/prompts/${promptId}/send`, 'POST', { platformId });
}
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
