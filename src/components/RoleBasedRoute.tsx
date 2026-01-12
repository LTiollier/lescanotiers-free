import { Box, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee';
}

export function RoleBasedRoute({ children, requiredRole }: RoleBasedRouteProps) {
  const { isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (authLoading || profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // If no role required, just render children
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (profile?.role !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
