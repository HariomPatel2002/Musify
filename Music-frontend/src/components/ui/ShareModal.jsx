import { Music, Link, MessageCircle, Share2 } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, song }) {
  if (!isOpen || !song) return null;

  const songUrl = `${window.location.origin}/albums/${song.album?._id || ''}`;
  const shareText = `Listen to ${song.title} by ${song.artist?.username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(songUrl);
    alert('Link copied!');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ': ' + songUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(songUrl)}`, '_blank');
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: song.title, text: shareText, url: songUrl });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 w-80 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold mb-4">Share</h3>
        <div className="flex items-center gap-3 mb-5">
          {song.coverUrl ? (
            <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-[#242424] flex items-center justify-center">
              <Music className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{song.title}</p>
            <p className="text-xs text-gray-400 truncate">{song.artist?.username}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={copyLink} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-sm">
            <Link className="w-4 h-4" /> Copy Link
          </button>
          <button onClick={shareWhatsApp} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-sm">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
          <button onClick={shareTwitter} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-sm">
            <Share2 className="w-4 h-4" /> Twitter
          </button>
          {navigator.share && (
            <button onClick={nativeShare} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
