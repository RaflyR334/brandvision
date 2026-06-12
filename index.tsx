import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import App from './App';
import './lib/i18n';
import { mockBackend } from './lib/mock-backend';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Global interception to enable/disable toast based on user settings
try {
  const keys: ('success' | 'error' | 'message' | 'info' | 'warning')[] = ['success', 'error', 'message', 'info', 'warning'];
  keys.forEach((key) => {
    const original = toast[key];
    if (typeof original === 'function') {
      // @ts-ignore
      toast[key] = (...args: any[]) => {
        const enabled = localStorage.getItem('toast_notifications_enabled') !== 'false';
        if (enabled) {
          // @ts-ignore
          return original(...args);
        }
        return '';
      };
    }
  });
} catch (err) {
  console.error("Failed to wrap toast functions", err);
}

// Seed initial data
mockBackend.seedData();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* @ts-ignore - next-themes type mismatch with React 19 */}
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
