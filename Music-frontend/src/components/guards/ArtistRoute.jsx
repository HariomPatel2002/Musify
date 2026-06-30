import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function ArtistRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'artist' && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
