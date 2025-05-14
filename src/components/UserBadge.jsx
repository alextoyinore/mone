import React from "react";

const BADGE_LABELS = {
  verified: { label: "Verified", color: "bg-blue-500", icon: "✔️" },
  artist: { label: "Artist", color: "bg-lime-600", icon: "🎤" },
  admin: { label: "Admin", color: "bg-red-500", icon: "⭐" },
  topfan: { label: "Top Fan", color: "bg-yellow-400", icon: "🏆" },
  // Add more badges as needed
};

export default function UserBadge({ badge }) {
  const meta = BADGE_LABELS[badge] || { label: badge, color: "bg-gray-400", icon: "🏅" };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs text-white ml-1 ${meta.color}`}
      title={meta.label}
      style={{ verticalAlign: "middle" }}
    >
      <span className="mr-1">{meta.icon}</span>{meta.label}
    </span>
  );
}
