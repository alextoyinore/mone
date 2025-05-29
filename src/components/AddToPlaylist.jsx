import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

export default function AddToPlaylist({ song }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/playlists?user=${user.email}`)
      .then(res => res.ok ? res.json() : [])
      .then(setPlaylists);
  }, [user]);

  const addToPlaylist = async (playlistId) => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`http://localhost:5000/api/playlists/${playlistId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: song._id, user: user.email })
      });
      if (!res.ok) throw new Error("Failed to add");
      setMsg("Added!");
    } catch (err) {
      setMsg("Error adding to playlist");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 2000);
      setShow(false);
    }
  };

  if (!user) return null;

  return (
    <div className="inline-block relative">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white/80 dark:bg-gray-900/80 border border-green-200 dark:border-green-700 text-green-600 text-xl hover:text-green-800 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setShow(s => !s)}
        title="Add to playlist"
        aria-label="Add to playlist"
      >
        ➕
      </button>
      {show && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-fade-in">
          <div className="font-bold p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-t-xl">Add to Playlist</div>
          {playlists.length === 0 ? (
            <div className="p-3 text-gray-500">No playlists found.</div>
          ) : playlists.map(pl => (
            <button
              key={pl._id}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-800 rounded transition"
              onClick={() => addToPlaylist(pl._id)}
              disabled={loading}
            >
              {pl.name}
            </button>
          ))}
          {msg && <div className="p-3 text-sm text-green-600 dark:text-green-400">{msg}</div>}
        </div>
      )}
    </div>
  );
}
