import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler to suppress harmless HTML5 video interruption errors in the dev overlay
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'NotAllowedError') {
    event.preventDefault();
  }
  if (event.reason && event.reason.message && event.reason.message.includes('play() request was interrupted')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <App />
);
