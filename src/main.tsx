import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TranslationProvider } from './contexts/TranslationContext';
import { AuthProvider } from './contexts/AuthContext';
import { ResumeDataProvider } from './contexts/ResumeDataContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ResumeDataProvider>
        <TranslationProvider>
          <App />
        </TranslationProvider>
      </ResumeDataProvider>
    </AuthProvider>
  </StrictMode>
);