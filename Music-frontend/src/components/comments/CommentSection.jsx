import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation, useLikeCommentMutation } from '../../api/commentsApi';
import { formatDistanceToNow } from 'date-fns';
import { Send, Trash2, Heart, MessageCircle } from 'lucide-react';
import Spinner from '../ui/Spinner';

export default function CommentSection({ songId }) {
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-violet-500" />
        <h3 className="font-semibold">Comments</h3>
        {data?.pagination?.count > 0 && (
          <span className="text-sm text-gray-500">({data.pagination.count})</span>
        )}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={!text.trim() || adding}
            className="px-4 py-2.5 bg-violet-500 text-white rounded-xl hover:bg-violet-600 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {isLoading ? (
        <Spinner />
      ) : data?.data?.length > 0 ? (
        <div className="space-y-3">
          {data.data.map((comment) => (
            <div key={comment._id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A]">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {comment.user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{comment.user?.username}</span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-neutral-300 mt-1">{comment.text}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => likeComment(comment._id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    {comment.likes > 0 && comment.likes}
                  </button>
                  {user?._id === comment.user?._id && (
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {data.pagination?.totalPages > page && (
            <button
              onClick={() => setPage(page + 1)}
              className="w-full py-2 text-sm text-violet-500 hover:text-violet-600 font-medium"
            >
              Load more comments
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-8">No comments yet. Be the first!</p>
      )}
    </div>
  );
}
