import { useSelector, useDispatch } from 'react-redux';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import SleepTimer from './SleepTimer';
import usePlayer from '../../hooks/usePlayer';
import { toggleQueue, toggleLyrics, toggleEqualizer } from '../../features/player/playerSlice';
import { ListMusic, Mic2, SlidersHorizontal, Heart } from 'lucide-react';

export default function Player() {
  const dispatch = useDispatch();
  const { currentSong, showQueue, showLyrics, showEqualizer } = useSelector((state) => state.player);
  const { seek } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="h-20 bg-white dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-[#2A2A2A] px-4 flex items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-3 w-64 min-w-0">
        {currentSong.coverUrl ? (
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-14 h-14 rounded-lg object-cover shadow-lg" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-[#242424] flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Cover</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{currentSong.title}</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{currentSong.artist?.username}</p>
        </div>
        <button className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1 px-6 max-w-2xl mx-auto">
        <PlayerControls />
        <ProgressBar seek={seek} />
      </div>

      <div className="w-72 flex items-center justify-end gap-1">
        <button
          onClick={() => dispatch(toggleLyrics())}
          className={`p-1.5 rounded-lg transition-colors ${showLyrics ? 'text-violet-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Mic2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => dispatch(toggleEqualizer())}
          className={`p-1.5 rounded-lg transition-colors ${showEqualizer ? 'text-violet-500' : 'text-gray-400 hover:text-white'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <SleepTimer />
        <button
          onClick={() => dispatch(toggleQueue())}
          className={`p-1.5 rounded-lg transition-colors ${showQueue ? 'text-violet-500' : 'text-gray-400 hover:text-white'}`}
        >
          <ListMusic className="w-4 h-4" />
        </button>
        <VolumeControl />
      </div>
    </div>
  );
}
