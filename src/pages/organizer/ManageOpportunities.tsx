
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getOrganizerOpportunities } from '@/services/api';
import OrganizerLayout from '@/components/organizer/OrganizerLayout';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { OpportunityStatus } from '@/types';

const ManageOpportunities: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | 'all'>('all');
  
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['organizer-opportunities', user?.id],
    queryFn: () => user ? getOrganizerOpportunities(user.id) : Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }),
    enabled: !!user,
  });

  const filteredOpportunities = opportunities?.data.filter(opp => 
    statusFilter === 'all' || opp.status === statusFilter
  );

  return (
    <OrganizerLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Manage Opportunities</h2>
            <p className="text-gray-500 mt-1">View and manage all your opportunities</p>
          </div>
          <Link to="/organizer/opportunities/create" className="mt-4 md:mt-0">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>

        {/* Filter controls */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('pending')}
            size="sm"
            className="flex items-center"
          >
            <Clock className="mr-1 h-3 w-3 text-amber-500" />
            Pending
          </Button>
          <Button 
            variant={statusFilter === 'approved' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('approved')}
            size="sm"
            className="flex items-center"
          >
            <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
            Approved
          </Button>
          <Button 
            variant={statusFilter === 'closed' ? 'default' : 'outline'} 
            onClick={() => setStatusFilter('closed')}
            size="sm"
            className="flex items-center"
          >
            <XCircle className="mr-1 h-3 w-3 text-gray-500" />
            Closed
          </Button>
        </div>

        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg font-medium">Loading...</span>
          </div>
        ) : filteredOpportunities && filteredOpportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.title}</TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {opportunity.status === 'pending' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 inline-flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {opportunity.status === 'approved' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 inline-flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approved
                        </span>
                      )}
                      {opportunity.status === 'closed' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 inline-flex items-center">
                          <XCircle className="mr-1 h-3 w-3" />
                          Closed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md">
            <p className="text-gray-500 mb-4">No opportunities found.</p>
            <Link to="/organizer/opportunities/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Opportunity
              </Button>
            </Link>
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default ManageOpportunities;
