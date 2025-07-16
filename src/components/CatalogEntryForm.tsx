import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { translateToLanguage } from '../services/geminiLanguageService';

interface CatalogEntryFormProps {
  onSubmit: (productData: {
    name: string;
    quantity: string;
    price: number;
    descriptionEnglish: string;
    descriptionLocal?: string;
    detectedLanguage?: string;
    languageCode?: string;
  }) => void;
  isLoading?: boolean;
}

const CatalogEntryForm: React.FC<CatalogEntryFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    descriptionEnglish: '',
    descriptionLocal: '',
    detectedLanguage: '',
    languageCode: '',
  });
  
  const [language, setLanguage] = useState('en');
  const [processingTranslation, setProcessingTranslation] = useState(false);
  const [translationMessage, setTranslationMessage] = useState('');
  
  // Handle voice transcription with enhanced language detection
  const handleTranscription = async (text: string, detectedData: {
    name: string;
    quantity: string;
    price: string;
    description: string;
    detectedLanguage: string;
    languageCode: string;
  }) => {
    try {
      // Set the form data with the extracted information
      setFormData({
        name: detectedData.name || '',
        quantity: detectedData.quantity || '',
        price: detectedData.price || '',
        descriptionEnglish: detectedData.description || text,
        descriptionLocal: text,
        detectedLanguage: detectedData.detectedLanguage || 'Unknown',
        languageCode: detectedData.languageCode || 'en',
      });
      
      // Update the language selector to match the detected language
      if (detectedData.languageCode) {
        setLanguage(detectedData.languageCode);
      }
      
      setTranslationMessage(`Detected language: ${detectedData.detectedLanguage || 'Unknown'}`);
    } catch (error) {
      console.error('Error handling transcription:', error);
      setTranslationMessage('Error processing language detection');
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle language change
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // If we have content in the description field, translate it to the new language
    if (formData.descriptionEnglish && newLanguage !== 'en') {
      try {
        setProcessingTranslation(true);
        setTranslationMessage('Translating...');
        
        const translatedDescription = await translateToLanguage(formData.descriptionEnglish, newLanguage);
        
        setFormData(prev => ({
          ...prev,
          descriptionLocal: translatedDescription
        }));
        
        setTranslationMessage('Translation complete');
      } catch (error) {
        console.error('Error translating description:', error);
        setTranslationMessage('Error translating text');
      } finally {
        setProcessingTranslation(false);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      quantity: formData.quantity,
      price: parseFloat(formData.price) || 0,
      descriptionEnglish: formData.descriptionEnglish,
      descriptionLocal: formData.descriptionLocal,
      detectedLanguage: formData.detectedLanguage,
      languageCode: formData.languageCode,
    });
  };
  
  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'or', label: 'Odia' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Voice Input Language
        </label>
        <FormSelect
          id="language"
          label="Select Language"
          value={language}
          onChange={handleLanguageChange}
          options={languageOptions}
        />
        
        {formData.detectedLanguage && (
          <div className="mt-2 text-sm text-blue-600">
            {formData.detectedLanguage} detected
          </div>
        )}
      </div>
      
      <VoiceInput 
        onTranscription={handleTranscription}
        language={language}
      />
      
      {translationMessage && (
        <div className={`mt-4 text-sm ${processingTranslation ? 'text-blue-600' : 'text-green-600'}`}>
          {translationMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-6">
        <FormInput
          id="name"
          label="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <FormInput
          id="quantity"
          label="Quantity (with units)"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        
        <FormInput
          id="price"
          label="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
        
        <div className="mb-4">
          <label htmlFor="descriptionEnglish" className="block text-sm font-medium text-gray-700 mb-2">
            Description (English)
          </label>
          <textarea
            id="descriptionEnglish"
            name="descriptionEnglish"
            value={formData.descriptionEnglish}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {language !== 'en' && (
          <div className="mb-4">
            <label htmlFor="descriptionLocal" className="block text-sm font-medium text-gray-700 mb-2">
              Description ({formData.detectedLanguage || languageOptions.find(opt => opt.value === language)?.label || 'Local Language'})
            </label>
            <textarea
              id="descriptionLocal"
              name="descriptionLocal"
              value={formData.descriptionLocal}
              onChange={handleChange}
              rows={3}
              dir={['ar', 'ur', 'he'].includes(language) ? 'rtl' : 'ltr'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || processingTranslation}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading || processingTranslation ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default CatalogEntryForm; 