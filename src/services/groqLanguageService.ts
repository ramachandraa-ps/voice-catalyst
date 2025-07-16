import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = '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';

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
 * Detects the language of the input text and extracts structured product information
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
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1024,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '';
    
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
      console.error('Error parsing LLM response:', parseError);
      return {
        detectedLanguage: 'Unknown',
        languageCode: 'en',
        confidence: 0,
        translatedText: inputText,
        extractedData: {
          name: '',
          quantity: '',
          price: '',
          description: inputText,
        }
      };
    }
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
};

/**
 * Translates text to a target language using Groq LLM
 * @param inputText - The text to translate
 * @param targetLang - The target language code
 * @returns Promise with the translated text
 */
export const translateToLanguage = async (inputText: string, targetLang: string): Promise<string> => {
  try {
    const prompt = `Translate the following English text to ${targetLang}: "${inputText}". 
Return only the translated text, nothing else.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 512,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices?.[0]?.message?.content?.trim() || inputText;
  } catch (error) {
    console.error('Error translating text:', error);
    return inputText;
  }
};

export default {
  detectLanguageAndExtractData,
  translateToLanguage
}; 