import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPlaylistQuery, useRemoveSongFromPlaylistMutation } from '../api/playlistsApi';
import Spinner from '../components/ui/Spinner';
import { Play, Music, Clock, Trash2, AlertCircle } from 'lucide-react';

export default function PlaylistPage() {
  const { id } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetPlaylistQuery(id, { skip: !id });
  const [removeSong] = useRemoveSongFromPlaylistMutation();
  const { user } = useSelector((state) => state.auth);

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
        <p className="text-lg font-medium">Failed to load playlist</p>
        <p className="text-sm">{error?.data?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  const playlist = data?.data;
  if (!playlist) return <p className="text-gray-500 dark:text-neutral-400">Playlist not found.</p>;

  const isOwner = user?._id === playlist.owner?._id;
  const totalDuration = playlist.songs?.reduce((acc, s) => acc + (s.duration || 0), 0);
  const mins = Math.floor((totalDuration || 0) / 60);

  const handleRemove = (e, songId) => {
    e.stopPropagation();
    removeSong({ id: playlist._id, songId });
  };

  return (
    <div key={location.pathname} className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
        {playlist.coverUrl ? (
          <img src={playlist.coverUrl} alt={playlist.name} className="w-48 h-48 rounded-xl object-cover shadow-2xl" />
        ) : (
          <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Music className="w-16 h-16 text-white/70" />
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">Playlist</p>
          <h1 className="text-4xl font-bold tracking-tight mt-1">{playlist.name}</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-2">
            {playlist.owner?.username} · {playlist.songs?.length || 0} songs · {mins} min
          </p>
          {playlist.description && (
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{playlist.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-14 h-14 bg-violet-500 hover:bg-violet-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all">
          <Play className="w-6 h-6 text-white ml-0.5" />
        </button>
      </div>

      {playlist.songs?.length > 0 ? (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          {playlist.songs.map((song, i) => (
            <div key={song._id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors group">
              <span className="w-6 text-sm text-gray-400 dark:text-neutral-500 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{song.title}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">{song.artist?.username}</p>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && (
                  <button
                    onClick={(e) => handleRemove(e, song._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <Clock className="w-4 h-4 text-gray-400 dark:text-neutral-500 opacity-0 group-hover:opacity-100" />
                <span className="text-sm text-gray-400 dark:text-neutral-500 tabular-nums">
                  {Math.floor((song.duration || 0) / 60)}:{String((song.duration || 0) % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Music className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">No songs in this playlist</p>
          <p className="text-sm">Add some songs to get started</p>
        </div>
      )}
    </div>
  );
}
