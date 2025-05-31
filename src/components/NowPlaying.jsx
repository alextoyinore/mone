"use client";

import React, { useState, useEffect } from 'react';
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
import CloseIcon from '@/components/icons/CloseIcon';

export default function NowPlaying({ isOpen, onClose }) {
  let { 
    currentSong, 
    isPlaying, 
    progress, 
    togglePlayPause, 
    seekTo, 
    playPreviousSong, 
    playNextSong, 
    loopMode, 
    toggleLoopMode, 
    isShuffling, 
    toggleShuffleMode,
    queue
  } = useAudioPlayer();

  if (!currentSong) return null;
  if (!queue) queue = []; // Use empty array if queue is undefined

  const songTitle = parseSongValue(currentSong.name || currentSong.title, 'Unknown Song');
  const songArtist = parseSongValue(currentSong.artist, 'Unknown Artist');
  const songDescription = parseSongValue(currentSong.description, 'No Description');
  const songCoverArt = parseSongValue(currentSong.coverArt, 'https://placehold.co/1920x1080');

  // Get next songs from queue
  const nextSongs = queue.length > 1 ? queue.slice(1, 6) : [];

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/90 cursor-pointer" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Main content */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex flex-col lg:flex-row min-h-full items-center justify-center relative">
          <div 
            className="w-full lg:w-1/2 h-full rounded-2xl bg-black/50 backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Close button */}
            <button 
              className="absolute top-5 right-5 text-gray-300 hover:text-white transition-colors z-50"
              onClick={onClose}
            >
              <CloseIcon className="w-6 h-6 cursor-pointer" />
            </button>
            {/* Background image */}
            <div className="absolute inset-0 w-full h-full">  
              <Image
                src={songCoverArt}
                alt={`Cover art for ${songTitle}`}
                fill
                className="object-cover brightness-50"
                priority
              />
            </div>

            {/* Content container */}
            <div className="relative flex gap-8 h-full">
              {/* Left side - Song info and controls */}
              <div className="w-full lg:w-1/2 p-12">
                <div className="flex flex-col h-full justify-between">
                  {/* Song info */}
                  <div>
                    <h1 className="text-6xl font-bold mb-2 text-white">{songTitle}</h1>
                    <p className="text-xl text-gray-300 mb-4">{songArtist}</p>
                    {/* <p className="text-sm text-gray-400 mb-4">{songDescription}</p> */}
                    
                    {/* Progress bar */}
                    <div className="relative h-1 bg-gray-400/50 rounded-full mt-12">
                      <div 
                        className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Transport controls */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-5 mt-8">
                    <div className="flex items-center space-x-4">
                      <ShuffleIcon 
                        onClick={toggleShuffleMode} 
                        isActive={isShuffling}
                        className="w-8 h-8 text-gray-400 hover:text-white cursor-pointer opacity-50 hover:opacity-100"
                      />

                      <button 
                        onClick={playPreviousSong}
                        className="text-gray-400 hover:text-white transition opacity-50 hover:opacity-100"
                      >
                        <PreviousIcon className="w-8 h-8 cursor-pointer" />
                      </button>
                      
                      <button 
                        onClick={togglePlayPause}
                        className="text-gray-400 hover:text-white transition flex items-center justify-center"
                      >
                        {isPlaying ? (
                          <PauseIcon className="w-12 h-12 cursor-pointer opacity-50 hover:opacity-100" />
                        ) : (
                          <PlayIcon className="w-12 h-12 cursor-pointer opacity-50 hover:opacity-100" />
                        )}
                      </button>
                      
                      <button 
                        onClick={playNextSong}
                        className="text-gray-400 hover:text-white transition opacity-50 hover:opacity-100"
                      >
                        <NextIcon className="w-8 h-8 cursor-pointer" />
                      </button>

                      <LoopIcon 
                        onClick={toggleLoopMode} 
                        isActive={loopMode !== 0}
                        className="w-8 h-8 text-gray-400 hover:text-white cursor-pointer opacity-50 hover:opacity-100"
                      />
                    </div>
                  {/* Action buttons */}
                  {/* <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-white transition opacity-50 hover:opacity-100">
                      <FavoriteIcon className="w-8 h-8 cursor-pointer" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition opacity-50 hover:opacity-100">
                      <ShareIcon className="w-8 h-8 cursor-pointer" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition opacity-50 hover:opacity-100">
                      <AddToPlaylistIcon className="w-8 h-8 cursor-pointer" />
                    </button>
                  </div> */}
                    
                  </div>

                 
                </div>
              </div>

              {/* Right side - Up next */}
              <div className="w-1/2 p-12">
                <h2 className="text-2xl font-bold mb-4 text-white">Up Next</h2>
                {nextSongs.length > 0 ? (
                  <div className="space-y-4">
                    {nextSongs.map((song, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={song.coverArt || 'https://placehold.co/48x48'}
                            alt={`Cover art for ${song.name || song.title}`}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-200">{song.name || song.title}</h3>
                          <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 py-8">
                    <p>No more songs in queue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
