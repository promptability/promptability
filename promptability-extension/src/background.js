// Background script for Promptability AI Chrome Extension

// Initialize context menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "promptabilityContextMenu",
      title: "Generate AI Prompt with Promptability",
      contexts: ["selection"]
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "promptabilityContextMenu" && info.selectionText) {
      // Send selected text to popup or open popup with this text
      chrome.storage.local.set({ selectedText: info.selectionText, pageUrl: info.pageUrl });
      
      // Open the popup
      chrome.action.openPopup();
    }
  });
  
  // Listen for messages from content script or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TEXT_SELECTED") {
      // Store the selected text in local storage
      chrome.storage.local.set({ 
        selectedText: message.payload.selectedText,
        pageUrl: message.payload.pageUrl,
        pageTitle: message.payload.pageTitle
      });
      sendResponse({ status: "success" });
    }
    
    // Always return true for async responses
    return true;
  });