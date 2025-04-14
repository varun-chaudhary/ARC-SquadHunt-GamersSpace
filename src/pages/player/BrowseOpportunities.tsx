
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOpportunities } from '@/services/api';
import PlayerLayout from '@/components/player/PlayerLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Search, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

const BrowseOpportunities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities', currentPage, itemsPerPage],
    queryFn: () => getOpportunities(currentPage, itemsPerPage, 'approved'),
  });

  // Filter opportunities based on search term
  const filteredOpportunities = opportunities?.data.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (opportunities && currentPage < opportunities.meta.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <PlayerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Browse Opportunities</h2>
          <p className="text-gray-500 mt-1">Discover and join available opportunities</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Opportunities List */}
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg font-medium">Loading...</span>
          </div>
        ) : filteredOpportunities && filteredOpportunities.length > 0 ? (
          <>
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/player/opportunities/${opportunity.id}`} className="block">
                        <h3 className="text-lg font-medium hover:text-blue-600 transition-colors">{opportunity.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {opportunity.description.substring(0, 200)}
                        {opportunity.description.length > 200 ? '...' : ''}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-gray-400">
                        <span>Posted by {opportunity.organizer.name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <Link to={`/player/opportunities/${opportunity.id}`}>
                      <Button size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination controls */}
            {opportunities && opportunities.meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {opportunities.meta.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleNextPage}
                  disabled={currentPage === opportunities.meta.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No opportunities found{searchTerm ? ' matching your search' : ''}.</p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </PlayerLayout>
  );
};

export default BrowseOpportunities;
