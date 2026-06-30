import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playSong, setQueue, playNext, addToQueue } from '../../features/player/playerSlice';
import { usePlaySongMutation, useLikeSongMutation } from '../../api/songsApi';
import { Play, Pause, Heart, MoreHorizontal, ListPlus, Share2, Download, SkipForward } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';
import AddToPlaylistModal from '../ui/AddToPlaylistModal';
import ShareModal from '../ui/ShareModal';

export default function SongCard({ song, queue = [] }) {
  const dispatch = useDispatch();
  const [triggerPlay] = usePlaySongMutation();
  const [likeSong] = useLikeSongMutation();
  const { currentSong, isPlaying } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.auth);
  const isCurrent = currentSong?._id === song._id;
  const menuRef = useRef(null);

  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const isSongLiked = user?.likedSongs?.some((s) => (s._id || s) === song._id);
    setLiked(!!isSongLiked);
  }, [user?.likedSongs, song._id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handlePlay = (e) => {
    e.stopPropagation();
    dispatch(playSong(song));
    if (queue.length > 0) dispatch(setQueue(queue));
    triggerPlay(song._id);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    likeSong(song._id).unwrap().catch(() => setLiked((prev) => !prev));
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <>
      <div
        onClick={handlePlay}
        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#242424] cursor-pointer group transition-all duration-200"
      >
        <div className="relative flex-shrink-0">
          {song.coverUrl ? (
            <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-[#242424] flex items-center justify-center text-gray-400 text-xs">No Cover</div>
          )}
          <button onClick={handlePlay} className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isCurrent && isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-violet-500' : ''}`}>{song.title}</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{song.artist?.username}</p>
        </div>
        <span className="text-xs text-gray-400 dark:text-neutral-500 hidden sm:block">{song.genre}</span>
        <span className="text-xs text-gray-400 dark:text-neutral-500 tabular-nums">{formatTime(song.duration)}</span>
        <button onClick={handleLike} className={`transition-colors flex-shrink-0 ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button onClick={handleMenuClick} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-[#333]">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-xl shadow-xl py-1 z-50" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { dispatch(playNext(song)); setShowMenu(false); }} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-[#242424] w-full">
                <SkipForward className="w-4 h-4" /> Play Next
              </button>
              <button onClick={() => { dispatch(addToQueue(song)); setShowMenu(false); }} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-[#242424] w-full">
                <ListPlus className="w-4 h-4" /> Add to Queue
              </button>
              <button onClick={() => { setShowMenu(false); setShowPlaylistModal(true); }} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-[#242424] w-full">
                <ListPlus className="w-4 h-4" /> Add to Playlist
              </button>
              <button onClick={() => { setShowMenu(false); setShowShareModal(true); }} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-[#242424] w-full">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          )}
        </div>
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal isOpen={showPlaylistModal} onClose={() => setShowPlaylistModal(false)} songId={song._id} />
      )}
      {showShareModal && (
        <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} song={song} />
      )}
    </>
  );
}
