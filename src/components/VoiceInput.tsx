import React, { useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  language: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startListening = () => {
    setIsListening(true);
    setErrorMessage(null);
    
    // Here we would normally use the Web Speech API
    // For this demo, we'll simulate transcription after a delay
    setTimeout(() => {
      // Simulate different transcriptions based on language
      let transcription = '';
      
      switch(language) {
        case 'hi':
          transcription = 'चावल, 25 किलो, 1200 रुपये';
          break;
        case 'ta':
          transcription = 'அரிசி, 25 கிலோ, 1200 ரூபாய்';
          break;
        default:
          transcription = 'Rice, 25 kilograms, 1200 rupees';
      }
      
      onTranscription(transcription);
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-4 rounded-full flex items-center justify-center transition-all duration-200 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white shadow-md`}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          <div className="h-6 w-6 flex items-center justify-center">
            {isListening ? FaStop({ size: 24 }) : FaMicrophone({ size: 24 })}
          </div>
        </button>
        
        <div>
          <p className="text-sm text-gray-700 font-medium">
            {isListening 
              ? 'Listening... Speak now'
              : 'Click the microphone to start speaking'
            }
          </p>
          {errorMessage && (
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceInput; 