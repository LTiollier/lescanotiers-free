import { Box, CircularProgress } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages
const Activities = lazy(() =>
  import('./pages/Activities').then((m) => ({ default: m.Activities })),
);
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })));
const Cycles = lazy(() => import('./pages/Cycles').then((m) => ({ default: m.Cycles })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Forbidden = lazy(() => import('./pages/Forbidden').then((m) => ({ default: m.Forbidden })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Parcels = lazy(() => import('./pages/Parcels').then((m) => ({ default: m.Parcels })));
const Times = lazy(() => import('./pages/Times').then((m) => ({ default: m.Times })));
const UserManagement = lazy(() =>
  import('./pages/UserManagement').then((m) => ({ default: m.UserManagement })),
);
const Vegetables = lazy(() =>
  import('./pages/Vegetables').then((m) => ({ default: m.Vegetables })),
);

const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const routes = (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/403" element={<Forbidden />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parcels" element={<Parcels />} />
            <Route path="/vegetables" element={<Vegetables />} />
            <Route path="/cycles" element={<Cycles />} />
            <Route
              path="/activities"
              element={
                <RoleBasedRoute requiredRole="admin">
                  <Activities />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <RoleBasedRoute requiredRole="admin">
                  <Analytics />
                </RoleBasedRoute>
              }
            />
            <Route path="/times" element={<Times />} />
            <Route
              path="/users"
              element={
                <RoleBasedRoute requiredRole="admin">
                  <UserManagement />
                </RoleBasedRoute>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );

  return routes;
}

export default App;
