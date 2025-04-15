
import { Opportunity, PaginatedResponse } from '@/types';
import apiClient, { useMockData } from './apiClient';
import { getOpportunities } from './opportunityService';

export const getPlayerOpportunities = async (
  playerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  try {
    if (useMockData) {
      // Mock data - in a real app, these would be opportunities that the player has registered for
      console.log(`Getting opportunities for player ${playerId} (MongoDB not connected)`);
      
      // For mock data, randomly select some from all opportunities
      const allOpportunities = await getOpportunities(1, 100);
      const randomOpportunities = allOpportunities.data
        .filter(opp => opp.status === 'approved')
        .filter((_, i) => i % 3 === 0); // Just take every third one
      
      // Calculate pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedOpportunities = randomOpportunities.slice(start, end);

      return {
        data: paginatedOpportunities,
        meta: {
          total: randomOpportunities.length,
          page,
          limit,
          totalPages: Math.ceil(randomOpportunities.length / limit),
        },
      };
    }

    // MongoDB-connected query
    const response = await apiClient.get(`/players/${playerId}/opportunities`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching player opportunities:', error);
    throw error;
  }
};

// Add the missing function that was causing the errors
export const getPlayerJoinedOpportunities = async (
  playerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  try {
    if (useMockData) {
      // Mock data for joined opportunities
      console.log(`Getting joined opportunities for player ${playerId} (MongoDB not connected)`);
      
      // For mock data, randomly select some from all opportunities to simulate joined ones
      const allOpportunities = await getOpportunities(1, 100);
      const joinedOpportunities = allOpportunities.data
        .filter(opp => opp.status === 'approved')
        .filter((_, i) => i % 4 === 0); // Just take every fourth one as "joined"
      
      // Calculate pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedOpportunities = joinedOpportunities.slice(start, end);

      return {
        data: paginatedOpportunities,
        meta: {
          total: joinedOpportunities.length,
          page,
          limit,
          totalPages: Math.ceil(joinedOpportunities.length / limit),
        },
      };
    }

    // MongoDB-connected query for joined opportunities
    const response = await apiClient.get(`/players/${playerId}/joined-opportunities`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching player joined opportunities:', error);
    throw error;
  }
};

export const joinOpportunity = async (opportunityId: string, playerId: string): Promise<void> => {
  try {
    if (useMockData) {
      // Mock joining an opportunity
      console.log(`Player ${playerId} joining opportunity ${opportunityId} (MongoDB not connected)`);
      return;
    }

    // MongoDB-connected operation
    await apiClient.post(`/players/${playerId}/opportunities/${opportunityId}/join`);
  } catch (error) {
    console.error('Error joining opportunity:', error);
    throw error;
  }
};

export const registerForOpportunity = async (playerId: string, opportunityId: string): Promise<void> => {
  try {
    if (useMockData) {
      // Mock registration
      console.log(`Registering player ${playerId} for opportunity ${opportunityId} (MongoDB not connected)`);
      return;
    }

    // MongoDB-connected registration
    await apiClient.post(`/players/${playerId}/opportunities/${opportunityId}/register`);
  } catch (error) {
    console.error('Error registering for opportunity:', error);
    throw error;
  }
};

export const getPlayerDashboardStats = async (playerId: string): Promise<any> => {
  try {
    if (useMockData) {
      // Mock stats
      console.log(`Getting dashboard stats for player ${playerId} (MongoDB not connected)`);
      return {
        registeredOpportunities: 5,
        upcomingOpportunities: 3,
        pastOpportunities: 2,
        recentlyRegistered: Array(3).fill(null).map((_, i) => ({
          id: `${i + 1}`,
          title: `Recent Registration ${i + 1}`,
          eventDate: new Date(Date.now() + (i * 86400000)).toISOString(), // Future dates
          location: `Location ${i + 1}`,
        })),
      };
    }

    // MongoDB-connected stats
    const response = await apiClient.get(`/players/${playerId}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player dashboard stats:', error);
    throw error;
  }
};
