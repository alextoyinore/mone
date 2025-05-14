"use client";

import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from 'react';

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({ children }) => {
  // Store songs list for navigation
  const [songsList, setSongsList] = useState([]);
  
  // Loop modes: 0 = No Loop, 1 = Loop One, 2 = Loop All
  const [loopMode, setLoopMode] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Toggle loop mode (cycle through 0, 1, 2)
  const toggleLoopMode = useCallback(() => {
    setLoopMode((prevMode) => (prevMode + 1) % 2);
  }, []);

  // Toggle shuffle mode
  const toggleShuffleMode = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  // Method to set the entire songs list for playback
  const setSongsForPlayback = useCallback((songs) => {
    setSongsList(songs || []);
  }, []);

  // Play next song in the playlist
  const playNextSong = () => {
    if (!currentSong || songsList.length === 0) return;

    // Find current song's index
    const currentIndex = songsList.findIndex(song => song._id === currentSong._id);
    
    // Determine next song index
    let nextIndex;
    if (isShuffling) {
      // Randomly select a different song
      do {
        nextIndex = Math.floor(Math.random() * songsList.length);
      } while (nextIndex === currentIndex && songsList.length > 1);
    } else {
      // Sequential playback
      nextIndex = (currentIndex + 1) % songsList.length;
    }
    
    // Play the next song based on loop mode
    switch (loopMode) {
      case 1: // Loop One: replay the current song
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        break;
      case 2: // Loop All: always play next song, wrapping around
      case 0: // No Loop: play next song, stop if at end
      default:
        playSong(songsList[nextIndex]);
        break;
    }
  };

  // Initialize audio element
  const initializeAudioElement = useCallback(() => {
    // Always create a new Audio element to ensure clean state
    const audioElement = new Audio();
    
    // Setup event listeners
    audioElement.addEventListener('timeupdate', () => {
      if (audioElement.duration) {
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
      }
    });

    audioElement.addEventListener('ended', () => {
      // When song ends, play next song or reset
      playNextSong();
    });

    // Store reference
    audioRef.current = audioElement;

    return audioElement;
  }, [playNextSong, setProgress]);

  // Ensure audio element is always available
  useEffect(() => {
    // Initialize audio element if not exists
    if (!audioRef.current) {
      initializeAudioElement();
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Seek to a specific point in the song
  const seekTo = useCallback((percentage) => {
    if (!audioRef.current) {
      console.warn('Cannot seek: No audio element');
      return;
    }
  
    // Validate percentage
    const validPercentage = Math.max(0, Math.min(100, percentage));
    
    // Calculate time based on percentage
    const time = (validPercentage / 100) * audioRef.current.duration;
    
    try {
      audioRef.current.currentTime = time;
      setProgress(validPercentage);
    } catch (error) {
      console.error('Error seeking in audio:', error);
    }
  }, []);

  const playSong = (song) => {
    // Defensive parsing of song object
    const parseSongValue = (value, fallback = '') => {
      if (value === null || value === undefined) return fallback;
      if (typeof value === 'string' || typeof value === 'number') return value;
      if (typeof value === 'object' && value.toString) return value.toString();
      return fallback;
    };

    // Create a new object with strictly primitive values
    const songData = {
      _id: parseSongValue(song._id),
      title: parseSongValue(song.name || song.title, 'Unknown Song'),
      artist: parseSongValue(song.artist, 'Unknown Artist'),
      coverArt: parseSongValue(song.coverArt, 'https://placehold.co/64x64'),
      audioUrl: parseSongValue(song.audioUrl || song.url)
    };

    // Validate song object
    if (!songData._id || !songData.audioUrl) {
      console.error('Invalid song: Missing required properties', song);
      return;
    }

    // Ensure audioRef is available
    if (!audioRef.current) {
      console.error('Audio element not initialized');
      return;
    }

    // If the same song is currently playing, pause it
    if (currentSong?._id === songData._id && isPlaying) {
      togglePlayPause();
      return;
    }

    // If a different song is selected, reset progress
    if (currentSong?._id !== songData._id) {
      setProgress(0);
    }

    try {
      // Explicitly set only primitive values
      setCurrentSong(songData);
      audioRef.current.src = songData.audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing song:', error);
        setCurrentSong(null);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Unexpected error in playSong:', error);
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!currentSong) {
      console.warn('Cannot toggle play/pause: No song selected');
      return;
    }

    if (!audioRef.current) {
      console.error('Audio element not initialized');
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing song:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Unexpected error in togglePlayPause:', error);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    
    const updateProgress = () => {
      if (audioElement) {
        const progressPercent = 
          (audioElement.currentTime / audioElement.duration) * 100;
        setProgress(progressPercent);
      }
    };

    const handleEnded = () => {
      // If there are songs in the playlist, automatically play the next song
      if (songsList.length > 0) {
        playNextSong();
      } else {
        // If no playlist, just stop playback
        setIsPlaying(false);
        setProgress(0);
      }
    };

    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSong, songsList, playNextSong]);

  // Add global spacebar event listener for play/pause
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if spacebar is pressed and not in an input field
      if (
        event.code === 'Space' && 
        event.target.tagName !== 'INPUT' && 
        event.target.tagName !== 'TEXTAREA'
      ) {
        // Prevent default spacebar behavior (scrolling)
        event.preventDefault();
        
        // Only toggle if a song is playing
        if (currentSong) {
          togglePlayPause();
        }
      }
    };

    // Add global event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSong, togglePlayPause]);

  useEffect(() => {
    if (currentSong && isPlaying) {
      audioRef.current.play();
    } else if (currentSong && !isPlaying) {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying]);


  // Play previous song in the playlist
  const playPreviousSong = () => {
    if (!currentSong || songsList.length === 0) return;

    // Find current song's index
    const currentIndex = songsList.findIndex(song => song._id === currentSong._id);
    
    // Determine previous song index
    const prevIndex = (currentIndex - 1 + songsList.length) % songsList.length;
    
    // Play the previous song
    playSong(songsList[prevIndex]);
  };

  const contextValue = {
    currentSong,
    isPlaying,
    loopMode,
    isShuffling,
    songsList,
    progress,
    playSong,
    pauseSong,
    togglePlayPause,
    seekTo,
    playNextSong,
    playPreviousSong,
    setSongsForPlayback,
    toggleLoopMode,
    toggleShuffleMode
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
      <audio ref={audioRef} />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
