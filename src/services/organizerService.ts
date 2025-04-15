
import { Opportunity, PaginatedResponse } from '@/types';
import apiClient  from './apiClient';
import { getOpportunities } from './opportunityService';

export const getOrganizerOpportunities = async (
  organizerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  try {
    
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
   
    const response = await apiClient.get(`/organizers/${organizerId}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organizer dashboard stats:', error);
    throw error;
  }
};
