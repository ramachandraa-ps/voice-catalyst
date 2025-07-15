import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import ProfileImageUpload from '../components/ProfileImageUpload';
import { LANGUAGES } from '../utils/dummyData';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import app from "../firebase";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    location: '',
    preferredLanguage: '',
    role: '',
    shopName: '',
    shopAddress: '',
    image_url: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const db = getFirestore(app);
      
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            name: userData.full_name || '',
            email: auth.currentUser.email || '',
            mobileNumber: userData.mobile_number || '',
            location: userData.location || '',
            preferredLanguage: userData.preferred_language || 'en',
            role: userData.user_role || '',
            shopName: userData.shop_name || '',
            shopAddress: userData.shop_address || '',
            image_url: userData.image_url || '',
          });
        } else {
          // If user document doesn't exist, initialize with auth data
          const photoURL = auth.currentUser.photoURL || '';
          
          setFormData({
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            mobileNumber: auth.currentUser.phoneNumber || '',
            location: '',
            preferredLanguage: 'en',
            role: '',
            shopName: '',
            shopAddress: '',
            image_url: photoURL,
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear any previous error/success messages when user makes changes
    setError(null);
    setSuccess(null);
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: imageUrl,
    }));
    
    // Clear any previous error/success messages
    setError(null);
    setSuccess(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Validate required fields
    if (!formData.name || !formData.mobileNumber || !formData.location || 
        !formData.preferredLanguage || !formData.role) {
      setIsSubmitting(false);
      setError('Please fill in all required fields.');
      return;
    }
    
    // Validate shop details for certain roles
    if ((formData.role === 'Farmer' || formData.role === 'Artisan' || formData.role === 'Kirana Shop Owner') && 
        (!formData.shopName || !formData.shopAddress)) {
      setIsSubmitting(false);
      setError('Please fill in shop details.');
      return;
    }
    
    const auth = getAuth();
    const db = getFirestore(app);
    
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      // Update user data in Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        full_name: formData.name,
        mobile_number: formData.mobileNumber,
        location: formData.location,
        preferred_language: formData.preferredLanguage,
        user_role: formData.role,
        shop_name: formData.shopName || '',
        shop_address: formData.shopAddress || '',
        image_url: formData.image_url || '',
        updated_at: new Date()
      });
      
      setSuccess("Profile updated successfully!");
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  const roleOptions = [
    { value: 'Farmer', label: 'Farmer' },
    { value: 'Artisan', label: 'Artisan' },
    { value: 'Kirana Shop Owner', label: 'Kirana Shop Owner' },
  ];
  
  const languageOptions = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.displayName,
  }));
  
  const locationOptions = [
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Other', label: 'Other' },
  ];
  
  // Check if shop details should be displayed
  const showShopDetails = formData.role === 'Farmer' || formData.role === 'Artisan' || formData.role === 'Kirana Shop Owner';
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gradient">My Profile</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="card overflow-visible">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <ProfileImageUpload 
              currentImageUrl={formData.image_url} 
              onImageUpload={handleImageUpload} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
              
              <FormInput
                id="email"
                label="Email ID"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                disabled
                autoComplete="email"
              />
              
              <FormInput
                id="mobileNumber"
                label="Mobile Number"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
              
              <FormSelect
                id="location"
                label="Location"
                options={locationOptions}
                value={formData.location}
                onChange={handleChange}
                required
              />
              
              <FormSelect
                id="preferredLanguage"
                label="Preferred Language"
                options={languageOptions}
                value={formData.preferredLanguage}
                onChange={handleChange}
                required
              />
              
              <FormSelect
                id="role"
                label="I am a"
                options={roleOptions}
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>
            
            {showShopDetails && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="text-lg font-medium text-green-700 mb-3">Shop Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    id="shopName"
                    label="Shop Name"
                    placeholder="Enter your shop name"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormInput
                    id="shopAddress"
                    label="Shop Address"
                    placeholder="Enter your shop address"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-3"
              >
                {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage; 