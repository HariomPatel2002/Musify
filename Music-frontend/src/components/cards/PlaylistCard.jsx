import { Link } from 'react-router-dom';
import { Play, Music } from 'lucide-react';

export default function PlaylistCard({ playlist }) {
  return (
    <Link
      to={`/playlists/${playlist._id}`}
      className="group bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-[#242424] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative mb-3">
        {playlist.coverUrl ? (
          <img src={playlist.coverUrl} alt={playlist.name} className="w-full aspect-square rounded-lg object-cover" />
        ) : (
          <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Music className="w-10 h-10 text-white/70" />
          </div>
        )}
        <button className="absolute bottom-2 right-2 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200">
          <Play className="w-5 h-5 text-white ml-0.5" />
        </button>
      </div>
      <p className="text-sm font-semibold truncate">{playlist.name}</p>
      <p className="text-xs text-gray-500 dark:text-neutral-400 truncate mt-0.5">
        {playlist.songs?.length || 0} songs
      </p>
    </Link>
  );
}
