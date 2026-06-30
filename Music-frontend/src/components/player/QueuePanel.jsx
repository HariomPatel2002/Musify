import { useSelector, useDispatch } from 'react-redux';
import { removeFromQueue, playFromQueue, clearQueue } from '../../features/player/playerSlice';
import { X, Trash2, GripVertical } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

export default function QueuePanel() {
  const dispatch = useDispatch();
  const { currentSong, queue, queueIndex } = useSelector((state) => state.player);

  return (
    <div className="w-80 bg-white dark:bg-[#1A1A1A] border-l border-gray-200 dark:border-[#2A2A2A] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A]">
        <h3 className="font-semibold text-sm">Queue</h3>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button onClick={() => dispatch(clearQueue())} className="text-xs text-gray-400 hover:text-red-500">
              Clear
            </button>
          )}
        </div>
      </div>

      {currentSong && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A]">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Now Playing</p>
          <div className="flex items-center gap-3">
            {currentSong.coverUrl ? (
              <img src={currentSong.coverUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-[#242424]" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist?.username}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {queue.length > 0 ? (
          <div className="space-y-1">
            {queue.map((song, index) => (
              <div
                key={`${song._id}-${index}`}
                onClick={() => dispatch(playFromQueue(index))}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer group transition-colors ${
                  index === queueIndex ? 'bg-violet-50 dark:bg-violet-500/10' : 'hover:bg-gray-100 dark:hover:bg-[#242424]'
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-300 dark:text-neutral-600 opacity-0 group-hover:opacity-100" />
                {song.coverUrl ? (
                  <img src={song.coverUrl} className="w-9 h-9 rounded object-cover flex-shrink-0" alt="" />
                ) : (
                  <div className="w-9 h-9 rounded bg-gray-200 dark:bg-[#242424] flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${index === queueIndex ? 'text-violet-500' : ''}`}>
                    {song.title}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{song.artist?.username}</p>
                </div>
                <span className="text-[10px] text-gray-400 tabular-nums">{formatTime(song.duration)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch(removeFromQueue(index)); }}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-8">Queue is empty</p>
        )}
      </div>
    </div>
  );
}
