
import { PaginatedResponse, Role, User } from '@/types';

// Users APIs
export const getUsers = async (
  page: number = 1, 
  limit: number = 10, 
  role?: Role
): Promise<PaginatedResponse<User>> => {
  // For demo purposes, we'll mock the data
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
};

export const deleteUser = async (id: string): Promise<void> => {
  // In a real implementation, this would call the API
  console.log(`Soft deleting user with ID: ${id}`);
};
