
import { PaginatedResponse, Role, User } from '@/types';
import apiClient, { useMockData } from './apiClient';

// Users APIs
export const getUsers = async (
  page: number = 1, 
  limit: number = 10, 
  role?: Role
): Promise<PaginatedResponse<User>> => {
  try {
    if (useMockData) {
      // Mock data for development when MongoDB is not available
      console.log('Using mock data (MongoDB not connected)');
      const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: (i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'organizer' : 'player') as Role,
        status: 'active',
        isDeleted: i % 10 === 0,
        deletedAt: i % 10 === 0 ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
      }));

      // Filter by role if provided
      const filteredUsers = role 
        ? mockUsers.filter(user => user.role === role) 
        : mockUsers;

      // Calculate pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = filteredUsers.slice(start, end);

      return {
        data: paginatedUsers,
        meta: {
          total: filteredUsers.length,
          page,
          limit,
          totalPages: Math.ceil(filteredUsers.length / limit),
        },
      };
    }

    // MongoDB connection for production
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
    if (useMockData) {
      // Mock deletion (would update in MongoDB in production)
      console.log(`Soft deleting user with ID: ${id} (MongoDB not connected)`);
      return;
    }

    // MongoDB-connected deletion
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    if (useMockData) {
      // Mock get user by ID
      console.log(`Getting user with ID: ${id} (MongoDB not connected)`);
      const mockUser: User = {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
        role: 'player',
        status: 'active',
        isDeleted: false,
        createdAt: new Date().toISOString(),
      };
      return mockUser;
    }

    // MongoDB-connected get user
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};
