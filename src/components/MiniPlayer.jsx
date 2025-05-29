"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { parseSongValue } from '@/utils/songUtils';
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
import { Toaster, toast  } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import ShareModal from '@/components/ShareModal';

export default function MiniPlayer() {
  const { user } = useAuth();
  const [isNowPlayingModalOpen, setIsNowPlayingModalOpen] = useState(false);
  const { currentSong, isPlaying, progress, togglePlayPause, seekTo, playPreviousSong, playNextSong, loopMode, toggleLoopMode, isShuffling, toggleShuffleMode } = useAudioPlayer();

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user?.email) {
      toast.error(
        "Please sign in",
        "You need to be signed in to like songs",
        "destructive"
      );
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorite/${currentSong?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user.email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update favorite status');
      }
      
      toast.success(data.liked ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update favorite status");
    }
  };

  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    try {
      setLoadingPlaylists(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists?user=${user.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      console.log('Playlists data:', data); 
      setPlaylists(data);
    } catch (err) {
      setError('Failed to fetch playlists');
    } finally {
      setLoadingPlaylists(false);
    }
  };

  // useEffect(() => {
  //   fetchPlaylists();
  // }, []);

  const addToPlaylist = async (playlistId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/${playlistId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: currentSong._id, user: user.email }),
      });
      if (!response.ok) throw new Error('Failed to add song to playlist');
      toast.success('Song added to playlist', {
        duration: 2000,
      });
    } catch (err) {
      toast.error('Failed to add song to playlist', {
        duration: 2000,
      });
    } finally {
      setIsAddToPlaylistModalOpen(false);
    }
  };  

  // If no song is playing, return null
  if (!currentSong) return null;

  const songTitle = parseSongValue(currentSong.name || currentSong.title, 'Unknown Song');
  const songArtist = parseSongValue(currentSong.artist, 'Unknown Artist');
  const songCoverArt = parseSongValue(currentSong.coverArt, 'https://placehold.co/64x64');

  return (
    <div className="relative sticky bottom-0 left-0 z-50">
      {/* Share Modal */}
      <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={window.location.href}
          title={currentSong?.title}
        />
        
      <Toaster />
      {/* Add to Playlist Modal */}
      {isAddToPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add to Playlist</h2>
              <button 
                onClick={() => setIsAddToPlaylistModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingPlaylists ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : playlists.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No playlists found</div>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() => addToPlaylist(playlist._id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{playlist.name}</h3>
                      <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md px-4 py-3 z-50 border-t border-gray-200 dark:border-gray-800 transition-all duration-700 cursor-pointer hover:bg-white/80 dark:hover:bg-black/80" onClick={() => setIsNowPlayingModalOpen(true)}>
        <div className="flex items-center justify-between w-full rounded-xl">
          <Image 
            src={songCoverArt} 
            alt={`Cover art for ${songTitle}`}
            width={60}
            height={60}
            className="w-14 h-14 object-cover rounded-md"
          />
          
          <div className="flex flex-col ml-2 space-y-0 w-1/4">
            <h3 className="text-sm font-semibold truncate">{songTitle}</h3>
            <p className="text-xs text-gray-500 truncate">{songArtist}</p>
          </div>

          {/* Transport Controls - Centered */}
          <div className="flex items-center justify-end md:justify-center space-x-4 w-2/4">
            <ShuffleIcon 
              onClick={(e) => {
                e.stopPropagation();
                toggleShuffleMode();
              }} 
              isActive={isShuffling}
              className="w-5 h-5 hidden md:block text-gray-600 hover:text-blue-600 dark:hover:text-white cursor-pointer"
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
              className="w-5 h-5 text-gray-600 hidden md:block hover:text-blue-600 dark:hover:text-white cursor-pointer"
            />
          </div>

          {/* Action Buttons - Right */}
          <div className="flex items-center hidden md:block justify-end space-x-4 w-1/4 text-right">
            <button 
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(e);
              }}
            >
              <FavoriteIcon className="w-5 h-5" />
            </button>
            <button 
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button 
              className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={async (e) => {
                e.stopPropagation();
                setIsAddToPlaylistModalOpen(true);
               !playlists.length && await fetchPlaylists();
              }}
            >
              <AddToPlaylistIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
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
