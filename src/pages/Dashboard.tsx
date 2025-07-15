import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCopy, FaQrcode } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import Layout from '../components/Layout';
import VoiceInput from '../components/VoiceInput';
import FormInput from '../components/FormInput';
// Commented out since it's unused
// import FormSelect from '../components/FormSelect';
import ProductCard from '../components/ProductCard';
import { 
  generateCatalogShareUrl,
  LANGUAGES, 
} from '../utils/dummyData';
import { Product, User } from '../types';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import app from "../firebase";

type UserRole = "Farmer" | "Artisan" | "Kirana Shop Owner";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  
  const [voiceLanguage, setVoiceLanguage] = useState('en');
  
  const [productForm, setProductForm] = useState({
    name: '',
    quantity: '',
    price: '',
    descriptionEnglish: '',
    descriptionLocal: '',
  });
  
  useEffect(() => {
    const fetchUserAndProducts = async () => {
      const auth = getAuth();
      const db = getFirestore(app);
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        navigate('/login');
        return;
      }
      
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        let userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || 'User',
          mobileNumber: '',
          location: '',
          preferredLanguage: 'en',
          role: 'Farmer' as UserRole,
        };
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          userData = {
            id: firebaseUser.uid,
            name: data.full_name || firebaseUser.displayName || 'User',
            mobileNumber: data.mobile_number || '',
            location: data.location || '',
            preferredLanguage: data.preferred_language || 'en',
            role: (data.user_role as UserRole) || 'Farmer' as UserRole,
          };
        }
        
        setUser(userData);
        setVoiceLanguage(userData.preferredLanguage || 'en');
        
        // Get products from Firestore
        const q = query(collection(db, "products"), where("userId", "==", firebaseUser.uid));
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };
    
    fetchUserAndProducts();
  }, [navigate]);
  
  // Handle voice input
  const handleVoiceTranscription = (text: string) => {
    console.log('Voice transcription:', text);
    
    // Simulate processing the voice input
    // In a real app, this would be processed by a backend service
    
    // For demo, we'll just simulate filling the form based on language
    let productData = {
      name: '',
      quantity: '',
      price: '',
      descriptionEnglish: '',
      descriptionLocal: '',
    };
    
    switch (voiceLanguage) {
      case 'hi':
        productData = {
          name: 'चावल',
          quantity: '25 किलो',
          price: '1200',
          descriptionEnglish: 'High quality organic rice',
          descriptionLocal: 'उच्च गुणवत्ता वाला जैविक चावल',
        };
        break;
      case 'ta':
        productData = {
          name: 'அரிசி',
          quantity: '25 கிலோ',
          price: '1200',
          descriptionEnglish: 'High quality organic rice',
          descriptionLocal: 'உயர் தரமான கரிம அரிசி',
        };
        break;
      default:
        productData = {
          name: 'Rice',
          quantity: '25 kg',
          price: '1200',
          descriptionEnglish: 'High quality organic rice',
          descriptionLocal: 'High quality organic rice',
        };
    }
    
    // Set the form data
    setProductForm(productData);
    
    // Show the product form
    setShowProductForm(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle product form submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const db = getFirestore(app);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      if (editingProduct) {
        // Update existing product in Firestore
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, {
          name: productForm.name,
          quantity: productForm.quantity,
          price: parseFloat(productForm.price),
          descriptionEnglish: productForm.descriptionEnglish,
          descriptionLocal: productForm.descriptionLocal,
          updatedAt: new Date()
        });
        
        // Update local state
        setProducts(products.map(p => p.id === editingProduct.id ? {
          ...p,
          name: productForm.name,
          quantity: productForm.quantity,
          price: parseFloat(productForm.price),
          descriptionEnglish: productForm.descriptionEnglish,
          descriptionLocal: productForm.descriptionLocal,
          updatedAt: new Date()
        } : p));
      } else {
        // Add new product to Firestore
        const newProductRef = await addDoc(collection(db, "products"), {
          userId: currentUser.uid,
          name: productForm.name,
          quantity: productForm.quantity,
          price: parseFloat(productForm.price),
          descriptionEnglish: productForm.descriptionEnglish,
          descriptionLocal: productForm.descriptionLocal,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Add to local state
        setProducts([...products, {
          id: newProductRef.id,
          userId: currentUser.uid,
          name: productForm.name,
          quantity: productForm.quantity,
          price: parseFloat(productForm.price),
          descriptionEnglish: productForm.descriptionEnglish,
          descriptionLocal: productForm.descriptionLocal,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
      }
      
      // Reset form
      setProductForm({
        name: '',
        quantity: '',
        price: '',
        descriptionEnglish: '',
        descriptionLocal: '',
      });
      setEditingProduct(null);
      setShowProductForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  
  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      quantity: product.quantity,
      price: product.price.toString(),
      descriptionEnglish: product.descriptionEnglish,
      descriptionLocal: product.descriptionLocal,
    });
    setShowProductForm(true);
  };
  
  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Copy catalog link to clipboard
  const copyLinkToClipboard = () => {
    const catalogUrl = user ? generateCatalogShareUrl(user.id) : '';
    navigator.clipboard.writeText(catalogUrl)
      .then(() => {
        alert('Catalog link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const catalogUrl = user ? generateCatalogShareUrl(user.id) : '';
  const languageOptions = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.displayName,
  }));
  
  return (
    <Layout showLoginButton={false} showRegisterButton={false}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">
            Welcome, {user?.name || 'User'}
          </h1>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Voice Input */}
          <div className="md:col-span-1">
            <div className="card mb-6 border-l-4 border-l-green-500">
              <h2 className="text-xl font-semibold mb-4">Add Product by Voice</h2>
              
              <div className="mb-4">
                <label className="form-label">Voice Language</label>
                <div className="relative">
                  <select
                    className="form-input appearance-none border-green-100"
                    value={voiceLanguage}
                    onChange={(e) => setVoiceLanguage(e.target.value)}
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <VoiceInput 
                onTranscription={handleVoiceTranscription}
                language={voiceLanguage}
              />
              
              <div className="mt-4">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      quantity: '',
                      price: '',
                      descriptionEnglish: '',
                      descriptionLocal: '',
                    });
                    setShowProductForm(true);
                  }}
                  className="btn btn-secondary w-full"
                >
                  Add Product Manually
                </button>
              </div>
            </div>
            
            <div className="card border-l-4 border-l-green-600">
              <h2 className="text-xl font-semibold mb-4">Share Your Catalog</h2>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={copyLinkToClipboard}
                  className="btn btn-secondary flex items-center justify-center"
                >
                  <div className="mr-2">
                    {FaCopy({ size: 16 })}
                  </div>
                  Copy Link
                </button>
                
                <button
                  onClick={() => setShowQRModal(true)}
                  className="btn btn-secondary flex items-center justify-center"
                >
                  <div className="mr-2">
                    {FaQrcode({ size: 16 })}
                  </div>
                  Show QR Code
                </button>
                
                <Link
                  to={`/catalog/${user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center justify-center"
                >
                  View Public Catalog
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right Column - Products & Form */}
          <div className="md:col-span-2">
            <div className="flex justify-end mb-4">
              <button
                className="btn btn-primary"
                onClick={() => setShowCatalog(true)}
              >
                Generate Catalog
              </button>
            </div>
            {showCatalog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl p-0 max-w-3xl w-full relative border-2 border-green-200">
                  <button
                    className="absolute top-6 right-8 text-gray-400 hover:text-green-700 text-3xl font-bold transition-colors"
                    onClick={() => setShowCatalog(false)}
                    aria-label="Close Catalog"
                  >
                    &times;
                  </button>
                  <div className="rounded-t-3xl bg-gradient-to-r from-green-600 to-green-400 p-8 text-center shadow-md">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">Shop Catalog</h2>
                    <p className="text-lg text-green-100 font-medium">Welcome to <span className="font-bold text-white">GreenMart</span></p>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 px-8 py-6 bg-white rounded-b-3xl">
                    <div className="flex-1 flex flex-col items-center md:items-start">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7V6a4 4 0 014-4h10a4 4 0 014 4v1"/><path d="M21 10v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10"/><path d="M16 21v-4a2 2 0 00-2-2H10a2 2 0 00-2 2v4"/></svg>
                        <span className="font-semibold text-gray-700">Shop Name:</span>
                      </div>
                      <div className="text-green-700 text-lg font-bold mb-4">GreenMart</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center md:items-start">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M6.343 17.657A8 8 0 0112 16a8 8 0 015.657 1.657"/></svg>
                        <span className="font-semibold text-gray-700">Owner Name:</span>
                      </div>
                      <div className="text-green-700 text-lg font-bold mb-4">Tarun Gopinath</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center md:items-start">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 8.5A2.5 2.5 0 014.5 6h15A2.5 2.5 0 0122 8.5v7a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 15.5v-7z"/><path d="M6 10h.01M6 14h.01M10 10h.01M10 14h.01M14 10h.01M14 14h.01M18 10h.01M18 14h.01"/></svg>
                        <span className="font-semibold text-gray-700">Contact Number:</span>
                      </div>
                      <div className="text-green-700 text-lg font-bold mb-4">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="overflow-x-auto px-8 pb-8">
                    <table className="min-w-full bg-white border border-green-200 rounded-xl shadow-lg">
                      <thead className="bg-gradient-to-r from-green-600 to-green-400 text-white">
                        <tr>
                          <th className="py-3 px-4 rounded-tl-xl text-lg font-semibold tracking-wide">Date</th>
                          <th className="py-3 px-4 text-lg font-semibold tracking-wide">Product</th>
                          <th className="py-3 px-4 text-lg font-semibold tracking-wide">Quantity</th>
                          <th className="py-3 px-4 text-lg font-semibold tracking-wide">Price (₹)</th>
                          <th className="py-3 px-4 rounded-tr-xl text-lg font-semibold tracking-wide">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="even:bg-green-50 hover:bg-green-100 transition">
                          <td className="py-3 px-4 font-medium">2024-06-01</td>
                          <td className="py-3 px-4 flex items-center gap-2"><span className="inline-block bg-green-100 rounded-full p-1"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg></span>Organic Rice</td>
                          <td className="py-3 px-4">25 kg</td>
                          <td className="py-3 px-4">1200</td>
                          <td className="py-3 px-4">High quality organic rice</td>
                        </tr>
                        <tr className="even:bg-green-50 hover:bg-green-100 transition">
                          <td className="py-3 px-4 font-medium">2024-06-01</td>
                          <td className="py-3 px-4 flex items-center gap-2"><span className="inline-block bg-green-100 rounded-full p-1"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg></span>Fresh Tomatoes</td>
                          <td className="py-3 px-4">10 kg</td>
                          <td className="py-3 px-4">400</td>
                          <td className="py-3 px-4">Farm fresh, juicy tomatoes</td>
                        </tr>
                        <tr className="even:bg-green-50 hover:bg-green-100 transition">
                          <td className="py-3 px-4 font-medium">2024-06-01</td>
                          <td className="py-3 px-4 flex items-center gap-2"><span className="inline-block bg-green-100 rounded-full p-1"><svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg></span>Pure Honey</td>
                          <td className="py-3 px-4">5 kg</td>
                          <td className="py-3 px-4">2500</td>
                          <td className="py-3 px-4">Natural, unprocessed honey</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-8 text-center pb-4">
                    <span className="text-green-700 font-extrabold text-xl">Thank you for visiting our catalog!</span>
                    <div className="mt-2 text-gray-500 text-sm">For orders, contact us at <span className="underline">+91 98765 43210</span> or visit <span className="underline text-green-700">GreenMart</span> in person.</div>
                  </div>
                </div>
              </div>
            )}
            {showProductForm ? (
              <div className="card mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                
                <form onSubmit={handleProductSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      id="name"
                      label="Product Name"
                      value={productForm.name}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        id="quantity"
                        label="Quantity"
                        value={productForm.quantity}
                        onChange={handleInputChange}
                        required
                      />
                      
                      <FormInput
                        id="price"
                        label="Price (₹)"
                        type="number"
                        value={productForm.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="descriptionEnglish" className="form-label">
                      Description (English)
                    </label>
                    <textarea
                      id="descriptionEnglish"
                      name="descriptionEnglish"
                      className="form-input"
                      rows={3}
                      value={productForm.descriptionEnglish}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="descriptionLocal" className="form-label">
                      Description (Local Language)
                    </label>
                    <textarea
                      id="descriptionLocal"
                      name="descriptionLocal"
                      className="form-input"
                      rows={3}
                      value={productForm.descriptionLocal}
                      onChange={handleInputChange}
                      required
                      dir={voiceLanguage === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gradient">Your Products</h2>
                  <span className="text-gray-600">
                    {products.length} {products.length === 1 ? 'product' : 'products'}
                  </span>
                </div>
                
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        showActions
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-10">
                    <p className="text-gray-600 mb-4">
                      You haven't added any products yet.
                    </p>
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="btn btn-primary"
                    >
                      Add Your First Product
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Catalog QR Code</h3>
              <p className="text-gray-600 mb-6">
                Scan this QR code to view your catalog
              </p>
              <div className="flex justify-center mb-6">
                <QRCodeSVG
                  value={catalogUrl}
                  size={220}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="btn btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard; 