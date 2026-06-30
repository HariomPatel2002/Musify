import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAlbumQuery } from '../api/albumsApi';
import { useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation, useLikeCommentMutation } from '../api/commentsApi';
import { useSelector } from 'react-redux';
import Spinner from '../components/ui/Spinner';
import { Play, Clock, Trash2, Heart, Send, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AlbumPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetAlbumQuery(id);
  const { user } = useSelector((state) => state.auth);
  const [selectedSongId, setSelectedSongId] = useState(null);

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const album = data?.data;
  if (!album) return <p className="text-gray-500 dark:text-neutral-400">Album not found.</p>;

  const totalDuration = album.songs?.reduce((acc, s) => acc + (s.duration || 0), 0);
  const mins = Math.floor((totalDuration || 0) / 60);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
        {album.coverUrl ? (
          <img src={album.coverUrl} alt={album.title} className="w-48 h-48 rounded-xl object-cover shadow-2xl" />
        ) : (
          <div className="w-48 h-48 rounded-xl bg-gray-200 dark:bg-[#242424] flex items-center justify-center text-gray-400">
            No Cover
          </div>
        )}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">Album</p>
          <h1 className="text-4xl font-bold tracking-tight mt-1">{album.title}</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-2">
            {album.artist?.username} · {album.releaseYear} · {album.songs?.length || 0} songs · {mins} min
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-14 h-14 bg-violet-500 hover:bg-violet-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all">
          <Play className="w-6 h-6 text-white ml-0.5" />
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
        {album.songs?.map((song, i) => (
          <div key={song._id}>
            <div
              onClick={() => setSelectedSongId(selectedSongId === song._id ? null : song._id)}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors group cursor-pointer ${selectedSongId === song._id ? 'bg-gray-50 dark:bg-[#242424]' : ''}`}
            >
              <span className="w-6 text-sm text-gray-400 dark:text-neutral-500 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{song.title}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">{song.artist?.username}</p>
              </div>
              <MessageCircle className={`w-4 h-4 transition-colors ${selectedSongId === song._id ? 'text-violet-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`} />
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400 dark:text-neutral-500 opacity-0 group-hover:opacity-100" />
                <span className="text-sm text-gray-400 dark:text-neutral-500 tabular-nums">
                  {Math.floor((song.duration || 0) / 60)}:{String((song.duration || 0) % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
            {selectedSongId === song._id && (
              <div className="px-4 pb-4 border-b border-gray-100 dark:border-[#2A2A2A]">
                <CommentSection songId={song._id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentSection({ songId }) {
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetCommentsQuery({ songId, page, limit: 10 });
  const [addComment, { isLoading: adding }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [likeComment] = useLikeCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment({ songId, text: text.trim() });
    setText('');
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-violet-500" />
        Comments {data?.pagination?.count > 0 && <span className="text-gray-400">({data.pagination.count})</span>}
      </h4>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={!text.trim() || adding}
            className="px-3 py-2 bg-violet-500 text-white rounded-xl hover:bg-violet-600 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {isLoading ? (
        <Spinner />
      ) : data?.data?.length > 0 ? (
        <div className="space-y-2">
          {data.data.map((comment) => (
            <div key={comment._id} className="flex gap-3 p-2 rounded-lg bg-gray-50 dark:bg-[#1A1A1A]">
              <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {comment.user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{comment.user?.username}</span>
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-neutral-300 mt-0.5">{comment.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => likeComment(comment._id)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500">
                    <Heart className="w-3 h-3" /> {comment.likes > 0 && comment.likes}
                  </button>
                  {user?._id === comment.user?._id && (
                    <button onClick={() => deleteComment(comment._id)} className="text-[10px] text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {data.pagination?.totalPages > page && (
            <button onClick={() => setPage(page + 1)} className="w-full py-1.5 text-xs text-violet-500 hover:text-violet-600 font-medium">
              Load more
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-4">No comments yet</p>
      )}
    </div>
  );
}
