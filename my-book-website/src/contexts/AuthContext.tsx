import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios'; // New import

// Define the shape of a user in our context
interface User {
  id: string;
  email: string;
  // Add other user profile properties as needed from the backend
  languages?: { language: string; level: string }[];
  frameworks?: string[];
  experience_years?: string;
  devices?: string[];
  architecture_familiarity?: string[];
}

// Define the shape of our AuthContext state
interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  signIn: (userData: User, token: string) => void;
  signOut: () => void;
  // Potentially add a method to update user profile
  updateProfile: (profileData: Partial<User>) => void;
}

// Create the context with a default (empty) value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initial loading state

  useEffect(() => {
    // Check for existing session (e.g., from local storage or cookie check)
    // For now, we'll assume no session initially and set isLoading to false
    // In a real app, you'd make an API call here to validate token/session
    const checkSession = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // For a real app, validate token here:
      // const token = localStorage.getItem('jwt-token'); // If stored in local storage
      // if (token) {
      //   try {
      //     const response = await axios.get('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } });
      //     setCurrentUser(response.data);
      //     setIsAuthenticated(true);
      //   } catch (error) {
      //     console.error('Session validation failed:', error);
      //     localStorage.removeItem('jwt-token');
      //   }
      // }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signIn = (userData: User, token: string) => {
    // In a real app, you might save the token to localStorage or set a cookie
    // localStorage.setItem('jwt-token', token);
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const signOut = async () => { // Made async
    try {
      await axios.post('/api/v1/auth/logout'); // Call backend logout endpoint
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, clear local state for UX
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = (profileData: Partial<User>) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...profileData };
    });
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, isLoading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
