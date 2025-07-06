import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TranslationProvider } from './contexts/TranslationContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </AuthProvider>
  </StrictMode>
);