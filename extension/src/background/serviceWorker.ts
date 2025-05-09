// This is the background service worker for the extension

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.action === 'openPopup') {
    chrome.storage.local.set({
      selectedText: message.selectedText,
      pageUrl: message.pageUrl,
      pageTitle: message.pageTitle,
      timestamp: Date.now(),
    });
    chrome.action.openPopup();
  }
});
  
  // Set up context menu
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'promptabilityMenu',
      title: 'Generate AI Prompt',
      contexts: ['selection']
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'promptabilityMenu' && info.selectionText) {
      // Store the selected text
      chrome.storage.local.set({ 
        selectedText: info.selectionText,
        pageUrl: tab?.url || '',
        pageTitle: tab?.title || '',
        timestamp: Date.now()
      });
      
      // Open the extension popup
      chrome.action.openPopup();
    }
  });