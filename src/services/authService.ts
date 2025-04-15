
import apiClient, { useMockData } from './apiClient';
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
    if (useMockData) {
      // Mock login for development
      console.log('Using mock login (MongoDB not connected)');
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Generate a mock token
      const token = `mock_token_${user.id}_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      
      // Return user without the password
      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token,
      } as AuthUser;
    }

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
    if (useMockData) {
      // Mock registration (would be implemented with MongoDB in production)
      console.log('Mock registration (MongoDB not connected):', userData);
      return;
    }
    
    // MongoDB-connected registration
    await apiClient.post('/auth/register', userData);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
