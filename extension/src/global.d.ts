// Chrome extension API types
/// <reference types="chrome"/>

// Ensure TypeScript recognizes the chrome namespace
declare namespace chrome {
    export const storage: {
      local: {
        get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
        set(items: object, callback?: () => void): void;
        remove(keys: string | string[], callback?: () => void): void;
        clear(callback?: () => void): void;
      };
      sync: {
        get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
        set(items: object, callback?: () => void): void;
        remove(keys: string | string[], callback?: () => void): void;
        clear(callback?: () => void): void;
      };
    };
  }
  
  // Add Chrome API to the global Window interface
  interface Window {
    chrome: typeof chrome;
  }