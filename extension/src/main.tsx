// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  
  if (root) {
    // Check if we're in a Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // Get stored selected text (from content script)
      chrome.storage.local.get(['selectedText', 'pageUrl', 'pageTitle'], (data) => {
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <App initialData={data} />
          </React.StrictMode>
        );
      });
    } else {
      // Not in a Chrome extension environment (e.g., development mode)
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App initialData={{}} />
        </React.StrictMode>
      );
    }
  }
});