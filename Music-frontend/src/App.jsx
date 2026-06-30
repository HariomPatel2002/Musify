import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/guards/PrivateRoute';
import ArtistRoute from './components/guards/ArtistRoute';
import AdminRoute from './components/guards/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Library from './pages/Library';
import AlbumPage from './pages/AlbumPage';
import PlaylistPage from './pages/PlaylistPage';
import ArtistPage from './pages/ArtistPage';
import Upload from './pages/Upload';
import Feed from './pages/Feed';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSongs from './pages/admin/AdminSongs';
import Charts from './pages/Charts';
import useAuthRecovery from './hooks/useAuthRecovery';
import Spinner from './components/ui/Spinner';

export default function App() {
  const { isLoading } = useAuthRecovery();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F0F0F]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          <Route path="/playlists/:id" element={<PlaylistPage />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/charts" element={<Charts />} />
          <Route element={<ArtistRoute />}>
            <Route path="/upload" element={<Upload />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/songs" element={<AdminSongs />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
