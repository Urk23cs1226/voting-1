import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is the standard entry point for a Create React App project.
// It finds the 'root' div in public/index.html and renders the
// main App component inside it.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);