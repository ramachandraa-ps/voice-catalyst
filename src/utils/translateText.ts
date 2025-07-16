import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = 'AIzaSyAJm2ta9ruYf8ftqtDWYFx9I-s6yC4dsfo';

export async function translateText(inputText: string, sourceLang: string, targetLang: string): Promise<string> {
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${inputText}". Only return the translated text, and nothing else. Do not add any explanation, notes, or extra information.`;
  
  try {
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
          temperature: 0,
          maxOutputTokens: 256
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  } catch (error) {
    console.error('Error translating with Gemini API:', error);
    return '';
  }
} 