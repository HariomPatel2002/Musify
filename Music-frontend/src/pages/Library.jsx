import { useState } from 'react';
import { useGetPlaylistsQuery } from '../api/playlistsApi';
import { useGetMeQuery } from '../api/authApi';
import { useGetHistoryQuery, useClearHistoryMutation } from '../api/historyApi';
import PlaylistCard from '../components/cards/PlaylistCard';
import SongCard from '../components/cards/SongCard';
import Spinner from '../components/ui/Spinner';
import { Music, Heart, Clock, Trash2 } from 'lucide-react';

export default function Library() {
  const [activeTab, setActiveTab] = useState('playlists');
  const { data: playlistData, isLoading: playlistsLoading } = useGetPlaylistsQuery();
  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const { data: historyData, isLoading: historyLoading } = useGetHistoryQuery(undefined, { skip: activeTab !== 'history' });
  const [clearHistory] = useClearHistoryMutation();

  const likedSongs = meData?.data?.likedSongs || [];
  const isLoading = activeTab === 'playlists' ? playlistsLoading : activeTab === 'liked' ? meLoading : historyLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>

      <div className="flex gap-1 border-b border-gray-200 dark:border-[#2A2A2A]">
        {[
          { id: 'playlists', label: 'Playlists', icon: Music },
          { id: 'liked', label: 'Liked Songs', icon: Heart, count: likedSongs.length },
          { id: 'history', label: 'History', icon: Clock },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && <span className="text-xs bg-violet-500/10 text-violet-500 px-1.5 py-0.5 rounded-full">{tab.count}</span>}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : activeTab === 'playlists' ? (
        playlistData?.data?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlistData.data.map((playlist) => <PlaylistCard key={playlist._id} playlist={playlist} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Music className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No playlists yet</p>
          </div>
        )
      ) : activeTab === 'liked' ? (
        likedSongs.length > 0 ? (
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
            {likedSongs.map((song) => <SongCard key={song._id} song={song} queue={likedSongs} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Heart className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No liked songs yet</p>
          </div>
        )
      ) : (
        historyData?.data?.length > 0 ? (
          <div>
            <div className="flex justify-end mb-3">
              <button onClick={() => clearHistory()} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" /> Clear history
              </button>
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
              {historyData.data.map((h) => h.song && <SongCard key={h._id} song={h.song} queue={historyData.data.map((x) => x.song).filter(Boolean)} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Clock className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No listening history</p>
          </div>
        )
      )}
    </div>
  );
}
