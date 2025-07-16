# Voice-to-Text Implementation for Farmer Catalog

This document outlines the voice-to-text functionality implemented in the Voice Catalyst application, which allows farmers to easily add products to their catalog using voice input.

## Overview

The implementation uses AssemblyAI's API to convert spoken descriptions of products into text, which is then parsed and used to populate product information in the catalog. This makes it easier for farmers who may not be comfortable with typing to maintain their product listings.

## Components

### 1. AssemblyAI Service (`src/services/assemblyAI.ts`)

A utility service that handles communication with the AssemblyAI API:

- `transcribeAudio`: Transcribes audio from a blob using AssemblyAI's API
- `createRealtimeTranscriber`: Creates a real-time transcriber for streaming audio

### 2. VoiceInput Component (`src/components/VoiceInput.tsx`)

A React component that:
- Captures audio from the user's microphone
- Sends the audio to AssemblyAI for transcription
- Returns the transcribed text to the parent component

### 3. CatalogEntryForm Component (`src/components/CatalogEntryForm.tsx`)

A form component that:
- Integrates the VoiceInput component
- Parses the transcribed text to extract product information
- Allows manual editing of the extracted information
- Submits the product data to be added to the catalog

## Implementation Details

### Voice Recording

The voice recording functionality uses the Web Audio API through the MediaRecorder interface:
- Requests microphone access with `navigator.mediaDevices.getUserMedia()`
- Records audio chunks and combines them into a single audio blob
- Sends the audio blob to AssemblyAI for transcription

### Text Parsing

The current implementation uses a simple parsing approach:
- Splits the transcribed text by commas
- Extracts product name, quantity, and price from the respective parts
- Uses regular expressions to extract numerical values for the price
- Uses the full transcription as the product description

### Multi-language Support

The application supports multiple languages for voice input:
- English (default)
- Hindi
- Tamil
- (Additional languages can be easily added)

## Usage

1. Navigate to the Dashboard
2. Select your preferred language for voice input
3. Click the microphone button and speak your product details
4. The system will transcribe your speech and populate the form
5. Edit any fields if necessary
6. Submit the form to add the product to your catalog

## API Key Management

The AssemblyAI API key is currently stored in the `assemblyAI.ts` service file. In a production environment, this should be moved to environment variables or a secure backend service.

## Future Improvements

1. **Enhanced Parsing**: Implement more sophisticated NLP techniques to better extract structured data from voice input
2. **Real-time Transcription**: Use streaming transcription for immediate feedback
3. **Voice Commands**: Add support for voice commands to navigate the application
4. **Offline Support**: Implement local speech recognition for basic functionality when offline
5. **Security**: Move API key handling to a secure backend service 