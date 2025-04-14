
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getOrganizerOpportunities } from '@/services/api';
import OrganizerLayout from '@/components/organizer/OrganizerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['organizer-opportunities', user?.id],
    queryFn: () => user ? getOrganizerOpportunities(user.id) : Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }),
    enabled: !!user,
  });

  // Count opportunities by status
  const pendingCount = opportunities?.data.filter(opp => opp.status === 'pending').length || 0;
  const approvedCount = opportunities?.data.filter(opp => opp.status === 'approved').length || 0;
  const closedCount = opportunities?.data.filter(opp => opp.status === 'closed').length || 0;
  const totalCount = opportunities?.meta.total || 0;

  if (isLoading) {
    return (
      <OrganizerLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg font-medium">Loading...</span>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of your opportunities and activities</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/organizer/opportunities/create">
                  <Button className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Opportunity
                  </Button>
                </Link>
                <Link to="/organizer/opportunities">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Opportunities
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Statistics</CardTitle>
              <CardDescription>Overview of your opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-2xl font-bold">{totalCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Pending</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-2xl font-bold">{pendingCount}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Approved</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-2xl font-bold">{approvedCount}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Closed</span>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-2xl font-bold">{closedCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
            <CardDescription>Your most recently created opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {opportunities && opportunities.data.length > 0 ? (
              <div className="space-y-4">
                {opportunities.data.slice(0, 5).map((opportunity) => (
                  <div key={opportunity.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{opportunity.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{opportunity.description.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center">
                        {opportunity.status === 'pending' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span>
                        )}
                        {opportunity.status === 'approved' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                        )}
                        {opportunity.status === 'closed' && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Closed</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't created any opportunities yet.</p>
                <Link to="/organizer/opportunities/create" className="mt-4 inline-block">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Opportunity
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OrganizerLayout>
  );
};

export default OrganizerDashboard;
