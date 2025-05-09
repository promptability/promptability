// This script runs in the context of web pages
// It handles text selection and shows the prompt button

let promptButton: HTMLElement | null = null;

// Create and add the floating button to the page
function createPromptButton() {
  if (promptButton) return;
  
  promptButton = document.createElement('div');
  promptButton.id = 'promptability-button';
  promptButton.innerHTML = `
    <div class="promptability-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
      </svg>
    </div>
  `;
  
  // Styles for the button
  promptButton.style.position = 'absolute';
  promptButton.style.zIndex = '9999';
  promptButton.style.background = '#4f46e5';
  promptButton.style.color = 'white';
  promptButton.style.borderRadius = '50%';
  promptButton.style.width = '32px';
  promptButton.style.height = '32px';
  promptButton.style.display = 'flex';
  promptButton.style.alignItems = 'center';
  promptButton.style.justifyContent = 'center';
  promptButton.style.cursor = 'pointer';
  promptButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  
  promptButton.addEventListener('click', handlePromptButtonClick);
  document.body.appendChild(promptButton);
}

// Remove the button from the page
function removePromptButton() {
  if (promptButton && promptButton.parentNode) {
    promptButton.parentNode.removeChild(promptButton);
    promptButton = null;
  }
}

// Position the button near the selected text
function positionPromptButton(selection: Selection) {
  if (!promptButton) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Position above and to the right of selection
  promptButton.style.left = `${window.scrollX + rect.right}px`;
  promptButton.style.top = `${window.scrollY + rect.top - 40}px`;
}

// Handle clicks on the prompt button
function handlePromptButtonClick() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  
  const selectedText = selection.toString().trim();
  if (!selectedText) return;
  
  // Send message to open popup with selected text
  chrome.runtime.sendMessage({
    action: 'openPopup',
    selectedText: selectedText,
    pageUrl: window.location.href,
    pageTitle: document.title
  });
}

// Listen for text selection events
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  
  if (!selection || selection.isCollapsed) {
    removePromptButton();
    return;
  }
  
  const selectedText = selection.toString().trim();
  if (selectedText) {
    createPromptButton();
    positionPromptButton(selection);
  } else {
    removePromptButton();
  }
});

// Remove button when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (promptButton && e.target !== promptButton) {
    removePromptButton();
  }
});

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'closePopup') {
    removePromptButton();
  }
});