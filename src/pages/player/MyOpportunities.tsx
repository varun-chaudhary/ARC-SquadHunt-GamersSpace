
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getPlayerJoinedOpportunities } from '@/services/api';
import PlayerLayout from '@/components/player/PlayerLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

const MyOpportunities: React.FC = () => {
  const { user } = useAuth();
  
  const { data: joinedOpportunities, isLoading } = useQuery({
    queryKey: ['player-joined-opportunities', user?.id],
    queryFn: () => user ? getPlayerJoinedOpportunities(user.id) : Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }),
    enabled: !!user,
  });

  return (
    <PlayerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Opportunities</h2>
          <p className="text-gray-500 mt-1">Opportunities you have joined</p>
        </div>

        {/* Opportunities List */}
        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg font-medium">Loading...</span>
          </div>
        ) : joinedOpportunities && joinedOpportunities.data.length > 0 ? (
          <div className="space-y-4">
            {joinedOpportunities.data.map((opportunity) => (
              <Card key={opportunity.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/player/opportunities/${opportunity.id}`} className="block">
                      <h3 className="text-lg font-medium hover:text-blue-600 transition-colors">
                        {opportunity.title}
                      </h3>
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
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Joined
                    </span>
                    <Link to={`/player/opportunities/${opportunity.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">You haven't joined any opportunities yet.</p>
            <Link to="/player/opportunities">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Browse Opportunities
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PlayerLayout>
  );
};

export default MyOpportunities;
