import React, { useState, useEffect } from 'react';
import Header from './Header';
import { translateText } from '../utils/translateText';

interface LayoutProps {
  children: React.ReactNode;
  showLoginButton?: boolean;
  showRegisterButton?: boolean;
}

const EN_TEXT = {
  footer: 'Creating Digital Catalogs with Voice',
};

const Layout: React.FC<LayoutProps> = ({
  children,
  showLoginButton = true,
  showRegisterButton = true,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translated, setTranslated] = useState(EN_TEXT);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    window.dispatchEvent(new CustomEvent('app-language-change', { detail: { language: code } }));
  };

  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslated(EN_TEXT);
      return;
    }
    setLoading(true);
    const translateAll = async () => {
      const entries = Object.entries(EN_TEXT);
      const translatedEntries = await Promise.all(
        entries.map(async ([key, value]) => {
          try {
            const t = await translateText(value, 'English', currentLanguage);
            return [key, t];
          } catch {
            return [key, value];
          }
        })
      );
      setTranslated(Object.fromEntries(translatedEntries));
      setLoading(false);
    };
    translateAll();
  }, [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header 
        showLoginButton={showLoginButton} 
        showRegisterButton={showRegisterButton} 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <main className="flex-grow w-full overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-white shadow-inner py-6 w-full">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs mr-2">
              S2S
            </div>
            <span className="text-gradient font-bold text-lg">say2sale</span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} say2sale - {loading ? '...' : translated.footer}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 