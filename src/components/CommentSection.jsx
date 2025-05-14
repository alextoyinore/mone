import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import MentionDropdown from "./MentionDropdown";

export default function CommentSection({ type, id, parent = null, depth = 0 }) {
  const [editing, setEditing] = useState({});
  const [editText, setEditText] = useState({});
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [loadingReply, setLoadingReply] = useState({});

  // Mention autocomplete state
  const [mentionUsers, setMentionUsers] = useState([]);
  const [mentionPos, setMentionPos] = useState(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const commentInputRef = useRef();
  const [activeInput, setActiveInput] = useState(null); // 'comment' or replyId

  // Fetch comments or replies
  useEffect(() => {
    if (!parent) {
      fetch(`http://localhost:5000/api/comments/${type}/${id}?user=${user?.email || ""}`)
        .then(res => res.json())
        .then(setComments);
    } else {
      fetch(`http://localhost:5000/api/comments/replies/${parent}?user=${user?.email || ""}`)
        .then(res => res.json())
        .then(data => setReplies(r => ({ ...r, [parent]: data })));
    }
  }, [type, id, user, parent]);

  // Mention autocomplete fetch
  useEffect(() => {
    if (mentionQuery && mentionQuery.length > 0) {
      fetch(`/api/users/search?q=${mentionQuery}`)
        .then(res => res.json())
        .then(setMentionUsers);
    }
  }, [mentionQuery]);

  // Post a new top-level comment
  const postComment = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/comments/${type}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.email, text })
    });
    const newComment = await res.json();
    setComments([newComment, ...comments]);
    setText("");
    setLoading(false);
  };

  // Post a reply to a comment
  const postReply = async (parentId) => {
    if (!replyText[parentId]?.trim()) return;
    setLoadingReply(lr => ({ ...lr, [parentId]: true }));
    const res = await fetch(`http://localhost:5000/api/comments/${type}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.email, text: replyText[parentId], parent: parentId })
    });
    const newReply = await res.json();
    setReplies(r => ({ ...r, [parentId]: [ ...(r[parentId] || []), newReply ] }));
    setReplyText(rt => ({ ...rt, [parentId]: "" }));
    setShowReplyForm(srf => ({ ...srf, [parentId]: false }));
    setLoadingReply(lr => ({ ...lr, [parentId]: false }));
  };

  // Save edited comment
  const saveEdit = async (commentId) => {
    if (!editText[commentId]?.trim()) return;
    const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.email, text: editText[commentId] })
    });
    const updated = await res.json();
    setComments(cs => cs.map(c => c._id === commentId ? { ...c, text: updated.text } : c));
    setReplies(r => {
      const updatedR = { ...r };
      Object.keys(updatedR).forEach(pid => {
        updatedR[pid] = updatedR[pid]?.map(c => c._id === commentId ? { ...c, text: updated.text } : c);
      });
      return updatedR;
    });
    setEditing(e => ({ ...e, [commentId]: false }));
  };

  // Like/unlike comment
  const likeComment = async commentId => {
    const res = await fetch(`http://localhost:5000/api/comments/${commentId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.email })
    });
    const data = await res.json();
    setComments(cs => cs.map(c => c._id === commentId ? { ...c, likeCount: data.likeCount, liked: data.liked } : c));
    setReplies(r => {
      const updated = { ...r };
      Object.keys(updated).forEach(pid => {
        updated[pid] = updated[pid]?.map(c => c._id === commentId ? { ...c, likeCount: data.likeCount, liked: data.liked } : c);
      });
      return updated;
    });
  };

  // Delete comment
  const deleteComment = async commentId => {
    if (!window.confirm("Delete this comment?")) return;
    await fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.email })
    });
    setComments(cs => cs.filter(c => c._id !== commentId));
    setReplies(r => {
      const updated = { ...r };
      Object.keys(updated).forEach(pid => {
        updated[pid] = updated[pid]?.filter(c => c._id !== commentId);
      });
      return updated;
    });
  };

  // Show/hide and fetch replies thread
  const handleShowReplies = async (commentId) => {
    if (!replies[commentId]) {
      const res = await fetch(`http://localhost:5000/api/comments/replies/${commentId}?user=${user?.email || ""}`);
      const data = await res.json();
      setReplies(r => ({ ...r, [commentId]: data }));
    }
    setShowReplies(sr => ({ ...sr, [commentId]: !sr[commentId] }));
  };

  return (
    <div className={depth === 0 ? "mt-8" : "ml-8 mt-3"}>
      {depth === 0 && <h3 className="text-xl font-bold mb-3">Comments</h3>}
      {depth === 0 && user && (
        <form onSubmit={postComment} className="flex gap-2 mb-4">
          <div className="relative w-full">
            <input
              ref={commentInputRef}
              value={text}
              onChange={e => {
                setText(e.target.value);
                setActiveInput("comment");
                const caret = e.target.selectionStart;
                const before = e.target.value.slice(0, caret);
                const match = before.match(/@([\w]*)$/);
                if (match) {
                  setMentionQuery(match[1]);
                  setMentionPos({ top: e.target.offsetTop + e.target.offsetHeight, left: e.target.offsetLeft });
                } else {
                  setMentionQuery("");
                  setMentionUsers([]);
                }
              }}
              onBlur={() => setTimeout(() => setMentionUsers([]), 200)}
              className="flex-1 border rounded p-2"
              placeholder="Add a comment..."
              disabled={loading}
            />
            <MentionDropdown
              users={mentionUsers}
              onSelect={user => {
                const caret = commentInputRef.current.selectionStart;
                const before = text.slice(0, caret).replace(/@([\w]*)$/, `@${user.name}`);
                const after = text.slice(caret);
                setText(before + after + " ");
                setMentionUsers([]);
                setTimeout(() => commentInputRef.current.focus(), 0);
              }}
              position={{ top: 38, left: 0 }}
            />
          </div>
          <button type="submit" className="bg-lime-600 text-white px-4 py-1 rounded" disabled={loading || !text.trim()}>
            Post
          </button>
        </form>
      )}
      <div className="flex flex-col gap-4">
        {((depth === 0 ? comments : replies[parent]) || []).length === 0 && depth === 0 && <div className="text-gray-500">No comments yet.</div>}
        {((depth === 0 ? comments : replies[parent]) || []).map(c => (
          <div key={c._id} className="bg-white rounded shadow p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{c.user}</span>
              <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
              {user?.email === c.user && (
                <>
                  <button className="ml-2 text-xs text-blue-500" onClick={() => setEditing(e => ({ ...e, [c._id]: true }))}>Edit</button>
                  <button className="ml-2 text-xs text-red-500" onClick={() => deleteComment(c._id)}>Delete</button>
                </>
              )}
            </div>
            <div className="mb-2 text-gray-800 whitespace-pre-line">
              {editing[c._id] ? (
                <form onSubmit={e => { e.preventDefault(); saveEdit(c._id); }} className="flex gap-2">
                  <input
                    value={editText[c._id] ?? c.text}
                    onChange={e => setEditText(et => ({ ...et, [c._id]: e.target.value }))}
                    className="flex-1 border rounded p-2"
                  />
                  <button type="submit" className="bg-lime-600 text-white px-3 py-1 rounded" disabled={!editText[c._id]?.trim()}>Save</button>
                  <button type="button" className="text-xs text-gray-500" onClick={() => setEditing(e => ({ ...e, [c._id]: false }))}>Cancel</button>
                </form>
              ) : c.text}
            </div>
            <div className="flex items-center gap-3">
              <button
                className={`text-sm ${c.liked ? "text-lime-600" : "text-gray-500"}`}
                onClick={() => likeComment(c._id)}
              >
                ♥ {c.likeCount || 0}
              </button>
              <button
                className="text-xs text-blue-600 underline"
                onClick={() => setShowReplyForm(srf => ({ ...srf, [c._id]: !srf[c._id] }))}
              >Reply</button>
              {c.repliesCount > 0 && (
                <button
                  className="text-xs text-gray-500 underline"
                  onClick={() => handleShowReplies(c._id)}
                >
                  {showReplies[c._id] ? "Hide Replies" : `View Replies (${c.repliesCount})`}
                </button>
              )}
            </div>
            {/* Reply form */}
            {user && showReplyForm[c._id] && (
              <form
                onSubmit={e => { e.preventDefault(); postReply(c._id); }}
                className="flex gap-2 mt-2"
              >
                <div className="relative w-full">
                  <input
                    value={replyText[c._id] || ""}
                    onChange={e => {
                      setReplyText(rt => ({ ...rt, [c._id]: e.target.value }));
                      setActiveInput(c._id);
                      const caret = e.target.selectionStart;
                      const before = e.target.value.slice(0, caret);
                      const match = before.match(/@([\w]*)$/);
                      if (match) {
                        setMentionQuery(match[1]);
                        setMentionPos({ top: e.target.offsetTop + e.target.offsetHeight, left: e.target.offsetLeft });
                      } else {
                        setMentionQuery("");
                        setMentionUsers([]);
                      }
                    }}
                    onBlur={() => setTimeout(() => setMentionUsers([]), 200)}
                    className="flex-1 border rounded p-2"
                    placeholder="Write a reply..."
                    disabled={loadingReply[c._id]}
                  />
                  <MentionDropdown
                    users={mentionUsers}
                    onSelect={user => {
                      const val = replyText[c._id] || "";
                      const caret = document.activeElement.selectionStart;
                      const before = val.slice(0, caret).replace(/@([\w]*)$/, `@${user.name}`);
                      const after = val.slice(caret);
                      setReplyText(rt => ({ ...rt, [c._id]: before + after + " " }));
                      setMentionUsers([]);
                      setTimeout(() => document.activeElement.focus(), 0);
                    }}
                    position={{ top: 38, left: 0 }}
                  />
                </div>
                <button type="submit" className="bg-lime-600 text-white px-3 py-1 rounded" disabled={loadingReply[c._id] || !(replyText[c._id]||"").trim()}>
                  Reply
                </button>
              </form>
            )}
            {/* Replies */}
            {showReplies[c._id] && (
              <CommentSection type={type} id={id} parent={c._id} depth={depth+1} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
