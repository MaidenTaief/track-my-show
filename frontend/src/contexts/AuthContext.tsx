import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'organizer' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // For demo purposes, check localStorage
      const savedUser = localStorage.getItem('admin_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Demo login - check credentials
      if (email === 'admin@trackmyshow.com' && password === 'admin123') {
        const mockUser = {
          id: '1',
          email: 'admin@trackmyshow.com',
          firstName: 'Bayazid',
          lastName: 'Hossain',
          role: 'super_admin' as const,
          avatar: undefined,
        };
        
        // Store user in localStorage for demo
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error: any) {
      toast.error('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 