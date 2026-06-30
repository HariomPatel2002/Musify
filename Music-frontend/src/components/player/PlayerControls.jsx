import { useSelector, useDispatch } from 'react-redux';
import { togglePlay, nextSong, prevSong, toggleShuffle, toggleRepeat } from '../../features/player/playerSlice';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1 } from 'lucide-react';

export default function PlayerControls() {
  const dispatch = useDispatch();
  const { isPlaying, isShuffle, repeatMode } = useSelector((state) => state.player);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => dispatch(toggleShuffle())}
        className={`transition-colors ${isShuffle ? 'text-violet-500' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'}`}
      >
        <Shuffle className="w-4 h-4" />
      </button>
      <button
        onClick={() => dispatch(prevSong())}
        className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <SkipBack className="w-5 h-5" />
      </button>
      <button
        onClick={() => dispatch(togglePlay())}
        className="w-9 h-9 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white dark:text-gray-900" />
        ) : (
          <Play className="w-5 h-5 text-white dark:text-gray-900 ml-0.5" />
        )}
      </button>
      <button
        onClick={() => dispatch(nextSong())}
        className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <SkipForward className="w-5 h-5" />
      </button>
      <button
        onClick={() => dispatch(toggleRepeat())}
        className={`transition-colors ${repeatMode !== 'off' ? 'text-violet-500' : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'}`}
      >
        {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
      </button>
    </div>
  );
}
