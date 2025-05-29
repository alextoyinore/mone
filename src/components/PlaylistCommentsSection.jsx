import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

export default function PlaylistCommentsSection({ playlistId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/comments/playlist/${playlistId}`)
      .then(res => res.ok ? res.json() : [])
      .then(setComments)
      .finally(() => setLoading(false));
  }, [playlistId]);

  const postComment = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/comments/playlist/${playlistId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.email, text })
      });
      const comment = await res.json();
      setComments(c => [comment, ...c]);
      setText("");
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (id) => {
    await fetch(`http://localhost:5000/api/comments/${id}`, { method: "DELETE" });
    setComments(c => c.filter(com => com._id !== id));
  };

  return (
    <div className="mt-8 bg-white/80 dark:bg-black/80 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Comments</h3>
      {user && (
        <form onSubmit={postComment} className="flex gap-2 mb-6">
          <input
            className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Add a comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={posting}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition disabled:opacity-60" type="submit" disabled={posting || !text.trim()}>
            Post
          </button>
        </form>
      )}
      {loading ? <div>Loading...</div> : (
        <div className="flex flex-col gap-3">
          {comments.length === 0 && <div className="text-gray-500">No comments yet.</div>}
          {comments.map(com => (
            <div key={com._id} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 shadow-sm">
              <div className="flex-1">
                <div className="font-semibold text-blue-700 dark:text-blue-300">{com.user}</div>
                <div className="text-gray-800 dark:text-gray-100 mb-1">{com.text}</div>
                <div className="text-xs text-gray-500">{new Date(com.createdAt).toLocaleString()}</div>
              </div>
              {user && (user.email === com.user) && (
                <button className="ml-2 text-red-500 hover:text-red-700 text-xs font-semibold" onClick={() => deleteComment(com._id)} title="Delete">Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
