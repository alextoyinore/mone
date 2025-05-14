import React from "react";

export default function EmbedPlaylist({ playlist, compact }) {
  return (
    <div className={compact ? "bg-white border rounded shadow p-2 w-80" : "bg-white border rounded shadow p-4 max-w-lg mx-auto"}>
      <div className="flex items-center gap-3 mb-2">
        <img src={playlist.cover || '/logo192.png'} alt="cover" className="w-12 h-12 rounded" />
        <div>
          <div className="font-bold text-lg">{playlist.name}</div>
          <div className="text-xs text-gray-500">{playlist.ownerName}</div>
        </div>
      </div>
      <ul className="text-xs text-gray-700 mb-2 max-h-32 overflow-y-auto">
        {playlist.songs?.slice(0, 5).map(song => (
          <li key={song._id} className="truncate">{song.title} - {song.artistName}</li>
        ))}
        {playlist.songs?.length > 5 && <li>...and more</li>}
      </ul>
      {/* Optionally: play all button */}
    </div>
  );
}
