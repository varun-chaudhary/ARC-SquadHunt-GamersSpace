
import { Opportunity, OpportunityStatus, PaginatedResponse, User } from '@/types';
import apiClient, { useMockData } from './apiClient';

// Opportunities APIs
export const getOpportunities = async (
  page: number = 1, 
  limit: number = 10, 
  status?: OpportunityStatus
): Promise<PaginatedResponse<Opportunity>> => {
  try {
    if (useMockData) {
      // Mock data for development when MongoDB is not available
      console.log('Using mock opportunity data (MongoDB not connected)');
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
    }

    // MongoDB connection for production
    const response = await apiClient.get('/opportunities', {
      params: { page, limit, status },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
};

export const updateOpportunityStatus = async (id: string, status: OpportunityStatus): Promise<void> => {
  try {
    if (useMockData) {
      // Mock update (would update in MongoDB in production)
      console.log(`Updating opportunity ${id} status to ${status} (MongoDB not connected)`);
      return;
    }

    // MongoDB-connected update
    await apiClient.patch(`/opportunities/${id}/status`, { status });
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    throw error;
  }
};

export const createOpportunity = async (opportunityData: Partial<Opportunity>): Promise<Opportunity> => {
  try {
    if (useMockData) {
      // Mock creation (would create in MongoDB in production)
      console.log('Creating opportunity (MongoDB not connected):', opportunityData);
      
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
    }

    // MongoDB-connected creation
    const response = await apiClient.post('/opportunities', opportunityData);
    return response.data;
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    throw error;
  }
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  try {
    if (useMockData) {
      // Mock get opportunity by ID
      console.log(`Getting opportunity with ID: ${id} (MongoDB not connected)`);
      const mockOpportunity: Opportunity = {
        id,
        title: `Opportunity ${id}`,
        description: `Description for opportunity ${id}`,
        location: 'Mock Location',
        eventDate: new Date().toISOString(),
        capacity: 20,
        organizerId: 'org_1',
        organizer: {
          id: 'org_1',
          name: 'Organizer 1',
          email: 'organizer1@example.com',
          role: 'organizer',
          status: 'active',
          isDeleted: false,
          createdAt: new Date().toISOString(),
        },
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return mockOpportunity;
    }

    // MongoDB-connected get
    const response = await apiClient.get(`/opportunities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting opportunity:', error);
    throw error;
  }
};
