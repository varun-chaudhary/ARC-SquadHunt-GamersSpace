
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getOpportunities, getPlayerJoinedOpportunities } from '@/services/api';
import PlayerLayout from '@/components/player/PlayerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Calendar, CheckCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PlayerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: allOpportunities, isLoading: isLoadingAll } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => getOpportunities(1, 3, 'approved'),
    enabled: !!user,
  });

  const { data: joinedOpportunities, isLoading: isLoadingJoined } = useQuery({
    queryKey: ['player-joined-opportunities', user?.id],
    queryFn: () => user ? getPlayerJoinedOpportunities(user.id, 1, 3) : Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 3, totalPages: 0 } }),
    enabled: !!user,
  });

  const isLoading = isLoadingAll || isLoadingJoined;

  if (isLoading) {
    return (
      <PlayerLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg font-medium">Loading...</span>
        </div>
      </PlayerLayout>
    );
  }

  return (
    <PlayerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome to your player dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/player/opportunities">
                  <Button className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Opportunities
                  </Button>
                </Link>
                <Link to="/player/my-opportunities">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    View My Opportunities
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Activity</CardTitle>
              <CardDescription>Summary of your participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Joined Opportunities</span>
                  </div>
                  <span className="text-2xl font-bold">{joinedOpportunities?.meta.total || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Available Opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Opportunities</CardTitle>
              <CardDescription>Recently approved opportunities you can join</CardDescription>
            </div>
            <Link to="/player/opportunities">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {allOpportunities && allOpportunities.data.length > 0 ? (
              <div className="space-y-4">
                {allOpportunities.data.map((opportunity) => (
                  <div key={opportunity.id} className="border-b pb-3 last:border-0">
                    <Link to={`/player/opportunities/${opportunity.id}`} className="block hover:bg-gray-50 rounded-md p-2 -mx-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{opportunity.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {opportunity.description.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Posted by {opportunity.organizer.name} • {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No opportunities are currently available.</p>
                <Link to="/player/opportunities" className="mt-4 inline-block">
                  <Button variant="outline">Check Back Later</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Opportunities</CardTitle>
              <CardDescription>Opportunities you have joined</CardDescription>
            </div>
            <Link to="/player/my-opportunities">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {joinedOpportunities && joinedOpportunities.data.length > 0 ? (
              <div className="space-y-4">
                {joinedOpportunities.data.map((opportunity) => (
                  <div key={opportunity.id} className="border-b pb-3 last:border-0">
                    <Link to={`/player/opportunities/${opportunity.id}`} className="block hover:bg-gray-50 rounded-md p-2 -mx-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{opportunity.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {opportunity.description.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Posted by {opportunity.organizer.name} • {formatDistanceToNow(new Date(opportunity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Joined
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't joined any opportunities yet.</p>
                <Link to="/player/opportunities" className="mt-4 inline-block">
                  <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Browse Opportunities
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PlayerLayout>
  );
};

export default PlayerDashboard;
