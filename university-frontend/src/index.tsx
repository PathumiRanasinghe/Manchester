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
     <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });

