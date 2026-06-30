import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLyrics } from '../../features/player/playerSlice';
import { X } from 'lucide-react';

export default function LyricsPanel() {
  const dispatch = useDispatch();
  const { currentSong } = useSelector((state) => state.player);

  return (
    <div className="w-80 bg-white dark:bg-[#1A1A1A] border-l border-gray-200 dark:border-[#2A2A2A] flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A]">
        <h3 className="font-semibold text-sm">Lyrics</h3>
        <button onClick={() => dispatch(toggleLyrics())} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {currentSong ? (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="text-center mb-6">
            {currentSong.coverUrl && (
              <img src={currentSong.coverUrl} className="w-32 h-32 rounded-xl mx-auto mb-3 shadow-lg object-cover" alt="" />
            )}
            <p className="font-semibold">{currentSong.title}</p>
            <p className="text-sm text-gray-400">{currentSong.artist?.username}</p>
          </div>

          {currentSong.lyrics ? (
            <div className="whitespace-pre-line text-sm text-gray-600 dark:text-neutral-300 leading-relaxed text-center">
              {currentSong.lyrics}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Lyrics not available for this song
            </p>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">Play a song to see lyrics</p>
        </div>
      )}
    </div>
  );
}
