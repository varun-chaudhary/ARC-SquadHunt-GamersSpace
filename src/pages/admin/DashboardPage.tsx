import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserCountsByRole } from '@/services/userService';
import { getOpportunitiesCount } from '@/services/opportunityService';

const DashboardPage = () => {
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [opportunityCount, setOpportunityCount] = useState<number>(0);

  useEffect(() => {
    const fetchOpportunityCount = async () => {
      try {
        const count = await getOpportunitiesCount();
        setOpportunityCount(count);
      } catch (error) {
        console.error('Failed to fetch opportunity count', error);
      }
    };
    fetchOpportunityCount();
  
  }, []);


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getUserCountsByRole();
        const counts: Record<string, number> = {};
        data.forEach(item => {
          counts[item._id] = item.count;
        });
        setUserCounts(counts);
      } catch (error) {
        console.error('Failed to fetch user counts', error);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: (userCounts['player'] || 0) + (userCounts['organizer'] || 0),
      description: 'Active platform users',
      icon: <Users className="h-5 w-5 text-admin-primary" />,
      path: '/admin/users'
    },
    {
      title: 'Players',
      value: userCounts['player'] || 0,
      description: 'Registered players',
      icon: <Trophy className="h-5 w-5 text-admin-primary" />,
      path: '/admin/users?role=player'
    },
    {
      title: 'Organizers',
      value: userCounts['organizer'] || 0,
      description: 'Event organizers',
      icon: <Calendar className="h-5 w-5 text-admin-primary" />,
      path: '/admin/users?role=organizer'
    },
    {
      title: 'Opportunities',
      value: opportunityCount, // Replace with real count if you have API for it
      description: 'Total opportunities',
      icon: <CheckCircle className="h-5 w-5 text-admin-primary" />,
      path: '/admin/opportunities'
    }
  ];

  return (
    <AdminLayout>
      {/* Same JSX content as before */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the ARC Admin Panel. Manage users and opportunities from here.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <Link 
                  to={stat.path} 
                  className="text-xs text-admin-primary hover:underline mt-2 inline-block"
                >
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* rest of the dashboard content stays unchanged */}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
