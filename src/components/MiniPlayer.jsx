"use client";

import React from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { parseSongValue, formatTime } from '@/utils/songUtils';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import NextIcon from '@/components/icons/NextIcon';
import PreviousIcon from '@/components/icons/PreviousIcon';
import LoopIcon from '@/components/icons/LoopIcon';
import ShuffleIcon from '@/components/icons/ShuffleIcon';


export default function MiniPlayer() {
  const { currentSong, isPlaying, progress, togglePlayPause, seekTo, playPreviousSong, playNextSong, loopMode, toggleLoopMode, isShuffling, toggleShuffleMode } = useAudioPlayer();

  // If no song is playing, return null
  if (!currentSong) return null;

  const songTitle = parseSongValue(currentSong.name || currentSong.title, 'Unknown Song');
  const songArtist = parseSongValue(currentSong.artist, 'Unknown Artist');
  const songCoverArt = parseSongValue(currentSong.coverArt, 'https://placehold.co/64x64');

  return (
    <div className="sticky top-0 left-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md flex items-center px-4 py-2 z-50 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 transition-all duration-700">
      <div className="flex items-center space-x-4 w-full">
        <Image 
          src={songCoverArt} 
          alt={`Cover art for ${songTitle}`}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-md"
        />
        
        <div className="flex-grow">
          <h3 className="text-sm font-semibold">{songTitle}</h3>
          <p className="text-xs text-gray-500">{songArtist}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ShuffleIcon 
            onClick={toggleShuffleMode} 
            isActive={isShuffling}
            className="w-5 h-5 text-gray-600 hover:text-black dark:hover:text-white cursor-pointer"
          />

          <button 
            onClick={playPreviousSong}
            className="text-gray-700 hover:text-blue-600 transition"
          >
            <PreviousIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlayPause}
            className="text-gray-700 hover:text-blue-600 transition flex items-center justify-center p-2 rounded-full border border-grey-400"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          
          <button 
            onClick={playNextSong}
            className="text-gray-700 hover:text-blue-600 transition"
          >
            <NextIcon className="w-5 h-5" />
          </button>

          <LoopIcon 
            onClick={toggleLoopMode} 
            isActive={loopMode !== 0}
            className="w-5 h-5 text-gray-600 hover:text-black dark:hover:text-white cursor-pointer"
          />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-500" 
          style={{ width: `${progress}%` }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            seekTo(clickPosition * 100);
          }}
        />
      </div>
    </div>
  );
}
