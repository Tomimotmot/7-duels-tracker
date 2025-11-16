import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Pfad zu Ihrer App-Komponente

// Erstellen Sie den Root-Container (ID muss in Ihrer index.html existieren, z.B. <div id="root">)
const container = document.getElementById('root');
const root = createRoot(container);

// Rendern Sie die App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);