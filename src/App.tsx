
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import OpportunitiesPage from "@/pages/admin/OpportunitiesPage";

// Organizer pages
import OrganizerDashboard from "@/pages/organizer/OrganizerDashboard";
import CreateOpportunity from "@/pages/organizer/CreateOpportunity";
import ManageOpportunities from "@/pages/organizer/ManageOpportunities";

// Player pages
import PlayerDashboard from "@/pages/player/PlayerDashboard";
import BrowseOpportunities from "@/pages/player/BrowseOpportunities";
import OpportunityDetails from "@/pages/player/OpportunityDetails";
import MyOpportunities from "@/pages/player/MyOpportunities";

const queryClient = new QueryClient();

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { getRoleBasedHomePath } = useAuth();
  return <Navigate to={getRoleBasedHomePath()} replace />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/opportunities" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <OpportunitiesPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected organizer routes */}
              <Route 
                path="/organizer" 
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/organizer/opportunities/create" 
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateOpportunity />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/organizer/opportunities" 
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <ManageOpportunities />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected player routes */}
              <Route 
                path="/player" 
                element={
                  <ProtectedRoute allowedRoles={['player']}>
                    <PlayerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/player/opportunities" 
                element={
                  <ProtectedRoute allowedRoles={['player']}>
                    <BrowseOpportunities />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/player/opportunities/:id" 
                element={
                  <ProtectedRoute allowedRoles={['player']}>
                    <OpportunityDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/player/my-opportunities" 
                element={
                  <ProtectedRoute allowedRoles={['player']}>
                    <MyOpportunities />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect root based on user role */}
              <Route path="/" element={<RoleBasedRedirect />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
