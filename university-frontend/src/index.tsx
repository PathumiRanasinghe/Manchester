import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initKeycloak } from './keycloak';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

initKeycloak({ onLoad: 'login-required', pkceMethod: 'S256' })
  .then(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch(err => {
    console.error('Keycloak init failed', err);
    root.render(
      <div className="p-8 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p>Failed to initialize authentication. Please try again later.</p>
      </div>
    );
  });

