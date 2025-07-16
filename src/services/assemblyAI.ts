import { AssemblyAI } from 'assemblyai';

// Initialize the AssemblyAI client with API key
const assemblyAI = new AssemblyAI({
  apiKey: 'a5d9a8abcff14bd2ba7152c25bddfc4d', // API key provided
});

/**
 * Transcribes audio from an audio blob
 * @param audioBlob - The audio blob to transcribe
 * @returns Promise with the transcription text
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Create a file from the blob
    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    
    // Submit the audio file for transcription
    const transcript = await assemblyAI.transcripts.transcribe({
      audio: file,
    });
    
    // Return the transcribed text
    return transcript.text || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Creates a real-time transcriber for streaming audio
 * @returns The streaming transcriber instance
 */
export const createRealtimeTranscriber = () => {
  try {
    const transcriber = assemblyAI.realtime.transcriber();
    return transcriber;
  } catch (error) {
    console.error('Error creating realtime transcriber:', error);
    throw error;
  }
};

export default {
  transcribeAudio,
  createRealtimeTranscriber,
}; 