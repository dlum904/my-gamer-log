import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserLists } from '../context/UserListsContext';

export default function CommentSection({ gameId }: { gameId: number }) {
  const { user } = useAuth();
  const { getComments, addComment, deleteComment } = useUserLists();
  const [text, setText] = useState('');
  const comments = getComments(gameId);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    addComment(gameId, text.trim());
    setText('');
  };

  return (
    <section className="space-y-3">
      <h3 className="border-b border-steam-accent/30 pb-1 text-sm font-medium uppercase tracking-wider text-white">
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2 rounded-sm bg-steam-panel/80 p-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={3}
            placeholder="Add a comment..."
            className="w-full resize-y rounded-sm bg-[#222b35] p-2 text-sm text-white outline-none focus:ring-1 focus:ring-steam-accent"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-sm bg-gradient-to-r from-[#75b022] to-[#588a1b] px-4 py-1.5 text-sm text-white hover:brightness-110"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <p className="rounded-sm bg-steam-panel/80 p-3 text-sm text-steam-muted">
          Log in to leave a comment.
        </p>
      )}

      <ul className="space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-sm bg-steam-panel/60 p-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-bold text-steam-accent">{comment.username}</span>
              <span className="flex items-center gap-3 text-steam-muted">
                {new Date(comment.createdAt).toLocaleString()}
                {user?.username === comment.username && (
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className="hover:text-red-400"
                  >
                    delete
                  </button>
                )}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-steam-text">{comment.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
