import React, { useRef, useEffect } from "react";
import { usePlayer } from "../contexts/PlayerContext";

export default function Player() {
  const { queue, currentIndex, isPlaying, play, pause, playNext, playPrev, progress, setProgress, duration, setDuration, seek, volume, setPlayerVolume, audioRef } = usePlayer();
  const current = queue[currentIndex] || null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play();
    else audio.pause();
  }, [isPlaying, currentIndex, audioRef]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="relative bg-white/90 dark:bg-black/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center w-full max-w-md border border-gray-200 dark:border-gray-800 animate-fade-in">
        <button className="absolute top-4 right-4 text-2xl hover:text-red-500 transition" onClick={pause} title="Close player">✖️</button>
        {current.coverArt && <img src={current.coverArt} alt="cover" className="w-32 h-32 object-cover rounded mb-4" />}
        <div className="font-bold text-xl mb-1">{current.title}</div>
        <div className="text-gray-600 mb-4">{current.artistName || "Unknown Artist"}</div>
        <audio
          ref={audioRef}
          src={current.audioUrl}
          onTimeUpdate={e => setProgress(e.target.currentTime)}
          onLoadedMetadata={e => setDuration(e.target.duration)}
          onEnded={playNext}
          volume={volume}
          autoPlay
          className="hidden"
        />
        <div className="flex items-center gap-2 mb-2">
          <button onClick={playPrev}>⏮️</button>
          {isPlaying ? (
            <button onClick={pause}>⏸️</button>
          ) : (
            <button onClick={() => play(queue, currentIndex)}>▶️</button>
          )}
          <button onClick={playNext}>⏭️</button>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={progress}
          onChange={e => seek(Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex justify-between w-full text-xs text-gray-500 mb-2">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span>🔉</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setPlayerVolume(Number(e.target.value))}
            className="flex-1"
          />
          <span>🔊</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
