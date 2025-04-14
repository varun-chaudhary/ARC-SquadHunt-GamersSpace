
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, Role } from '@/types';
import { login as apiLogin, logout as apiLogout } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: Role | Role[]) => boolean;
  getRoleBasedHomePath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      // For demo purposes, we'll just set a mock user
      // In a real app, you would validate the token with the backend
      
      // Try to get user info from localStorage if available
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          setUser(userInfo);
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_info');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await apiLogin(email, password);
      setUser(user);
      
      // Store user info in localStorage for persistence
      localStorage.setItem('user_info', JSON.stringify(user));
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    // Clear user info from localStorage
    localStorage.removeItem('user_info');
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  // Check if user has one of the specified roles
  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Get the home path based on user role
  const getRoleBasedHomePath = (): string => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'organizer':
        return '/organizer';
      case 'player':
        return '/player';
      default:
        return '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        getRoleBasedHomePath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
