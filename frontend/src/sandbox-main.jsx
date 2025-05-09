// src/sandbox-main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import Sandbox from './Sandbox';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('sandbox-root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Sandbox />
    </AuthProvider>
  </React.StrictMode>
);