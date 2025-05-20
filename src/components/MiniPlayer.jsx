"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { parseSongValue, formatTime } from '@/utils/songUtils';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import NextIcon from '@/components/icons/NextIcon';
import PreviousIcon from '@/components/icons/PreviousIcon';
import LoopIcon from '@/components/icons/LoopIcon';
import ShuffleIcon from '@/components/icons/ShuffleIcon';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import AddToPlaylistIcon from '@/components/icons/AddToPlaylistIcon';
import NowPlaying from '@/components/NowPlaying';


export default function MiniPlayer() {
  const [isNowPlayingModalOpen, setIsNowPlayingModalOpen] = useState(false);
  const { currentSong, isPlaying, progress, togglePlayPause, seekTo, playPreviousSong, playNextSong, loopMode, toggleLoopMode, isShuffling, toggleShuffleMode } = useAudioPlayer();

  // If no song is playing, return null
  if (!currentSong) return null;

  const songTitle = parseSongValue(currentSong.name || currentSong.title, 'Unknown Song');
  const songArtist = parseSongValue(currentSong.artist, 'Unknown Artist');
  const songCoverArt = parseSongValue(currentSong.coverArt, 'https://placehold.co/64x64');

  return (
    <div className="relative">
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-4 py-2 z-50 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 transition-all duration-700 cursor-pointer hover:bg-white/80 dark:hover:bg-gray-900/80" onClick={() => setIsNowPlayingModalOpen(true)}>
        <div className="flex items-center justify-between w-full">
          <Image 
            src={songCoverArt} 
            alt={`Cover art for ${songTitle}`}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-md"
          />
          
          <div className="flex flex-col ml-2 space-y-0 w-1/4">
            <h3 className="text-sm font-semibold truncate">{songTitle}</h3>
            <p className="text-xs text-gray-500 truncate">{songArtist}</p>
          </div>

          {/* Transport Controls - Centered */}
          <div className="flex items-center justify-center space-x-4 w-2/4">
            <ShuffleIcon 
              onClick={(e) => {
                e.stopPropagation();
                toggleShuffleMode();
              }} 
              isActive={isShuffling}
              className="w-5 h-5 text-gray-600 hover:text-blue-600 dark:hover:text-white cursor-pointer"
            />

            <button 
              onClick={(e) => {
                e.stopPropagation();
                playPreviousSong();
              }}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              <PreviousIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="text-gray-700 hover:text-blue-600 transition flex items-center justify-center"
            >
              {isPlaying ? (
                <PauseIcon className="w-8 h-8" />
              ) : (
                <PlayIcon className="w-8 h-8" />
              )}
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                playNextSong();
              }}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              <NextIcon className="w-5 h-5" />
            </button>

            <LoopIcon 
              onClick={(e) => {
                e.stopPropagation();
                toggleLoopMode();
              }} 
              isActive={loopMode !== 0}
              className="w-5 h-5 text-gray-600 hover:text-blue-600 dark:hover:text-white cursor-pointer"
            />
          </div>

          {/* Action Buttons - Right */}
          <div className="flex items-center justify-end space-x-4 w-1/4">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <FavoriteIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <AddToPlaylistIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
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
      <NowPlaying 
        isOpen={isNowPlayingModalOpen} 
        onClose={() => setIsNowPlayingModalOpen(false)} 
      />
    </div>
  );
}
