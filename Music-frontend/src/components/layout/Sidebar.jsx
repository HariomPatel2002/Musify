import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Search, Library, Music, Plus, Activity, Shield, BarChart3 } from 'lucide-react';
import { useGetMyPlaylistsQuery } from '../../api/playlistsApi';
import { useSelector } from 'react-redux';
import CreatePlaylistModal from '../ui/CreatePlaylistModal';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Your Library', icon: Library },
  { to: '/feed', label: 'Activity', icon: Activity },
  { to: '/charts', label: 'Charts', icon: BarChart3 },
];

export default function Sidebar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data, refetch } = useGetMyPlaylistsQuery(undefined, { skip: !isAuthenticated, refetchOnMountOrArgChange: true });
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <aside className="w-64 h-screen flex flex-col bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-[#2A2A2A] overflow-hidden">
        <div className="p-6 pb-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Musify</span>
          </Link>
        </div>

        <nav className="px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold'
                    : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#242424]'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold'
                    : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#242424]'
                }`
              }
            >
              <Shield className="w-5 h-5" />
              Admin
            </NavLink>
          )}
        </nav>

        {isAuthenticated && (
          <div className="mt-6 px-3 flex-1 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-500">
                Playlists
              </h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {data?.data?.map((playlist) => (
                <NavLink
                  key={playlist._id}
                  to={`/playlists/${playlist._id}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                      isActive
                        ? 'bg-gray-100 dark:bg-[#242424] text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#242424]/50'
                    }`
                  }
                >
                  {playlist.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </aside>

      <CreatePlaylistModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={refetch} />
    </>
  );
}
