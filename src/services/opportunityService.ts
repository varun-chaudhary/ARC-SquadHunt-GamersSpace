
import { Opportunity, OpportunityStatus, PaginatedResponse, User } from '@/types';
import apiClient from './apiClient';

// Opportunities APIs
export const getOpportunities = async (
  page: number = 1, 
  limit: number = 10, 
  status?: OpportunityStatus
): Promise<PaginatedResponse<Opportunity>> => {
  try {

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
    await apiClient.patch(`/opportunities/${id}/status`, { status });
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    throw error;
  }
};

export const createOpportunity = async (opportunityData: Partial<Opportunity>): Promise<Opportunity> => {
  try {
    const response = await apiClient.post('/opportunities', opportunityData);
    return response.data;
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    throw error;
  }
};

export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  try {
    const response = await apiClient.get(`/opportunities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting opportunity:', error);
    throw error;
  }
};
