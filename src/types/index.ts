export interface User {
  id: string;
  name: string;
  mobileNumber: string;
  location: string;
  preferredLanguage: string;
  role: 'Farmer' | 'Artisan' | 'Kirana Shop Owner';
  image_url?: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  quantity: string;
  price: number;
  descriptionEnglish: string;
  descriptionLocal: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  code: string;
  name: string;
  displayName: string;
} 