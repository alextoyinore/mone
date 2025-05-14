import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function FavoriteButton({ songId, initialLiked = false, onChange }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const toggleFavorite = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${songId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.email })
      });
      const data = await res.json();
      setLiked(data.liked);
      if (onChange) onChange(data.liked);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      aria-label={liked ? "Unlike song" : "Like song"}
      className={
        "w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 " +
        (liked ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400 hover:scale-110")
      }
      title={liked ? "Unlike" : "Like"}
    >
      <span className="transition-transform duration-200">{liked ? "♥" : "♡"}</span>
    </button>
  );
}
