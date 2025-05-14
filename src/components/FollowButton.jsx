import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function FollowButton({ artistId, initialFollowing = false, onChange }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  const toggleFollow = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/follow/${artistId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.email })
      });
      const data = await res.json();
      setFollowing(data.following);
      if (onChange) onChange(data.following);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={
        "px-6 py-2 rounded-full font-semibold shadow-md text-base transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 " +
        (following
          ? "bg-gray-400 dark:bg-gray-700 text-white hover:bg-gray-500 dark:hover:bg-gray-600"
          : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 scale-105")
      }
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
