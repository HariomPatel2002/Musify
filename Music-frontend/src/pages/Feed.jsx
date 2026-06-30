import { useGetFeedQuery } from '../api/usersApi';
import Spinner from '../components/ui/Spinner';
import SongCard from '../components/cards/SongCard';
import AlbumCard from '../components/cards/AlbumCard';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Music } from 'lucide-react';

export default function Feed() {
  const { data, isLoading } = useGetFeedQuery({ page: 1, limit: 20 });

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const feed = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-violet-500" />
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
      </div>

      {feed.length > 0 ? (
        <div className="space-y-4">
          {feed.map((item, i) => (
            <div key={`${item.type}-${item.item._id}-${i}`} className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold">
                  {item.user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-semibold">{item.user?.username}</span>
                  <span className="text-sm text-gray-500 dark:text-neutral-400">
                    {item.type === 'song' ? ' uploaded a new song' : ' created a new album'}
                  </span>
                </div>
                <span className="text-xs text-gray-400 ml-auto">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </div>
              {item.type === 'song' ? (
                <SongCard song={item.item} queue={[item.item]} />
              ) : (
                <div className="max-w-xs">
                  <AlbumCard album={item.item} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Music className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">No activity yet</p>
          <p className="text-sm">Follow artists to see their activity here</p>
        </div>
      )}
    </div>
  );
}
