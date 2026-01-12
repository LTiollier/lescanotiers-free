import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { Activities } from './pages/Activities';
import { Cycles } from './pages/Cycles';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Parcels } from './pages/Parcels';
import { Signup } from './pages/Signup';
import { Times } from './pages/Times';
import { Vegetables } from './pages/Vegetables';

function App() {
  const { user, isLoading } = useAuth();

  // Redirect to dashboard if already logged in
  if (!isLoading && user) {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parcels" element={<Parcels />} />
            <Route path="/vegetables" element={<Vegetables />} />
            <Route path="/cycles" element={<Cycles />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/times" element={<Times />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/vegetables" element={<Vegetables />} />
          <Route path="/cycles" element={<Cycles />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/times" element={<Times />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
