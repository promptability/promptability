// src/utils/text-selection.ts

/**
 * Get the currently selected text on the page
 */
export function getSelectedText(): string {
    const selection = window.getSelection();
    if (!selection) return '';
    
    return selection.toString().trim();
  }
  
  /**
   * Check if there is a valid text selection
   */
  export function hasValidSelection(): boolean {
    const selection = window.getSelection();
    
    if (!selection) return false;
    if (selection.isCollapsed) return false;
    
    const text = selection.toString().trim();
    return text.length > 0;
  }
  
  /**
   * Get position for overlay near the selection
   */
  export function getSelectionPosition(): { top: number; left: number } {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      return { top: 0, left: 0 };
    }
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position overlay above the selection
    const top = rect.top + window.scrollY - 10; // 10px above selection
    const left = rect.left + window.scrollX + (rect.width / 2); // Centered horizontally
    
    return { top, left };
  }
  
  /**
   * Get details about the current page
   */
  export function getPageDetails(): { url: string; title: string } {
    return {
      url: window.location.href,
      title: document.title
    };
  }
  
  /**
   * Replace selected text with new text
   * Used for replacing selected text with generated prompt
   */
  export function replaceSelectedText(newText: string): boolean {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      return false;
    }
    
    const range = selection.getRangeAt(0);
    
    // Check if we can edit this content (it must be in an editable element)
    const container = range.commonAncestorContainer;
    const isEditable = isEditableElement(container);
    
    if (!isEditable) {
      return false;
    }
    
    // Replace the text
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    
    // Update selection
    selection.removeAllRanges();
    
    return true;
  }
  
  /**
   * Check if an element is editable
   */
  function isEditableElement(node: Node): boolean {
    // Get the actual element (could be a text node)
    let element: Element | null = null;
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      element = node as Element;
    } else if (node.parentElement) {
      element = node.parentElement;
    }
    
    if (!element) return false;
    
    // Check if it's contentEditable
    if (element.getAttribute('contenteditable') === 'true') {
      return true;
    }
    
    // Check if it's an input or textarea
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
      const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
      return !inputElement.disabled && !inputElement.readOnly;
    }
    
    // Check if it's within an editable element
    return element.parentElement ? isEditableElement(element.parentElement) : false;
  }
  
  /**
   * Copy text to clipboard
   */
  export async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }