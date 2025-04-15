
import { Opportunity, PaginatedResponse } from '@/types';
import apiClient, { useMockData } from './apiClient';
import { getOpportunities } from './opportunityService';

export const getOrganizerOpportunities = async (
  organizerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  try {
    if (useMockData) {
      // For mock data, we'll filter from the opportunity service
      console.log(`Getting opportunities for organizer ${organizerId} (MongoDB not connected)`);
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
    }

    // MongoDB-connected query
    const response = await apiClient.get(`/organizers/${organizerId}/opportunities`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching organizer opportunities:', error);
    throw error;
  }
};

export const getOrganizerDashboardStats = async (organizerId: string): Promise<any> => {
  try {
    if (useMockData) {
      // Mock stats
      console.log(`Getting dashboard stats for organizer ${organizerId} (MongoDB not connected)`);
      return {
        totalOpportunities: 12,
        pendingOpportunities: 3,
        approvedOpportunities: 7,
        closedOpportunities: 2,
        recentOpportunities: Array(5).fill(null).map((_, i) => ({
          id: `${i + 1}`,
          title: `Recent Opportunity ${i + 1}`,
          status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'closed',
          createdAt: new Date().toISOString(),
        })),
      };
    }

    // MongoDB-connected stats
    const response = await apiClient.get(`/organizers/${organizerId}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organizer dashboard stats:', error);
    throw error;
  }
};
