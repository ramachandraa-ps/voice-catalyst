# Language Detection and Intelligent Data Extraction

This document outlines the language detection and intelligent data extraction features implemented in the Voice Catalyst application, which allows farmers to speak in their native language and have the system automatically detect the language, extract structured data, and populate the catalog form.

## Overview

The implementation uses a combination of AssemblyAI for speech-to-text and Google's Gemini Pro API for language detection, data extraction, and translation. This creates an agentic AI solution that can understand spoken product descriptions in various languages, extract structured information, and present it in both the original language and English.

## Components

### 1. AssemblyAI Service (`src/services/assemblyAI.ts`)

- Transcribes spoken audio into text
- Provides the raw text transcription to be processed by the language detection service

### 2. Gemini Language Service (`src/services/geminiLanguageService.ts`)

- **Language Detection**: Identifies the language of the transcribed text
- **Data Extraction**: Parses the text to extract structured product information (name, quantity, price, description)
- **Translation**: Translates between languages as needed
- **Response Format**: Returns a structured JSON response with all the extracted information

### 3. Enhanced VoiceInput Component (`src/components/VoiceInput.tsx`)

- Captures audio from the user's microphone
- Sends the audio to AssemblyAI for transcription
- Processes the transcription with the Gemini Language Service
- Returns both the transcription and structured data to the parent component

### 4. CatalogEntryForm Component (`src/components/CatalogEntryForm.tsx`)

- Displays the form for adding products to the catalog
- Uses the VoiceInput component to capture spoken descriptions
- Automatically populates form fields with extracted data
- Shows the detected language and provides translation capabilities
- Supports displaying content in both English and the detected local language

## Workflow

1. **Voice Input**: The farmer speaks into the microphone, describing their product in any language
2. **Speech-to-Text**: AssemblyAI transcribes the audio to text
3. **Language Detection**: Gemini API identifies the language of the text
4. **Data Extraction**: The Gemini model extracts structured product information (name, quantity, price, description)
5. **Translation**: If the detected language is not English, the text is translated to English
6. **Form Population**: The form is automatically populated with the extracted data
7. **Bilingual Display**: The product information is displayed in both English and the original language
8. **Catalog Addition**: The product is added to the catalog with all the language information preserved

## Supported Languages

The system supports a wide range of languages, including:

- English
- Hindi
- Tamil
- Telugu
- Kannada
- Malayalam
- Marathi
- Bengali
- Gujarati
- Punjabi
- Odia
- And many more (the Gemini model can detect over 100 languages)

## Example

If a farmer speaks in Tamil:
```
"தக்காளி, 5 கிலோ, 100 ரூபாய், நல்ல தரமான தக்காளி"
```

The system will:
1. Transcribe the audio to text
2. Detect that the language is Tamil
3. Extract the structured data:
   - Name: தக்காளி (Tomato)
   - Quantity: 5 கிலோ (5 kg)
   - Price: 100 ரூபாய் (100 rupees)
   - Description: நல்ல தரமான தக்காளி (Good quality tomatoes)
4. Translate the information to English
5. Populate the form with both Tamil and English versions
6. Update the language selector to Tamil

## Technical Implementation

The Gemini API is prompted with specific instructions to:
1. Detect the language of the input text
2. Extract structured product information
3. Translate the text to English if it's not already in English
4. Return the original text in the detected language

The response is formatted as a JSON object with fields for:
- Detected language name and code
- Confidence score for the language detection
- Translated text (English)
- Extracted data (name, quantity, price, description)
- Original text in the detected language

This structured response allows the application to intelligently populate the form fields and provide a seamless multilingual experience for farmers. 