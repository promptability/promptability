// // src/content-script.tsx
// /// <reference types="chrome" />
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import Overlay from './components/Overlay/Overlay';
// import { hasValidSelection, getSelectedText, getPageDetails } from './utils/text-selection';
// import './styles/tailwind.css';


// // Create div for overlay
// const overlayContainer = document.createElement('div');
// overlayContainer.id = 'promptability-overlay-container';
// document.body.appendChild(overlayContainer);

// // Create root for React
// const root = createRoot(overlayContainer);

// // Initialize overlay state
// let overlayVisible = false;

// // Listen for text selection
// document.addEventListener('mouseup', handleTextSelection);
// document.addEventListener('keyup', handleTextSelection);

// // Listen for messages from popup or background script
// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === 'checkSelection') {
//     const selection = getSelectedText();
//     chrome.runtime.sendMessage({
//       action: 'selectionResult',
//       hasSelection: selection.length > 0,
//       text: selection,
//       ...getPageDetails()
//     });
//   } else if (message.action === 'showOverlay') {
//     showOverlay();
//   } else if (message.action === 'hideOverlay') {
//     hideOverlay();
//   }
// });

// // Handle text selection
// function handleTextSelection(event: MouseEvent | KeyboardEvent) {
//   // Ignore selections made within our overlay
//   if (
//     event.target instanceof Node &&
//     overlayContainer.contains(event.target)
//   ) {
//     return;
//   }

//   // Check if there's valid text selected
//   if (hasValidSelection()) {
//     showOverlay();
//   } else if (overlayVisible && event.type === 'mouseup') {
//     // Only hide on mouseup to allow interacting with the overlay
//     const target = event.target as Node;
    
//     // Don't hide if clicking inside the overlay
//     if (!overlayContainer.contains(target)) {
//       hideOverlay();
//     }
//   }
// }

// // Show the overlay with the selected text
// function showOverlay() {
//   const selectedText = getSelectedText();
  
//   if (!selectedText) {
//     return;
//   }
  
//   // Get page details
//   const { url, title } = getPageDetails();
  
//   // Render the overlay
//   root.render(
//     <Overlay 
//       selectedText={selectedText}
//       pageUrl={url}
//       pageTitle={title}
//       onClose={hideOverlay}
//     />
//   );
  
//   overlayVisible = true;
// }

// // Hide the overlay
// function hideOverlay() {
//   root.render(null);
//   overlayVisible = false;
// }

// // Add custom styles
// const style = document.createElement('style');
// style.textContent = `
//   #promptability-overlay-container {
//     position: fixed;
//     z-index: 9999;
//     top: 0;
//     left: 0;
//     width: 100%;
//     pointer-events: none;
//   }
  
//   #promptability-overlay-container > div {
//     pointer-events: auto;
//   }
// `;
// document.head.appendChild(style);

// src/content-script.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Overlay from './components/Overlay/Overlay';
import { hasValidSelection, getSelectedText, getPageDetails } from './utils/text-selection';

console.log('Promptability content script loaded');

// Create div for overlay
const overlayContainer = document.createElement('div');
overlayContainer.id = 'promptability-overlay-container';
document.body.appendChild(overlayContainer);

// Create root for React
const root = createRoot(overlayContainer);

// Initialize overlay state
let overlayVisible = false;

// Function to show the overlay
function showOverlay(selectedText?: string) {
  console.log('showOverlay called with text:', selectedText);
  
  // If no text is provided, get it from the selection
  if (!selectedText) {
    selectedText = getSelectedText();
  }
  
  if (!selectedText) {
    console.log('No text selected');
    return;
  }
  
  // Get page details
  const { url, title } = getPageDetails();
  
  console.log('Rendering overlay with:', { selectedText, url, title });
  
  // Render the overlay
  try {
    root.render(
      <Overlay 
        selectedText={selectedText}
        pageUrl={url}
        pageTitle={title}
        onClose={hideOverlay}
      />
    );
    
    overlayVisible = true;
    console.log('Overlay rendered successfully');
  } catch (error) {
    console.error('Error rendering overlay:', error);
  }
}

// Function to hide the overlay
function hideOverlay() {
  console.log('hideOverlay called');
  root.render(null);
  overlayVisible = false;
}

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', handleTextSelection);

// Handle text selection
function handleTextSelection(event: MouseEvent | KeyboardEvent) {
  console.log('handleTextSelection called');
  
  // Ignore selections made within our overlay
  if (
    event.target instanceof Node &&
    overlayContainer.contains(event.target)
  ) {
    console.log('Ignoring selection within overlay');
    return;
  }

  // Check if there's valid text selected
  if (hasValidSelection()) {
    console.log('Valid selection detected');
    // Uncomment this to show overlay automatically on selection
    // showOverlay();
  } else if (overlayVisible && event.type === 'mouseup') {
    // Only hide on mouseup to allow interacting with the overlay
    const target = event.target as Node;
    
    // Don't hide if clicking inside the overlay
    if (!overlayContainer.contains(target)) {
      console.log('Hiding overlay due to click outside');
      hideOverlay();
    }
  }
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.action === 'checkSelection') {
    const selection = getSelectedText();
    console.log('Checking selection:', selection);
    
    chrome.runtime.sendMessage({
      action: 'selectionResult',
      hasSelection: selection.length > 0,
      text: selection,
      ...getPageDetails()
    });
  } else if (message.action === 'showOverlay') {
    console.log('Received showOverlay command');
    showOverlay(message.selectedText);
    sendResponse({ success: true });
  } else if (message.action === 'hideOverlay') {
    console.log('Received hideOverlay command');
    hideOverlay();
    sendResponse({ success: true });
  }
  
  return true; // Keep channel open for async response
});

// Add test button for debugging
function addTestButton() {
  const button = document.createElement('button');
  button.textContent = 'Test Promptability';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '10px';
  button.style.background = '#2563eb';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', () => {
    console.log('Test button clicked');
    showOverlay('This is a test selection from the debug button');
  });
  
  document.body.appendChild(button);
}

// Uncomment this line to add a test button for debugging
// addTestButton();

// Add custom styles
const style = document.createElement('style');
style.textContent = `
  #promptability-overlay-container {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
  }
  
  #promptability-overlay-container > div {
    pointer-events: auto;
  }
`;
document.head.appendChild(style);

console.log('Promptability content script fully initialized');