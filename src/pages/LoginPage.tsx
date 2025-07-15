import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FormInput from '../components/FormInput';
import { DUMMY_USERS } from '../utils/dummyData';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '', // In a real app, this would be an OTP
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const auth = getAuth(app);
    const email = formData.email;
    const password = formData.password;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsSubmitting(false);
      navigate('/dashboard');
    } catch (error: any) {
      setIsSubmitting(false);
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      // Set userId in localStorage for Dashboard
      localStorage.setItem('userId', result.user.uid);
      setIsSubmitting(false);
      navigate('/dashboard');
    } catch (error: any) {
      setIsSubmitting(false);
      setError(error.message);
    }
  };
  
  return (
    <Layout showLoginButton={false}>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gradient">Login to Your Account</h1>
        
        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormInput
              id="email"
              label="Email ID"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            
            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-3"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full btn btn-secondary py-3 mt-2 flex items-center justify-center"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path d="M44.5 20H24v8.5h11.7C34.1 33.7 29.5 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z" fill="#FFC107"/><path d="M6.3 14.7l7 5.1C15.5 17.1 19.4 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.6 4 24 4c-7.1 0-13.1 3.7-16.7 9.3z" fill="#FF3D00"/><path d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.6 35.7 27 36.5 24 36.5c-5.5 0-10.1-3.3-12-8.1l-7 5.4C7.9 40.3 15.4 44 24 44z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2.1l-7 5.4C15.9 41.7 19.7 44 24 44c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z" fill="#1976D2"/></g></svg>
                Sign in with Google
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 