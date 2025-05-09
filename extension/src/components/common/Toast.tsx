import React from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className="toast">
    {message}
  </div>
);

export default Toast;
