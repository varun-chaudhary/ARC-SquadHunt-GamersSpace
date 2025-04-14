
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen || !isMobile} toggleSidebar={toggleSidebar} />
      <AdminHeader toggleSidebar={toggleSidebar} />
      <main className="admin-main bg-admin-background">
        <div className="container mx-auto py-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
