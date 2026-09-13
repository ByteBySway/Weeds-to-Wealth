import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite dev-server HMR websocket disconnection alerts in sandboxed iframe environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event?.reason?.message || String(event?.reason || '');
    if (
      reasonStr.includes('WebSocket') ||
      reasonStr.includes('closed without opened') ||
      reasonStr.includes('failed to connect to websocket')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errStr = event?.message || String(event?.error || '');
    if (
      errStr.includes('WebSocket') ||
      errStr.includes('closed without opened') ||
      errStr.includes('failed to connect to websocket')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
