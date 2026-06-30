import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function AlbumCard({ album }) {
  return (
    <Link
      to={`/albums/${album._id}`}
      className="group bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-[#242424] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative mb-3">
        {album.coverUrl ? (
          <img src={album.coverUrl} alt={album.title} className="w-full aspect-square rounded-lg object-cover" />
        ) : (
          <div className="w-full aspect-square rounded-lg bg-gray-200 dark:bg-[#242424] flex items-center justify-center text-gray-400">
            No Cover
          </div>
        )}
        <button className="absolute bottom-2 right-2 w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200">
          <Play className="w-5 h-5 text-white ml-0.5" />
        </button>
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-medium text-white">
          Album
        </span>
      </div>
      <p className="text-sm font-semibold truncate">{album.title}</p>
      <p className="text-xs text-gray-500 dark:text-neutral-400 truncate mt-0.5">
        {album.artist?.username} · {album.releaseYear}
      </p>
    </Link>
  );
}
