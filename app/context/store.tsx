"use client"
import { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

type AuthContextType = {
  isLoggedIn: boolean;
  updateIsLoggedIn: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('https://crescent-api.vercel.app/auth/user', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const updateIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
  };

  const authContextValue: AuthContextType = {
    isLoggedIn,
    updateIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};