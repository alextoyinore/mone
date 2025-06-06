import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

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
        "p-2 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 " +
        (following
          ? "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400")
      }
    >
      {following ? (
        <HeartSolidIcon className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
}
