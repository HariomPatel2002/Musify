import { useGetStatsQuery } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import { Users, Music, Disc, Play, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useGetStatsQuery();

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const stats = data?.data;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Songs', value: stats?.totalSongs, icon: Music, color: 'bg-green-500' },
    { label: 'Total Albums', value: stats?.totalAlbums, icon: Disc, color: 'bg-purple-500' },
    { label: 'Total Plays', value: stats?.totalPlays?.toLocaleString(), icon: Play, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-neutral-400">{card.label}</span>
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">
              +{stats?.newUsersToday || 0} users today · +{stats?.newSongsToday || 0} songs today
            </p>
          </div>
        ))}
      </div>

      {stats?.topSongs?.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#2A2A2A]">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              Top Songs
            </h2>
          </div>
          {stats.topSongs.map((song, i) => (
            <div key={song._id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors">
              <span className="w-6 text-sm text-gray-400 text-center">{i + 1}</span>
              {song.coverUrl && <img src={song.coverUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{song.title}</p>
                <p className="text-xs text-gray-500">{song.artist?.username}</p>
              </div>
              <span className="text-sm text-gray-400">{song.plays?.toLocaleString()} plays</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
