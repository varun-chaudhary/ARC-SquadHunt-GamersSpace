
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Mock statistics for the dashboard
  const stats = [
    {
      title: 'Total Users',
      value: '1,250',
      description: 'Active platform users',
      icon: <Users className="h-5 w-5 text-admin-primary" />,
      path: '/admin/users'
    },
    {
      title: 'Players',
      value: '950',
      description: 'Registered players',
      icon: <Trophy className="h-5 w-5 text-admin-primary" />,
      path: '/admin/users?role=player'
    },
    {
      title: 'Organizers',
      value: '250',
      description: 'Event organizers',
      icon: <Calendar className="h-5 w-5 text-admin-primary" />,
      path: '/admin/users?role=organizer'
    },
    {
      title: 'Opportunities',
      value: '320',
      description: 'Total opportunities',
      icon: <CheckCircle className="h-5 w-5 text-admin-primary" />,
      path: '/admin/opportunities'
    }
  ];

  return (
    <AdminLayout>
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Recently registered users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">User {10 - i}</p>
                      <p className="text-sm text-muted-foreground">user{10-i}@example.com</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {i === 0 ? 'Just now' : `${i} hour${i > 1 ? 's' : ''} ago`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Opportunities</CardTitle>
              <CardDescription>
                Recently posted opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">Opportunity {10 - i}</p>
                      <p className="text-sm text-muted-foreground">Posted by Organizer {i + 1}</p>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        i % 3 === 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : i % 3 === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Approved' : 'Closed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
