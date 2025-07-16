# Voice Catalyst

Voice Catalyst is an agentic AI solution designed to help farmers create and manage product catalogs using voice input in their native language. The application combines speech-to-text technology with advanced language models to provide a seamless multilingual experience.

## Features

### Voice-to-Text with Language Detection

- **Speak in Any Language**: Farmers can speak in their native language to add products to the catalog
- **Automatic Language Detection**: The system automatically identifies the language being spoken
- **Structured Data Extraction**: AI extracts product name, quantity, price, and description from spoken input
- **Multilingual Support**: Supports a wide range of languages including Hindi, Tamil, Telugu, and many more

### Catalog Management

- **Easy Product Addition**: Add products to your catalog using voice or text input
- **Product Details**: Track product name, quantity, price, and descriptions
- **Bilingual Descriptions**: Store product descriptions in both English and the detected local language
- **QR Code Sharing**: Generate QR codes to share your catalog with customers

## Technology Stack

- **React**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Firebase**: Authentication and database
- **AssemblyAI**: Speech-to-text transcription
- **Google Gemini API**: Language detection, data extraction, and translation using Gemini Pro model
- **Tailwind CSS**: Styling and UI components

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
   - `REACT_APP_ASSEMBLY_AI_KEY`
   - `REACT_APP_GEMINI_API_KEY`
4. Start the development server: `npm start`

## Documentation

- [Voice-to-Text Implementation](VOICE_TO_TEXT.md)
- [Language Detection and Data Extraction](LANGUAGE_DETECTION.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
