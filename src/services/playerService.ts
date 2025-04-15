
import { Opportunity, PaginatedResponse } from '@/types';
import apiClient from './apiClient';
import { getOpportunities } from './opportunityService';

export const getPlayerOpportunities = async (
  playerId: string,
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<Opportunity>> => {
  try {
  
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

    await apiClient.post(`/players/${playerId}/opportunities/${opportunityId}/join`);
  } catch (error) {
    console.error('Error joining opportunity:', error);
    throw error;
  }
};

export const registerForOpportunity = async (playerId: string, opportunityId: string): Promise<void> => {
  try {
   
    await apiClient.post(`/players/${playerId}/opportunities/${opportunityId}/register`);
  } catch (error) {
    console.error('Error registering for opportunity:', error);
    throw error;
  }
};

export const getPlayerDashboardStats = async (playerId: string): Promise<any> => {
  try {
   
    const response = await apiClient.get(`/players/${playerId}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching player dashboard stats:', error);
    throw error;
  }
};
