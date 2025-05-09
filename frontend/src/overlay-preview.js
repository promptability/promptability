// src/overlay-preview.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import Overlay from './components/Overlay/Overlay';
import './styles/tailwind.css';

document.querySelector('.selectable').addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    const selectedText = selection.toString();
    const root = createRoot(document.getElementById('overlay-root'));
    root.render(
      React.createElement(Overlay, {
        selectedText: selectedText,
        pageUrl: "https://example.com",
        pageTitle: "Example Page",
        onClose: () => root.unmount()
      })
    );
  }
});