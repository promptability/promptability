import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export function useToast(duration = 2000) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success'
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({
      visible: true,
      message,
      type
    });

    // Hide toast after duration
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, duration);

    // Clear timeout on component unmount
    return () => clearTimeout(timer);
  }, [duration]);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
}