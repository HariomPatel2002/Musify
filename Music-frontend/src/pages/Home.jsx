import { useGetSongsQuery } from '../api/songsApi';
import { useGetAlbumsQuery } from '../api/albumsApi';
import { useGetPlaylistsQuery } from '../api/playlistsApi';
import { useGetHistoryQuery } from '../api/historyApi';
import { useGetChartsQuery } from '../api/chartsApi';
import SongCard from '../components/cards/SongCard';
import AlbumCard from '../components/cards/AlbumCard';
import PlaylistCard from '../components/cards/PlaylistCard';
import Spinner from '../components/ui/Spinner';
import { useSelector } from 'react-redux';
import { Music, Flame } from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const { data: songsData, isLoading: songsLoading } = useGetSongsQuery({ page: 1, limit: 20 });
  const { data: albumsData } = useGetAlbumsQuery({ page: 1, limit: 10 });
  const { data: playlistsData } = useGetPlaylistsQuery();
  const { data: historyData } = useGetHistoryQuery(undefined, { skip: !user });
  const { data: chartsData } = useGetChartsQuery();

  if (songsLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  const recentlyPlayed = historyData?.data?.map((h) => h.song).filter(Boolean) || [];
  const trending = chartsData?.data?.trending?.slice(0, 5) || [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.username}</h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1">What do you want to listen to?</p>
      </div>

      {recentlyPlayed.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Recently Played</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentlyPlayed.slice(0, 5).map((song) => (
              <SongCard key={song._id} song={song} queue={recentlyPlayed} />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Trending Now
          </h2>
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
            {trending.map((song, i) => (
              <div key={song._id} className="relative flex items-center">
                <span className="w-10 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                <div className="flex-1">
                  <SongCard song={song} queue={trending} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {playlistsData?.data?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlistsData.data.slice(0, 5).map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}

      {albumsData?.data?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">New Releases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albumsData.data.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">All Songs</h2>
        {songsData?.data?.length > 0 ? (
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
            {songsData.data.map((song) => (
              <SongCard key={song._id} song={song} queue={songsData.data} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Music className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No songs yet</p>
            <p className="text-sm">Upload some music to get started</p>
          </div>
        )}
      </section>
    </div>
  );
}
