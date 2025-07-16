import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

interface CatalogEntryFormProps {
  onSubmit: (productData: {
    name: string;
    quantity: string;
    price: number;
    descriptionEnglish: string;
  }) => void;
  isLoading?: boolean;
}

const CatalogEntryForm: React.FC<CatalogEntryFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    descriptionEnglish: '',
  });
  
  const [language, setLanguage] = useState('en');
  
  // Handle voice transcription
  const handleTranscription = (text: string) => {
    // Simple parsing logic for the transcription
    // This is a basic implementation that can be improved with NLP
    try {
      // Example expected format: "Product name, quantity, price"
      const parts = text.split(',').map(part => part.trim());
      
      if (parts.length >= 1) {
        setFormData(prev => ({ ...prev, name: parts[0] }));
      }
      
      if (parts.length >= 2) {
        setFormData(prev => ({ ...prev, quantity: parts[1] }));
      }
      
      if (parts.length >= 3) {
        // Try to extract the number from the price text
        const priceMatch = parts[2].match(/\d+/);
        if (priceMatch) {
          setFormData(prev => ({ ...prev, price: priceMatch[0] }));
        }
      }
      
      // Use the full text as the description
      setFormData(prev => ({ ...prev, descriptionEnglish: text }));
    } catch (error) {
      console.error('Error parsing transcription:', error);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      quantity: formData.quantity,
      price: parseFloat(formData.price) || 0,
      descriptionEnglish: formData.descriptionEnglish,
    });
  };
  
  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    // Add more languages as needed
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
          onChange={(e) => setLanguage(e.target.value)}
          options={languageOptions}
        />
      </div>
      
      <VoiceInput 
        onTranscription={handleTranscription}
        language={language}
      />
      
      <form onSubmit={handleSubmit}>
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
            Description
          </label>
          <textarea
            id="descriptionEnglish"
            name="descriptionEnglish"
            value={formData.descriptionEnglish}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default CatalogEntryForm; 