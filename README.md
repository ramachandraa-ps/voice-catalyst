# Voice Catalyst

Voice Catalyst is a voice-enabled product catalog application that helps small businesses create and manage their product catalogs using voice commands. The application now uses Firebase for authentication and data storage.

## Features

- **Voice Input**: Add products by speaking in your preferred language
- **Multi-language Support**: Support for English, Hindi, Tamil, Telugu, Kannada, and Malayalam
- **User Authentication**: Secure login with email/password or Google Sign-In via Firebase
- **Product Management**: Create, view, edit, and delete products
- **Catalog Sharing**: Generate shareable links and QR codes for your product catalog
- **Profile Management**: Update user profile information and upload profile pictures

## Technology Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Image Upload**: Cloudinary
- **State Management**: React Hooks
- **Routing**: React Router
- **UI Components**: Custom components with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Firebase account
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/voice-catalyst.git
cd voice-catalyst
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Set up Cloudinary (see [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) for detailed instructions)

5. Start the development server
```bash
npm start
```

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Add the Firebase configuration to your application

## Cloudinary Setup

See [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) for detailed instructions on setting up Cloudinary for image uploads.

## Firestore Data Structure

### Users Collection
```
users/
  {userId}/
    full_name: string
    email: string
    mobile_number: string
    location: string
    preferred_language: string
    user_role: string
    shop_name?: string
    shop_address?: string
    image_url?: string
    created_at: timestamp
    last_login: timestamp
```

### Products Collection
```
products/
  {productId}/
    userId: string
    name: string
    quantity: string
    price: number
    descriptionEnglish: string
    descriptionLocal: string
    createdAt: timestamp
    updatedAt: timestamp
```

## Development

### Available Scripts

- `npm start` - Run the React application
- `npm run dev` - Run the Next.js development server
- `npm run build` - Build the React application
- `npm run build:next` - Build the Next.js application
- `npm test` - Run tests

## License

This project is licensed under the MIT License.
