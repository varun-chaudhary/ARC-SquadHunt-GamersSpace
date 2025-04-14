import axios from 'axios';
import { AuthUser, Opportunity, OpportunityStatus, PaginatedResponse, Role, User } from '@/types';

// For demo purposes we'll use a mock API base URL
const API_BASE_URL = 'https://api.arc-admin.demo';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication APIs
export const login = async (email: string, password: string): Promise<AuthUser> => {
  // For demo purposes, we'll mock the login API with different user types
  const mockUsers = {
    'admin@arc.com': {
      id: '1',
      name: 'Admin User',
      email: 'admin@arc.com',
      role: 'admin' as Role,
      password: 'admin123',
      token: 'mock_jwt_token_for_admin_user',
    },
    'organizer@arc.com': {
      id: '2',
      name: 'Organizer User',
      email: 'organizer@arc.com',
      role: 'organizer' as Role,
      password: 'organizer123',
      token: 'mock_jwt_token_for_organizer_user',
    },
    'player@arc.com': {
      id: '3',
      name: 'Player User',
      email: 'player@arc.com',
      role: 'player' as Role,
      password: 'player123',
      token: 'mock_jwt_token_for_player_user',
    },
  };
  
  const user = mockUsers[email as keyof typeof mockUsers];
  
  if (user && user.password === password) {
    const { password: _, ...authUser } = user;
    localStorage.setItem('auth_token', authUser.token);
    return authUser;
  }
  
  throw new Error('Invalid credentials');
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
};

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

// Opportunities APIs
export const getOpportunities = async (
  page: number = 1, 
  limit: number = 10, 
  status?: OpportunityStatus
): Promise<PaginatedResponse<Opportunity>> => {
  // For demo purposes, we'll mock the data
  const mockOrganizers: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: `org_${i + 1}`,
    name: `Organizer ${i + 1}`,
    email: `organizer${i + 1}@example.com`,
    role: 'organizer',
    status: 'active',
    isDeleted: false,
    createdAt: new Date().toISOString(),
  }));

  const mockOpportunities: Opportunity[] = Array.from({ length: 40 }, (_, i) => {
    const statuses: OpportunityStatus[] = ['pending', 'approved', 'closed'];
    const randomStatus = statuses[i % 3];
    const organizer = mockOrganizers[i % mockOrganizers.length];
    
    return {
      id: `${i + 1}`,
      title: `Opportunity ${i + 1}`,
      description: `Description for opportunity ${i + 1}`,
      organizerId: organizer.id,
      organizer,
      status: randomStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Filter by status if provided
  const filteredOpportunities = status 
    ? mockOpportunities.filter(opp => opp.status === status) 
    : mockOpportunities;

  // Calculate pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedOpportunities = filteredOpportunities.slice(start, end);

  return {
    data: paginatedOpportunities,
    meta: {
      total: filteredOpportunities.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOpportunities.length / limit),
    },
  };
};

export const updateOpportunityStatus = async (id: string, status: OpportunityStatus): Promise<void> => {
  // In a real implementation, this would call the API
  console.log(`Updating opportunity ${id} status to ${status}`);
};

// New APIs for organizers
export const createOpportunity = async (opportunityData: Partial<Opportunity>): Promise<Opportunity> => {
  try {
    // For demo purposes, we'll mock the response
    console.log('Creating opportunity:', opportunityData);
    
    // In a real MERN implementation, you would post to MongoDB through an Express API
    // const response = await api.post('/api/opportunities', opportunityData);
    // return response.data;
    
    // Mock successful response
    return {
      id: Math.floor(Math.random() * 1000).toString(),
      title: opportunityData.title || '',
      description: opportunityData.description || '',
      location: opportunityData.location || '',
      eventDate: opportunityData.eventDate || new Date().toISOString(),
      capacity: opportunityData.capacity || 10,
      organizerId: opportunityData.organizerId || '2',
      organizer: {
        id: '2',
        name: 'Organizer User',
        email: 'organizer@arc.com',
        role: 'organizer',
        status: 'active',
        isDeleted: false,
        createdAt: new Date().toISOString(),
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    throw error;
  }
};

export const getOrganizerOpportunities = async (
  organizerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  // For demo purposes, we'll mock the data and filter by organizerId
  const allOpportunities = await getOpportunities(1, 100);
  const filteredOpportunities = allOpportunities.data.filter(opp => opp.organizerId === organizerId);
  
  // Calculate pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedOpportunities = filteredOpportunities.slice(start, end);

  return {
    data: paginatedOpportunities,
    meta: {
      total: filteredOpportunities.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOpportunities.length / limit),
    },
  };
};

// New APIs for players
export const joinOpportunity = async (opportunityId: string, playerId: string): Promise<void> => {
  // In a real app, this would call the API to join an opportunity
  console.log(`Player ${playerId} joining opportunity ${opportunityId}`);
};

export const getPlayerJoinedOpportunities = async (
  playerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  // For demo purposes, we'll mock the data
  // In a real app, this would call the API to get the opportunities that the player has joined
  const mockJoinedOpportunities: Opportunity[] = Array.from({ length: 5 }, (_, i) => ({
    id: `${i + 1}`,
    title: `Joined Opportunity ${i + 1}`,
    description: `Description for joined opportunity ${i + 1}`,
    organizerId: '2',
    organizer: {
      id: '2',
      name: 'Organizer User',
      email: 'organizer@arc.com',
      role: 'organizer',
      status: 'active',
      isDeleted: false,
      createdAt: new Date().toISOString(),
    },
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  // Calculate pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedOpportunities = mockJoinedOpportunities.slice(start, end);

  return {
    data: paginatedOpportunities,
    meta: {
      total: mockJoinedOpportunities.length,
      page,
      limit,
      totalPages: Math.ceil(mockJoinedOpportunities.length / limit),
    },
  };
};

export default api;
