import React, { createContext, useContext, useState, useRef } from "react";

const PlayerContext = createContext();

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]); // array of song objects
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 means nothing playing
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds
  const [volume, setVolume] = useState(1); // 0-1

  // Play a song or queue
  const play = (songs, index = 0, user = null) => {
    if (!Array.isArray(songs)) songs = [songs];
    setQueue(songs);
    setCurrentIndex(index);
    setIsPlaying(true);
    // Track recently played if user exists
    if (user && songs[index]?._id) {
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recently-played`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: user.email, song: songs[index]._id })
        }).catch(error => {
          console.error('Failed to track recently played:', error);
        });
      } catch (error) {
        console.error('Error in recently played tracking:', error);
      }
    }
  };


  const pause = () => setIsPlaying(false);

  const resume = () => setIsPlaying(true);

  const playNext = () => {
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const seek = (sec) => {
    setProgress(sec);
    if (audioRef.current) audioRef.current.currentTime = sec;
  };

  const setPlayerVolume = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const value = {
    queue,
    setQueue,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    setIsPlaying,
    play,
    pause,
    resume,
    playNext,
    playPrev,
    progress,
    setProgress,
    duration,
    setDuration,
    seek,
    volume,
    setPlayerVolume,
    audioRef,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}


