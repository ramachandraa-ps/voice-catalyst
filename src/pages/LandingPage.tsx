import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { translateText } from '../utils/translateText';

const EN_TEXT = {
  title: 'Create Digital Catalogs with Voice',
  subtitle: 'Transform your products into a digital catalog using just your voice. Simple, fast, and designed for local businesses.',
  getStarted: 'Get Started',
  login: 'Login',
  howItWorks: 'How It Works',
  step1Title: 'Speak Your Products',
  step1Desc: 'Simply describe your product in your language using the voice input',
  step2Title: 'Instant Catalog',
  step2Desc: 'We automatically create product listings with descriptions in multiple languages',
  step3Title: 'Share with QR Code',
  step3Desc: 'Get a QR code to share your digital catalog with customers instantly',
  ctaTitle: 'Ready to Digitize Your Business?',
  ctaDesc: 'Join thousands of local businesses already using say2sale',
  ctaBtn: 'Create Your Catalog Now',
};

const LandingPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translated, setTranslated] = useState(EN_TEXT);
  const [loading, setLoading] = useState(false);

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

  // Listen to language change from Layout via custom event
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && e.detail.language) setCurrentLanguage(e.detail.language);
    };
    window.addEventListener('app-language-change', handler);
    return () => window.removeEventListener('app-language-change', handler);
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
          <div className="w-full max-w-xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {loading ? '...' : translated.title}
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              {loading ? '...' : translated.subtitle}
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
              <Link 
                to="/register" 
                className="btn btn-primary text-center px-8 py-3"
              >
                {loading ? '...' : translated.getStarted}
              </Link>
              <Link 
                to="/login" 
                className="btn btn-secondary text-center px-8 py-3"
              >
                {loading ? '...' : translated.login}
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md mt-10">
            <div className="h-1 w-20 bg-green-500 mx-auto mb-12 rounded-full"></div>
          </div>
        </div>
        {/* Features */}
        <div className="py-12 md:py-20 bg-gray-50 rounded-xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">{loading ? '...' : translated.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-6">
            <div className="card text-center border-t-4 border-t-green-500">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{loading ? '...' : translated.step1Title}</h3>
              <p className="text-gray-600">{loading ? '...' : translated.step1Desc}</p>
            </div>
            <div className="card text-center border-t-4 border-t-green-600">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{loading ? '...' : translated.step2Title}</h3>
              <p className="text-gray-600">{loading ? '...' : translated.step2Desc}</p>
            </div>
            <div className="card text-center border-t-4 border-t-green-700">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{loading ? '...' : translated.step3Title}</h3>
              <p className="text-gray-600">{loading ? '...' : translated.step3Desc}</p>
            </div>
          </div>
        </div>
        {/* Call to Action */}
        <div className="py-12 md:py-20 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gradient">{loading ? '...' : translated.ctaTitle}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{loading ? '...' : translated.ctaDesc}</p>
          <Link 
            to="/register" 
            className="btn btn-primary text-center px-8 py-3 text-lg"
          >
            {loading ? '...' : translated.ctaBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage; 