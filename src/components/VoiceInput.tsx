import React, { useState, useEffect } from 'react';
import { detectLanguageAndExtractData } from '../services/geminiLanguageService';

interface VoiceInputProps {
  onTranscription: (text: string, detectedData: {
    name: string;
    quantity: string;
    price: string;
    description: string;
    detectedLanguage: string;
    languageCode: string;
  }) => void;
  language: string;
}

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
  onresult: (event: any) => void;
}

// Define the window interface with SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    const windowWithSpeech = window as unknown as WindowWithSpeechRecognition;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition not supported in this browser.');
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    
    // Set language based on prop
    recognitionInstance.lang = language === 'en' ? 'en-US' : language;
    
    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      processTranscription(transcript);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setErrorMessage('Error recognizing speech. Please try again.');
      setIsListening(false);
      setIsProcessing(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language]);
  
  const processTranscription = async (text: string) => {
    try {
      setIsProcessing(true);
      setProcessingStage('Analyzing language and extracting data...');
      
      // Process with Gemini for language detection and data extraction
      const languageData = await detectLanguageAndExtractData(text);
      
      // Pass the transcription and extracted data to the parent component
      onTranscription(text, {
        name: languageData.extractedData.name,
        quantity: languageData.extractedData.quantity,
        price: languageData.extractedData.price,
        description: languageData.extractedData.description,
        detectedLanguage: languageData.detectedLanguage,
        languageCode: languageData.languageCode
      });
    } catch (error) {
      console.error('Error processing transcription:', error);
      setErrorMessage('Failed to process speech. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const startListening = () => {
    if (!recognition) {
      setErrorMessage('Speech recognition not available.');
      return;
    }
    
    try {
      setIsListening(true);
      setErrorMessage(null);
      setTranscript('');
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setErrorMessage('Could not start speech recognition. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return (
    <div className="voice-input-container">
      <div className="flex flex-col items-center">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`rounded-full p-4 ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white shadow-lg hover:shadow-xl transition-all`}
        >
          <div className="h-6 w-6 flex items-center justify-center">
            {isListening ? '◼' : '🎤'}
          </div>
        </button>
        
        <div className="mt-2 text-sm">
          {isListening ? 'Tap to stop' : 'Tap to speak'}
        </div>
        
        {transcript && !isProcessing && (
          <div className="mt-4 text-sm text-gray-700 max-w-md overflow-hidden">
            <strong>Transcript:</strong> {transcript}
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-4 text-gray-600">
            {processingStage || 'Processing audio...'}
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 text-red-500">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput; 