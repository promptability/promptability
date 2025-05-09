import { useState, useEffect } from 'react';

// Detect and manage text selection on the page
export function useSelection() {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [isSelectionActive, setIsSelectionActive] = useState(false);

  // Check for selection on mouseup
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setIsSelectionActive(false);
        setSelectionRect(null);
        return;
      }

      const text = selection.toString().trim();
      if (!text) {
        setIsSelectionActive(false);
        setSelectionRect(null);
        return;
      }

      setSelectedText(text);
      setIsSelectionActive(true);

      // Get selection coordinates
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionRect(rect);
    };

    // Clear selection when clicking elsewhere
    const handleMouseDown = (e: MouseEvent) => {
      // Skip if clicking on our own button/UI
      if ((e.target as HTMLElement).closest('.promptability-ui')) {
        return;
      }
      
      setIsSelectionActive(false);
      setSelectionRect(null);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setSelectedText('');
    setIsSelectionActive(false);
    setSelectionRect(null);
  };

  return {
    selectedText,
    selectionRect,
    isSelectionActive,
    clearSelection
  };
}