// import axios from 'axios';

// // Get API base URL from env, fallback to localhost if missing
// const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// // Create the axios instance
// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Utility to fetch token from chrome.storage.local
// const getToken = () =>
//   new Promise((resolve) => {
//     chrome.storage.local.get(['userToken'], (result) => {
//       resolve(result.userToken || null);
//     });
//   });

// // Add request interceptor to inject Bearer token
// api.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn('No token found in chrome.storage.local');
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ==================== API FUNCTIONS ====================

// /**
//  * Generate a new prompt (POST /prompts/generate)
//  * @param {Object} promptData - Payload for prompt generation (PromptGenerationRequest)
//  * @returns {Promise<Object>} - The generated prompt
//  */
// export const generatePrompt = async (promptData) => {
//   try {
//     const response = await api.post('/prompts/generate', promptData);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error generating prompt:', error.response?.data || error);
//     throw error;
//   }
// };

// /**
//  * Log an action for a specific prompt (POST /prompts/{prompt_id}/action/{action_type})
//  * @param {string} promptId - The prompt ID
//  * @param {string} actionType - The type of action (e.g., 'copy', 'save')
//  * @returns {Promise<Object>}
//  */
// export const logPromptAction = async (promptId, actionType) => {
//   try {
//     const response = await api.post(`/prompts/${promptId}/action/${actionType}`);
//     return response.data;
//   } catch (error) {
//     console.error(`❌ Error logging action (${actionType}):`, error.response?.data || error);
//     throw error;
//   }
// };

// /**
//  * Fetch all saved prompts (GET /prompts)
//  * @returns {Promise<Array>}
//  */
// export const getSavedPrompts = async () => {
//   try {
//     const response = await api.get('/prompts');
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error fetching saved prompts:', error.response?.data || error);
//     throw error;
//   }
// };

// /**
//  * Get a specific prompt by its ID (GET /prompts/{prompt_id})
//  * @param {string} promptId
//  * @returns {Promise<Object>}
//  */
// export const getPrompt = async (promptId) => {
//   try {
//     const response = await api.get(`/prompts/${promptId}`);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error fetching prompt:', error.response?.data || error);
//     throw error;
//   }
// };

// /**
//  * Get the current user's profile (GET /profile)
//  * @returns {Promise<Object>}
//  */
// export const getUserProfile = async () => {
//   try {
//     const response = await api.get('/profile');
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error fetching user profile:', error.response?.data || error);
//     throw error;
//   }
// };

// /**
//  * Create or update the user profile (POST /profile)
//  * @param {Object} profileData - Must match UserProfileBody model
//  * @returns {Promise<Object>}
//  */
// export const updateUserProfile = async (profileData) => {
//   try {
//     const response = await api.post('/profile', profileData);
//     return response.data;
//   } catch (error) {
//     console.error('❌ Error updating user profile:', error.response?.data || error);
//     throw error;
//   }
// };

// export default {
//   generatePrompt,
//   logPromptAction,
//   getSavedPrompts,
//   getPrompt,
//   getUserProfile,
//   updateUserProfile,
// };

import axios from 'axios';

// Get API base URL from env, fallback to localhost if missing
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

console.debug('🔧 Axios baseURL set to:', baseURL);

// Create the axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility to fetch token from chrome.storage.local
const getToken = () =>
  new Promise((resolve) => {
    chrome.storage.local.get(['userToken'], (result) => {
      const token = result.userToken || null;
      console.debug('🔑 Token retrieved from chrome.storage.local:', token ? '(exists)' : '(null)');
      resolve(token);
    });
  });

// Add request interceptor to inject Bearer token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug(`➡️ Sending request to ${config.url} with token`);
    } else {
      console.warn(`⚠️ No token found; request to ${config.url} will be unauthenticated`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Axios request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Centralized error debug function
const debugError = (action, error) => {
  if (error.response) {
    console.error(`❌ ${action} failed with status ${error.response.status}:`, error.response.data);
  } else if (error.request) {
    console.error(`❌ ${action} failed: No response received`, error.request);
  } else {
    console.error(`❌ ${action} setup error:`, error.message);
  }
};

// ==================== API FUNCTIONS ====================

/**
 * Generate a new prompt (POST /prompts/generate)
 * @param {Object} promptData - Payload for prompt generation (PromptGenerationRequest)
 * @returns {Promise<Object>} - The generated prompt
 */
export const generatePrompt = async (promptData) => {
  console.debug('🛠️ generatePrompt() called with:', promptData);
  try {
    const response = await api.post('/prompts/generate', promptData);
    console.debug('✅ generatePrompt() success:', response.data);
    return response.data;
  } catch (error) {
    debugError('generatePrompt()', error);
    throw error;
  }
};

/**
 * Log an action for a specific prompt (POST /prompts/{prompt_id}/action/{action_type})
 * @param {string} promptId - The prompt ID
 * @param {string} actionType - The type of action (e.g., 'copy', 'save')
 * @returns {Promise<Object>}
 */
export const logPromptAction = async (promptId, actionType) => {
  console.debug(`🛠️ logPromptAction() called with promptId=${promptId}, actionType=${actionType}`);
  try {
    const response = await api.post(`/prompts/${promptId}/action/${actionType}`);
    console.debug('✅ logPromptAction() success:', response.data);
    return response.data;
  } catch (error) {
    debugError(`logPromptAction(${actionType})`, error);
    throw error;
  }
};

/**
 * Fetch all saved prompts (GET /prompts)
 * @returns {Promise<Array>}
 */
export const getSavedPrompts = async () => {
  console.debug('🛠️ getSavedPrompts() called');
  try {
    const response = await api.get('/prompts');
    console.debug('✅ getSavedPrompts() success:', response.data);
    return response.data;
  } catch (error) {
    debugError('getSavedPrompts()', error);
    throw error;
  }
};

/**
 * Get a specific prompt by its ID (GET /prompts/{prompt_id})
 * @param {string} promptId
 * @returns {Promise<Object>}
 */
export const getPrompt = async (promptId) => {
  console.debug(`🛠️ getPrompt() called with promptId=${promptId}`);
  try {
    const response = await api.get(`/prompts/${promptId}`);
    console.debug('✅ getPrompt() success:', response.data);
    return response.data;
  } catch (error) {
    debugError(`getPrompt(${promptId})`, error);
    throw error;
  }
};

/**
 * Get the current user's profile (GET /profile)
 * @returns {Promise<Object>}
 */
export const getUserProfile = async () => {
  console.debug('🛠️ getUserProfile() called');
  try {
    const response = await api.get('/profile');
    console.debug('✅ getUserProfile() success:', response.data);
    return response.data;
  } catch (error) {
    debugError('getUserProfile()', error);
    throw error;
  }
};

/**
 * Create or update the user profile (POST /profile)
 * @param {Object} profileData - Must match UserProfileBody model
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
  console.debug('🛠️ updateUserProfile() called with:', profileData);
  try {
    const response = await api.post('/profile', profileData);
    console.debug('✅ updateUserProfile() success:', response.data);
    return response.data;
  } catch (error) {
    debugError('updateUserProfile()', error);
    throw error;
  }
};

export default {
  generatePrompt,
  logPromptAction,
  getSavedPrompts,
  getPrompt,
  getUserProfile,
  updateUserProfile,
};