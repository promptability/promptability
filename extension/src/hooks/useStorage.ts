import { useState, useEffect } from 'react';

/**
 * Chrome storage hook that works with both local and sync storage
 * 
 * @param key Storage key
 * @param initialValue Default value if not found in storage
 * @param storageType 'local' or 'sync' storage
 * @returns Storage value state and functions
 */
export function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: 'local' | 'sync' = 'local'
) {
  // Create state to store value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  // Get from storage on mount
  useEffect(() => {
    const getStoredValue = async () => {
      try {
        // Check if Chrome API is available
        if (typeof chrome !== 'undefined' && chrome.storage) {
          // Get from Chrome storage
          const storage = storageType === 'local' ? chrome.storage.local : chrome.storage.sync;
          
          storage.get(key, (items: { [key: string]: any }) => {
            // If value exists, update state
            if (items[key] !== undefined) {
              setStoredValue(items[key]);
            }
            setLoading(false);
          });
        } else {
          // Fallback to localStorage for development
          const item = localStorage.getItem(key);
          if (item) {
            setStoredValue(JSON.parse(item));
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error getting ${key} from storage:`, error);
        setLoading(false);
      }
    };

    getStoredValue();
  }, [key, storageType]);

  // Store value in storage
  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      // Allow function updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update state
      setStoredValue(valueToStore);
      
      // Check if Chrome API is available
      if (typeof chrome !== 'undefined' && chrome.storage) {
        // Update Chrome storage
        const storage = storageType === 'local' ? chrome.storage.local : chrome.storage.sync;
        
        await new Promise<void>((resolve) => {
          storage.set({ [key]: valueToStore }, () => {
            resolve();
          });
        });
      } else {
        // Fallback to localStorage for development
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  };

  // Remove value from storage
  const removeValue = async () => {
    try {
      // Update state
      setStoredValue(initialValue);
      
      // Check if Chrome API is available
      if (typeof chrome !== 'undefined' && chrome.storage) {
        // Remove from Chrome storage
        const storage = storageType === 'local' ? chrome.storage.local : chrome.storage.sync;
        
        await new Promise<void>((resolve) => {
          storage.remove(key, () => {
            resolve();
          });
        });
      } else {
        // Fallback to localStorage for development
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  };

  return { value: storedValue, setValue, removeValue, loading };
}