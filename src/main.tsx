import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite dev-server HMR websocket disconnection alerts in sandboxed iframe environment
if (typeof window !== 'undefined') {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event?.reason;
      const reasonStr = (
        (reason && (reason.message || reason.stack || reason.name)) ||
        String(reason || '')
      ).toLowerCase();
      if (
        reasonStr.includes('websocket') ||
        reasonStr.includes('closed without opened') ||
        reasonStr.includes('failed to connect to websocket')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      const errStr = (
        event?.message ||
        event?.error?.message ||
        event?.error?.stack ||
        String(event?.error || '')
      ).toLowerCase();
      if (
        errStr.includes('websocket') ||
        errStr.includes('closed without opened') ||
        errStr.includes('failed to connect to websocket')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
