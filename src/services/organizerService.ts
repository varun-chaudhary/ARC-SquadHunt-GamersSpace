
import { Opportunity, PaginatedResponse } from '@/types';
import { getOpportunities } from './opportunityService';

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
