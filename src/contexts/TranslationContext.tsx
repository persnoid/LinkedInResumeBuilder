import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguage: string;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const availableLanguages = ['en']; // Can be extended with more languages

  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage]);

  const loadTranslations = async (language: string) => {
    try {
      // Dynamic import of translation files
      const translationModule = await import(`../locales/${language}.json`);
      setTranslations(translationModule.default);
    } catch (error) {
      console.error(`Failed to load translations for language: ${language}`, error);
      // Fallback to English if the language file doesn't exist
      if (language !== 'en') {
        try {
          const fallbackModule = await import('../locales/en.json');
          setTranslations(fallbackModule.default);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations', fallbackError);
        }
      }
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    // Navigate through nested object structure
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key if translation is not found (useful for debugging)
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    // If the final value is not a string, return the key
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }

    // Replace parameters in the translation string
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const setLanguage = (language: string) => {
    if (availableLanguages.includes(language)) {
      setCurrentLanguage(language);
      // Optionally save to localStorage
      localStorage.setItem('preferred-language', language);
    } else {
      console.warn(`Language not available: ${language}`);
    }
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const contextValue: TranslationContextType = {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};