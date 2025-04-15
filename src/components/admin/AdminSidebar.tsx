
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Home, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, toggleSidebar }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Opportunities', 
      path: '/admin/opportunities', 
      icon: <Calendar className="w-5 h-5" /> 
    },
  ];

  return (
    <aside className={cn(
      "admin-sidebar w-64 bg-admin-primary text-white",
      open ? 'open' : ''
    )}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-admin-primary/30">
        <Link to="/admin" className="font-bold text-xl">ARC Admin</Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="md:hidden text-white hover:text-white hover:bg-admin-primary/90"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-white/10 text-white"
                : "hover:bg-white/5 text-white/80 hover:text-white"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
     
    </aside>
  );
};

export default AdminSidebar;
