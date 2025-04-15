
import apiClient from './apiClient';
import { AuthUser } from '@/types';

// Mock user data for development when MongoDB is not available
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@arc.com',
    role: 'admin',
    password: 'admin123', // In a real app, passwords would be hashed
  },
  {
    id: '2',
    name: 'Organizer User',
    email: 'organizer@arc.com',
    role: 'organizer',
    password: 'organizer123',
  },
  {
    id: '3',
    name: 'Player User',
    email: 'player@arc.com',
    role: 'player',
    password: 'player123',
  },
];

export const login = async (email: string, password: string): Promise<AuthUser> => {
  try {
  
    // MongoDB-connected login for production
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Store the token
    localStorage.setItem('auth_token', token);
    
    return {
      ...user,
      token,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = (): void => {
  // Remove the token from storage
  localStorage.removeItem('auth_token');
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> => {
  try {

    await apiClient.post('/auth/register', userData);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
