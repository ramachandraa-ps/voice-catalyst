import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = 'AIzaSyAJm2ta9ruYf8ftqtDWYFx9I-s6yC4dsfo';

interface LanguageDetectionResult {
  detectedLanguage: string;
  languageCode: string;
  confidence: number;
  translatedText: string;
  extractedData: {
    name: string;
    quantity: string;
    price: string;
    description: string;
  };
}

/**
 * Simple function to guess the language based on common patterns
 * This is a fallback when the API fails
 */
const guessLanguage = (text: string): { language: string, code: string } => {
  // Very simple language detection based on common characters
  if (/[א-ת]/.test(text)) return { language: 'Hebrew', code: 'he' };
  if (/[ぁ-んァ-ン]/.test(text)) return { language: 'Japanese', code: 'ja' };
  if (/[가-힣]/.test(text)) return { language: 'Korean', code: 'ko' };
  if (/[一-龯]/.test(text)) return { language: 'Chinese', code: 'zh' };
  if (/[ก-๛]/.test(text)) return { language: 'Thai', code: 'th' };
  if (/[अ-ह]/.test(text)) return { language: 'Hindi', code: 'hi' };
  if (/[ಅ-ೲ]/.test(text)) return { language: 'Kannada', code: 'kn' };
  if (/[అ-ఱ]/.test(text)) return { language: 'Telugu', code: 'te' };
  if (/[அ-ஹ]/.test(text)) return { language: 'Tamil', code: 'ta' };
  if (/[ა-ჰ]/.test(text)) return { language: 'Georgian', code: 'ka' };
  if (/[Ա-Ֆ]/.test(text)) return { language: 'Armenian', code: 'hy' };
  if (/[ا-ي]/.test(text)) return { language: 'Arabic', code: 'ar' };
  
  // Extract data based on simple patterns
  const words = text.split(/\s+/);
  
  // Default to English if no specific patterns are detected
  return { language: 'English', code: 'en' };
};

/**
 * Simple function to extract basic product information from text
 * This is a fallback when the API fails
 */
const extractBasicData = (text: string): {
  name: string;
  quantity: string;
  price: string;
  description: string;
} => {
  const words = text.split(/\s+/);
  
  // Simple extraction logic - first word as name, look for numbers for quantity and price
  const name = words[0] || '';
  
  let quantity = '';
  let price = '';
  
  // Look for patterns like numbers followed by units or currency symbols
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (/\d+/.test(word) && !quantity && i < words.length - 1) {
      // If it's a number and we haven't found quantity yet
      quantity = word + ' ' + words[i + 1];
    } else if (/\d+/.test(word) && quantity && !price) {
      // If it's a number and we already have quantity but no price
      price = word;
    }
  }
  
  // Use the full text as description
  const description = text;
  
  return {
    name,
    quantity,
    price,
    description
  };
};

/**
 * Detects the language of the input text and extracts structured product information using Gemini API
 * @param inputText - The text to analyze
 * @returns Promise with the language detection result and structured data
 */
export const detectLanguageAndExtractData = async (inputText: string): Promise<LanguageDetectionResult> => {
  try {
    const prompt = `
You are an AI assistant helping farmers catalog their products. 
Analyze the following text: "${inputText}"

1. Detect what language the text is in
2. Extract structured product information (name, quantity, price, description)
3. Translate the text to English if it's not already in English
4. Return the original text in the detected language

Format your response as a valid JSON object with these fields:
{
  "detectedLanguage": "Full name of the detected language",
  "languageCode": "ISO language code (e.g., 'en', 'ta', 'hi')",
  "confidence": 0.95, 
  "translatedText": "English translation of the input",
  "extractedData": {
    "name": "Product name",
    "quantity": "Product quantity with units",
    "price": "Product price (just the number)",
    "description": "Product description"
  },
  "originalText": "Text in the original detected language"
}

Be as accurate as possible with the language detection. If you detect a regional language like Tamil, Telugu, Hindi, etc., make sure to identify it correctly.
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseFormat: { type: "JSON" }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the content from Gemini API response
    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      const result = JSON.parse(content);
      return {
        detectedLanguage: result.detectedLanguage || 'Unknown',
        languageCode: result.languageCode || 'en',
        confidence: result.confidence || 0,
        translatedText: result.translatedText || inputText,
        extractedData: {
          name: result.extractedData?.name || '',
          quantity: result.extractedData?.quantity || '',
          price: result.extractedData?.price || '',
          description: result.extractedData?.description || '',
        }
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback to basic detection
      console.log("Using fallback language detection and data extraction");
      const { language, code } = guessLanguage(inputText);
      const extractedData = extractBasicData(inputText);
      
      return {
        detectedLanguage: language,
        languageCode: code,
        confidence: 0.5,
        translatedText: inputText,
        extractedData
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback to basic detection
    console.log("Using fallback language detection and data extraction due to API error");
    const { language, code } = guessLanguage(inputText);
    const extractedData = extractBasicData(inputText);
    
    return {
      detectedLanguage: language,
      languageCode: code,
      confidence: 0.5,
      translatedText: inputText,
      extractedData
    };
  }
};

/**
 * Translates text to a target language using Gemini API
 * @param inputText - The text to translate
 * @param targetLang - The target language code
 * @returns Promise with the translated text
 */
export const translateToLanguage = async (inputText: string, targetLang: string): Promise<string> => {
  try {
    const prompt = `Translate the following English text to ${targetLang}: "${inputText}". 
Return only the translated text, nothing else.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || inputText;
  } catch (error) {
    console.error('Error translating text with Gemini:', error);
    // Return original text if translation fails
    return inputText;
  }
};

export default {
  detectLanguageAndExtractData,
  translateToLanguage
}; 