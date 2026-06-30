import { useSelector, useDispatch } from 'react-redux';
import { setVolume } from '../../features/player/playerSlice';
import { Volume2, VolumeX } from 'lucide-react';

export default function VolumeControl() {
  const dispatch = useDispatch();
  const { volume } = useSelector((state) => state.player);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => dispatch(setVolume(volume > 0 ? 0 : 0.7))}
        className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
        className="w-24 h-1 accent-violet-500 cursor-pointer"
      />
    </div>
  );
}
