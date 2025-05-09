// background.js - SIMPLIFIED VERSION
console.log('Simplified background script loaded');

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Create simple test menu
  chrome.contextMenus.create({
    id: 'test-selection',
    title: 'Test Selection',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Menu clicked:', info.menuItemId);
  
  if (info.menuItemId === 'test-selection' && tab?.id) {
    // Use executeScript instead of messaging for reliability
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (selectedText) => {
        // Create a simple overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.background = 'white';
        overlay.style.border = '2px solid blue';
        overlay.style.padding = '20px';
        overlay.style.zIndex = '10000';
        overlay.style.maxWidth = '80%';
        overlay.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        
        overlay.innerHTML = `
          <h2 style="margin-top: 0; color: blue;">Test Overlay</h2>
          <p>Selected text:</p>
          <div style="background: #f5f5f5; padding: 10px; margin-bottom: 10px;">${selectedText}</div>
          <button id="close-btn" style="padding: 5px 10px;">Close</button>
        `;
        
        document.body.appendChild(overlay);
        
        document.getElementById('close-btn').addEventListener('click', () => {
          overlay.remove();
        });
      },
      args: [info.selectionText || 'No text selected']
    });
  }
});