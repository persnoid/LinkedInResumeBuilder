import { useContext } from 'react';
import { TranslationContext } from '../contexts/TranslationContext';

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguage: string;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
}

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};