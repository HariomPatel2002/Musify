import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyPlaylistsQuery, useAddSongToPlaylistMutation } from '../../api/playlistsApi';
import Modal from '../ui/Modal';
import { Check, Music } from 'lucide-react';

export default function AddToPlaylistModal({ isOpen, onClose, songId }) {
  const { data } = useGetMyPlaylistsQuery();
  const [addSongToPlaylist] = useAddSongToPlaylistMutation();
  const [addedTo, setAddedTo] = useState([]);

  const handleAdd = async (playlistId) => {
    try {
      await addSongToPlaylist({ id: playlistId, songId }).unwrap();
      setAddedTo((prev) => [...prev, playlistId]);
    } catch (e) {}
  };

  const handleClose = () => {
    setAddedTo([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add to Playlist">
      <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
        {data?.data?.length > 0 ? (
          data.data.map((playlist) => {
            const isAdded = addedTo.includes(playlist._id) || playlist.songs?.some((s) => (s._id || s) === songId);
            return (
              <button
                key={playlist._id}
                onClick={() => !isAdded && handleAdd(playlist._id)}
                disabled={isAdded}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  isAdded
                    ? 'bg-green-500/10 text-green-500'
                    : 'hover:bg-gray-100 dark:hover:bg-[#242424]'
                }`}
              >
                {playlist.coverUrl ? (
                  <img src={playlist.coverUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white/70" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{playlist.name}</p>
                  <p className="text-xs text-gray-400">{playlist.songs?.length || 0} songs</p>
                </div>
                {isAdded && <Check className="w-4 h-4 text-green-500 flex-shrink-0" />}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No playlists yet. Create one first!</p>
        )}
      </div>
    </Modal>
  );
}
