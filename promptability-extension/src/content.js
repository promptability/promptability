// Content script for Promptability AI Chrome Extension

// Store the last selected text
let lastSelectedText = "";

// Function to handle text selection
function handleTextSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  // Only proceed if there's selected text and it's different from the last one
  if (selectedText && selectedText !== lastSelectedText) {
    lastSelectedText = selectedText;
    
    // Show a floating button near the selection if needed
    if (selectedText.length > 10) {
      showPromptabilityButton(selection);
    }
    
    // Send selected text to background script
    chrome.runtime.sendMessage({
      type: "TEXT_SELECTED",
      payload: {
        selectedText,
        pageUrl: window.location.href,
        pageTitle: document.title
      }
    });
  }
}

// Function to show a floating button near text selection
function showPromptabilityButton(selection) {
  // Remove any existing buttons
  removePromptabilityButton();
  
  // Create button element
  const button = document.createElement('div');
  button.id = 'promptability-button';
  button.innerText = '✨ Promptability';
  button.style.cssText = `
    position: absolute;
    background: #3b82f6;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;
  
  // Position the button near the selection
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  button.style.top = `${window.scrollY + rect.bottom + 10}px`;
  button.style.left = `${window.scrollX + rect.left}px`;
  
  // Add click event to button
  button.addEventListener('click', () => {
    // Open extension popup
    chrome.runtime.sendMessage({
      type: "OPEN_POPUP",
      payload: {
        selectedText: selection.toString().trim(),
        pageUrl: window.location.href,
        pageTitle: document.title
      }
    });
    
    removePromptabilityButton();
  });
  
  // Add button to page
  document.body.appendChild(button);
  
  // Remove button after 5 seconds
  setTimeout(removePromptabilityButton, 5000);
}

// Function to remove the button
function removePromptabilityButton() {
  const existingButton = document.getElementById('promptability-button');
  if (existingButton) {
    existingButton.remove();
  }
}

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keyup', (e) => {
  // Detect if selection was made with keyboard (e.g., Shift+Arrow)
  if (e.shiftKey && (e.key.startsWith('Arrow') || e.key === 'End' || e.key === 'Home')) {
    handleTextSelection();
  }
});

// Listen for messages from background or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SELECTED_TEXT") {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    sendResponse({
      selectedText,
      pageUrl: window.location.href,
      pageTitle: document.title
    });
  }
  
  // Always return true for async responses
  return true;
});