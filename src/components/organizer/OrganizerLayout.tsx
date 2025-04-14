
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, User, LogOut, Home } from 'lucide-react';

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

const OrganizerLayout: React.FC<OrganizerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">ARC Organizer Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 mr-8">
          <nav className="bg-white shadow rounded-lg p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/organizer"
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === '/organizer'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/organizer/opportunities/create"
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === '/organizer/opportunities/create'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <PlusCircle className="h-5 w-5 mr-3" />
                  Create Opportunity
                </Link>
              </li>
              <li>
                <Link
                  to="/organizer/opportunities"
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === '/organizer/opportunities'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Manage Opportunities
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white shadow rounded-lg p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
