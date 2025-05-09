// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Popup from "./components/Popup/Popup";
import { AuthProvider } from "./contexts/AuthContext";

// This is just for development/preview purposes
// The actual extension uses popup.tsx and content-script.tsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Popup />
    </AuthProvider>
  </StrictMode>
);