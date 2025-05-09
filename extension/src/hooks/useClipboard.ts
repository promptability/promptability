import { useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard) {
        // Modern API (secure contexts like HTTPS or localhost)
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or HTTP contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (!successful) {
          throw new Error('Failed to copy text');
        }
      }
      
      setCopied(true);
      setError(null);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return true;
    } catch (err: any) {
      console.error('Error copying to clipboard:', err);
      setError(err.message || 'Failed to copy to clipboard');
      setCopied(false);
      return false;
    }
  };

  return { copied, error, copyToClipboard };
}