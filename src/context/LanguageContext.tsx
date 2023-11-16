import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageType = {
  language: string;
  setEN: (language: string) => void;
  setES: (newTheme: string) => void;
  setGE: (newTheme: string) => void;
  setIT: (newTheme: string) => void;
  setCH: (newTheme: string) => void;
  t: (key: any, key1?: any) => string;
};

const Context = createContext<LanguageType>({} as LanguageType);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    localStorage.setItem('language', language);
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const currentLanguage = localStorage.getItem('language');
    if (currentLanguage) {
      setLanguage(currentLanguage);
    }
  }, []);

  const setEN = (language: string) => {
    changeLanguage(language);
  };
  const setES = (language: string) => {
    changeLanguage(language);
  };

  const setGE = (language: string) => {
    changeLanguage(language);
  };

  const setIT = (language: string) => {
    changeLanguage(language);
  };

  const setCH = (language: string) => {
    changeLanguage(language);
  };

  return (
    <Context.Provider
      value={{ language, setEN, setES, setGE, setIT, setCH, t }}
    >
      {children}
    </Context.Provider>
  );
};

export default LanguageProvider;

export const useLanguage = () => useContext(Context);
