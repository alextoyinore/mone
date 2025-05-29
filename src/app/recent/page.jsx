"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import toast from 'react-hot-toast';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import GridSongItem from '@/components/GridSongItem';
import ListSongItem from '@/components/ListSongItem';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

export default function RecentlyPlayedPage() {
  const { user, getToken } = useAuth();
  const { playSong, currentSong, isPlaying, setSongsForPlayback } = useAudioPlayer();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  // Safely extract primitive values from an object
  const extractPrimitiveValue = (obj, props, fallback = '') => {
    for (let prop of props) {
      const value = obj[prop];
      if (value !== null && value !== undefined) {
        if (typeof value === 'string' || typeof value === 'number') {
          return value;
        }
        // If it's an object with a toString method, use that
        if (typeof value === 'object' && value.toString) {
          return value.toString();
        }
      }
    }
    return fallback;
  };

  // Sanitize song object to ensure only primitive values are used
  const sanitizeSong = (song) => ({
    _id: extractPrimitiveValue(song, ['_id', 'id'], ''),
    title: extractPrimitiveValue(song, ['title', 'name'], 'Unknown Song'),
    artist: song.artist?.name || extractPrimitiveValue(song, ['artist', 'name'], 'Unknown Artist'),
    artistAvatar: song.artist?.avatar || extractPrimitiveValue(song, ['artist', 'avatar'], ''),
    coverArt: extractPrimitiveValue(song, ['coverArt', 'image'], 'https://placehold.co/300x300'),
    audioUrl: extractPrimitiveValue(song, ['audioUrl', 'url'], '')
  });

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        // Only fetch if user is logged in
        if (!user) {
          setLoading(false);
          return;
        }

        // Get authentication token
        const token = await getToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recently-played/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch recently played songs');
        }

        const data = await response.json();
        console.log('data: ', data);
        
        // Sanitize each song before setting state
        const sanitizedSongs = data.map(recent => sanitizeSong(recent.song));
        setRecentlyPlayed(sanitizedSongs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recently played songs:', err);
        toast.error(err.message || 'Failed to load recently played songs');
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [user]);

  // Set songs for playback when songs are loaded
  useEffect(() => {
    if (recentlyPlayed.length > 0) {
      setSongsForPlayback(recentlyPlayed);
    }
  }, [recentlyPlayed, setSongsForPlayback]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-black min-h-[60vh] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-black min-h-[60vh] flex justify-center items-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  // Defensive parsing of song value
  const parseSongValue = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object') {
      if (value.name) return value.name;
      if (value.toString) return value.toString();
      return JSON.stringify(value);
    }
    return fallback;
  };

  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return (
      <div className="bg-white dark:bg-black min-h-[calc(100vh-5em)] p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recently Played</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-900 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
            >
              {viewMode === 'grid' ? (
                <ListIcon isActive={false} />
              ) : (
                <GridIcon isActive={false} />
              )}
            </button>
          </div>
        </div>
        <div className="text-gray-500 text-center">No recently played songs yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-[calc(100vh-5em)] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recently Played</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-900 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
          >
            {viewMode === 'grid' ? (
              <ListIcon isActive={false} />
            ) : (
              <GridIcon isActive={false} />
            )}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {recentlyPlayed.map((song) => {
            const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
            const songArtist = parseSongValue(song.artist, 'Unknown Artist');
            const songCoverArt = parseSongValue(song.coverArt, 'https://placehold.co/300x300');
            const songArtistAvatar = parseSongValue(song.artistAvatar, '');

            return (
              <div key={song._id} className="">
                <div className="relative">
                  <Image 
                    src={songCoverArt} 
                    alt={songTitle} 
                    width={300} 
                    height={300} 
                    className="rounded-lg"
                  />
                  <button 
                    onClick={() => playSong(song)}
                    className="absolute bottom-2 left-2 mt-2 w-full bg-blue-500 text-white py-2 rounded-full text-sm hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
                  >
                    Play
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{songTitle}</h3>
                  <div className="flex items-center space-x-2">
                    {songArtistAvatar && (
                      <Image 
                        src={songArtistAvatar} 
                        alt={songArtist} 
                        width={24} 
                        height={24} 
                        className="rounded-full object-cover"
                      />
                    )}
                    <p className="text-xs text-gray-500 truncate">{songArtist}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {recentlyPlayed.map((song) => (
            <div key={song._id} className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow">
              <div className="flex items-center space-x-4">
                <Image 
                  src={song.coverArt} 
                  alt={song.title} 
                  width={64} 
                  height={64} 
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{song.title}</h3>
                  <div className="flex items-center space-x-2">
                    {song.artistAvatar && (
                      <Image 
                        src={song.artistAvatar} 
                        alt={song.artist} 
                        width={24} 
                        height={24} 
                        className="rounded-full object-cover"
                      />
                    )}
                    <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                  </div>
                </div>
                <button 
                  onClick={() => playSong(song)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition"
                >
                  <PlayIcon className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500">{song.playedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

