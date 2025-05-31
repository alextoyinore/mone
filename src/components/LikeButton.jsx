"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ThumbUpIcon from "@/components/icons/ThumbUpIcon";
import ThumbUpSolidIcon from "@/components/icons/ThumbUpSolidIcon";

export default function LikeButton({ artistId, initialLiked = false, onChange }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/artists/${artistId}/like`, {
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
      onClick={toggleLike}
      disabled={loading}
      className={
        "p-2 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-400 " +
        (liked
          ? "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400")
      }
    >
      {liked ? (
        <ThumbUpSolidIcon className="w-5 h-5" />
      ) : (
        <ThumbUpIcon className="w-5 h-5" />
      )}
    </button>
  );
}
