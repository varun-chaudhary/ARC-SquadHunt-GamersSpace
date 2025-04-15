
import { PaginatedResponse, Role, User } from '@/types';
import apiClient from './apiClient';

// Users APIs
export const getUsers = async (
  page: number = 1, 
  limit: number = 10, 
  role?: Role
): Promise<PaginatedResponse<User>> => {
  try {
   
    const response = await apiClient.get('/users', {
      params: { page, limit, role },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
   
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
   
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};
