import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GROQ_API_KEY) ? (import.meta as any).env.VITE_GROQ_API_KEY : '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';

export async function translateText(inputText: string, sourceLang: string, targetLang: string): Promise<string> {
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}: "${inputText}". Only return the translated text, and nothing else. Do not add any explanation, notes, or extra information.`;
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: 'llama3-70b-8192',
      messages: [
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 256,
    },
    {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices?.[0]?.message?.content?.trim() || '';
} 