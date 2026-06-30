import { useState } from 'react';
import { useGetAdminSongsQuery, useDeleteAdminSongMutation } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import { Trash2 } from 'lucide-react';

export default function AdminSongs() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminSongsQuery({ page, limit: 20 });
  const [deleteSong] = useDeleteAdminSongMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Songs</h1>

      {isLoading ? <Spinner /> : (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-[#2A2A2A]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Song</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Artist</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Plays</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Likes</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((song) => (
                <tr key={song._id} className="border-b border-gray-50 dark:border-[#2A2A2A] hover:bg-gray-50 dark:hover:bg-[#242424]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {song.coverUrl && <img src={song.coverUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                      <span className="text-sm font-medium truncate max-w-[200px]">{song.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{song.artist?.username}</td>
                  <td className="px-5 py-3 text-sm">{song.plays?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm">{song.likes}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => { if (confirm('Delete this song?')) deleteSong(song._id); }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.pagination?.totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm ${page === i + 1 ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-[#242424]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
