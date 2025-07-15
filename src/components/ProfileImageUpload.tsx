import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImageUrl, onImageUpload }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(currentImageUrl);

  useEffect(() => {
    if (currentImageUrl !== imageUrl) {
      setImageUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleUploadClick = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'ddq4tjfg0',
          uploadPreset: 'say2sell_unsigned',
          sources: ['local', 'camera', 'url'],
          multiple: false,
          cropping: true,
          croppingAspectRatio: 1,
          maxFileSize: 5000000, // 5MB
          resourceType: 'image',
          showUploadMoreButton: false,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#10B981',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#10B981',
              action: '#10B981',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#10B981',
              complete: '#20B832',
              sourceBg: '#E4EBF1'
            }
          },
          // Prevent widget from causing scrolling issues
          inlineContainer: null,
          frameContainer: null
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            const uploadedImageUrl = result.info.secure_url;
            setImageUrl(uploadedImageUrl);
            onImageUpload(uploadedImageUrl);
          }
        }
      );
      
      widget.open();
    } else {
      console.error('Cloudinary widget is not available');
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-500 bg-gray-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <button 
          type="button"
          onClick={handleUploadClick}
          className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 shadow-md hover:bg-green-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
      <button 
        type="button"
        onClick={handleUploadClick}
        className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
      >
        {imageUrl ? 'Change Profile Picture' : 'Upload Profile Picture'}
      </button>
    </div>
  );
};

export default ProfileImageUpload; 