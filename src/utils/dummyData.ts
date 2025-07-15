import { Language } from '../types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', displayName: 'English' },
  { code: 'hi', name: 'Hindi', displayName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', displayName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', displayName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', displayName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', displayName: 'മലയാളം' },
];

// Function to generate a catalog share URL
export const generateCatalogShareUrl = (userId: string): string => {
  return `${window.location.origin}/catalog/${userId}`;
}; 