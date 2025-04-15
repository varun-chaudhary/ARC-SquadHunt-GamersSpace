
import { Opportunity, OpportunityStatus, PaginatedResponse, User } from '@/types';

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
