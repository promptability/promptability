import React, { useEffect } from 'react';

const Toast = ({ message, isVisible, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="absolute bg-black bg-opacity-75 text-white text-xs px-3 py-1 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      {message}
    </div>
  );
};

export default Toast;