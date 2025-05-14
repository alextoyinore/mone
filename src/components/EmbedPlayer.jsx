import React from "react";

export default function EmbedPlayer({ song, compact }) {
  // If compact, show a minimal player for embedding
  return (
    <div className={compact ? "bg-white border rounded shadow p-2 w-72" : "bg-white border rounded shadow p-4 max-w-md mx-auto"}>
      <div className="flex items-center gap-3">
        <img src={song.cover || '/logo192.png'} alt="cover" className="w-12 h-12 rounded" />
        <div>
          <div className="font-bold text-lg">{song.title}</div>
          <div className="text-xs text-gray-500">{song.artistName}</div>
        </div>
      </div>
      <audio controls src={song.audioUrl} className="w-full mt-2" />
    </div>
  );
}
