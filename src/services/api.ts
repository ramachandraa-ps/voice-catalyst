// Firebase API service
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import app from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

// Auth API
export const authAPI = {
  // Register user
  register: async (userData: any) => {
    try {
      // Firebase authentication is handled separately
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
  
  // Login user
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      throw error;
    }
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userId: string, userData: any) => {
    try {
      await updateDoc(doc(db, "users", userId), userData);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

// Product API
export const productAPI = {
  // Get all products for a user
  getProducts: async (userId: string) => {
    try {
      const q = query(collection(db, "products"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const products: any[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single product
  getProduct: async (productId: string) => {
    try {
      const productDoc = await getDoc(doc(db, "products", productId));
      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new product
  createProduct: async (productData: any) => {
    try {
      const newProductRef = doc(collection(db, "products"));
      await setDoc(newProductRef, {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: newProductRef.id, ...productData };
    } catch (error) {
      throw error;
    }
  },
  
  // Update a product
  updateProduct: async (productId: string, productData: any) => {
    try {
      await updateDoc(doc(db, "products", productId), {
        ...productData,
        updatedAt: new Date()
      });
      return { id: productId, ...productData };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a product
  deleteProduct: async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  products: productAPI,
}; 