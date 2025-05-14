import { useEffect, useState } from "react";

export default function ArtistAnalytics({ artistId }) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/artist/${artistId}`)
      .then(res => res.ok ? res.json() : null)
      .then(setStats);
  }, [artistId]);
  if (!stats) return null;
  return (
    <div className="flex gap-4 text-sm text-gray-600 mt-2">
      <div title="Followers">👥 {stats.followers || 0}</div>
      <div title="Plays">▶️ {stats.plays || 0}</div>
      <div title="Likes">♥ {stats.likes || 0}</div>
      <div title="Shares">🔗 {stats.shares || 0}</div>
    </div>
  );
}
