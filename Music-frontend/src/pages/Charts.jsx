import { useState } from 'react';
import { useGetChartsQuery } from '../api/chartsApi';
import Spinner from '../components/ui/Spinner';
import SongCard from '../components/cards/SongCard';
import AlbumCard from '../components/cards/AlbumCard';
import { BarChart3, Flame, Star, Clock } from 'lucide-react';

const tabs = [
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'topLiked', label: 'Top Liked', icon: Star },
  { id: 'newReleases', label: 'New Releases', icon: Clock },
  { id: 'topAlbums', label: 'Top Albums', icon: BarChart3 },
];

export default function Charts() {
  const [activeTab, setActiveTab] = useState('trending');
  const { data, isLoading } = useGetChartsQuery();

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const charts = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-violet-500" />
        <h1 className="text-3xl font-bold tracking-tight">Charts</h1>
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-[#2A2A2A]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-500'
                : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'topAlbums' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {charts?.topAlbums?.map((album, i) => (
            <div key={album._id} className="relative">
              <span className="absolute top-2 left-2 z-10 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </span>
              <AlbumCard album={album} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          {charts?.[activeTab]?.map((song, i) => (
            <div key={song._id} className="relative">
              {i < 3 && (
                <span className="absolute top-3 left-3 z-10 text-lg">
                  {activeTab === 'trending' ? '🔥' : i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </span>
              )}
              <SongCard song={song} queue={charts[activeTab]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
