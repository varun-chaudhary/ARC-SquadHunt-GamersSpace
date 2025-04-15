
import { Opportunity, PaginatedResponse } from '@/types';

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
