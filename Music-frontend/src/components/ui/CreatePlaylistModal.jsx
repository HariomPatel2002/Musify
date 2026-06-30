import { useState } from 'react';
import { useCreatePlaylistMutation } from '../../api/playlistsApi';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function CreatePlaylistModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [createPlaylist, { isLoading }] = useCreatePlaylistMutation();

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createPlaylist({ name: name.trim(), description: description.trim(), isPublic }).unwrap();
      setName('');
      setDescription('');
      setIsPublic(true);
      onCreated?.();
      onClose();
    } catch (err) {
      console.error('Failed to create playlist');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Playlist">
      <div className="flex flex-col gap-4">
        <Input
          label="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Playlist"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            placeholder="Add an optional description"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`w-10 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-violet-500' : 'bg-gray-300 dark:bg-[#333]'}`}
            onClick={() => setIsPublic(!isPublic)}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isPublic ? 'left-5' : 'left-1'}`} />
          </div>
          <span className="text-sm text-gray-700 dark:text-neutral-300">Make public</span>
        </label>
        <Button onClick={handleCreate} disabled={!name.trim() || isLoading} className="w-full py-3">
          {isLoading ? 'Creating...' : 'Create Playlist'}
        </Button>
      </div>
    </Modal>
  );
}
