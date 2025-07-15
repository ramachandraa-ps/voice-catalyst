import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { User, Product } from '../types';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import app from "../firebase";

const CatalogPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserAndProducts = async () => {
      if (!userId) {
        setError('Catalog not found');
        setIsLoading(false);
        return;
      }
      
      try {
        const db = getFirestore(app);
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", userId));
        
        if (!userDoc.exists()) {
          setError('Catalog not found');
          setIsLoading(false);
          return;
        }
        
        const userData = userDoc.data();
        setUser({
          id: userId,
          name: userData.full_name || 'User',
          mobileNumber: userData.mobile_number || '',
          location: userData.location || '',
          preferredLanguage: userData.preferred_language || 'en',
          role: userData.user_role || 'Farmer',
        });
        
        // Get products from Firestore
        const q = query(collection(db, "products"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const productsList: Product[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          productsList.push({
            id: doc.id,
            userId: data.userId,
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            descriptionEnglish: data.descriptionEnglish,
            descriptionLocal: data.descriptionLocal,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          });
        });
        
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to load catalog');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndProducts();
  }, [userId]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (error || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Catalog Not Found</h1>
          <p className="text-gray-600">
            The catalog you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {user.name}'s Catalog
          </h1>
          <div className="inline-block bg-green-50 px-4 py-2 rounded-full">
            <p className="text-green-700">
              {user.role} · {user.location}
            </p>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">This catalog is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CatalogPage; 