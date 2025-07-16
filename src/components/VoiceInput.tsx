import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/assemblyAI';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  language: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      setIsListening(true);
      setErrorMessage(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          
          // Combine audio chunks into a single blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          // Transcribe the audio using AssemblyAI
          const transcription = await transcribeAudio(audioBlob);
          
          // Pass the transcription to the parent component
          onTranscription(transcription);
        } catch (error) {
          console.error('Error processing audio:', error);
          setErrorMessage('Failed to transcribe audio. Please try again.');
        } finally {
          setIsProcessing(false);
          
          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('Could not access microphone. Please check permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
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
        
        {isProcessing && (
          <div className="mt-4 text-gray-600">
            Processing audio...
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