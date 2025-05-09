import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './components/Popup/Popup';
import { AuthProvider } from './contexts/AuthContext';
import './styles/tailwind.css'; // Import Tailwind CSS

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('popup-root');
  
  if (container) {
    const root = createRoot(container);
    
    root.render(
      <React.StrictMode>
        <AuthProvider>
          <Popup />
        </AuthProvider>
      </React.StrictMode>
    );
  }
});