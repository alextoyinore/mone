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


export default function SongsPage() {
  const { user, getToken } = useAuth();
  const { playSong, currentSong, isPlaying, setSongsForPlayback } = useAudioPlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  // Set songs for playback when songs are loaded
  useEffect(() => {
    if (songs.length > 0) {
      setSongsForPlayback(songs);
    }
  }, [songs, setSongsForPlayback]);

  // Sanitize song object to ensure only primitive values are used
  const sanitizeSong = (song) => ({
    _id: extractPrimitiveValue(song, ['_id', 'id'], ''),
    title: extractPrimitiveValue(song, ['title', 'name'], 'Unknown Song'),
    artist: extractPrimitiveValue(song, ['artist', 'name'], 'Unknown Artist'),
    coverArt: extractPrimitiveValue(song, ['coverArt', 'image'], 'https://placehold.co/300x300'),
    audioUrl: extractPrimitiveValue(song, ['audioUrl', 'url'], '')
  });

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Only fetch if user is logged in
        if (!user) {
          setLoading(false);
          return;
        }

        // Get authentication token
        const token = await getToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch songs');
        }

        const data = await response.json();
        console.log('data: ', data);
        
        // Sanitize each song before setting state
        const sanitizedSongs = data.map(sanitizeSong);
        setSongs(sanitizedSongs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching songs:', err);
        toast.error(err.message || 'Failed to load songs');
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading songs...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-black min-h-screen">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  // Defensive parsing of song value
  const parseSongValue = (value, fallback = '') => {
    // Ensure only primitive values are used
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object' && value.toString) return value.toString();
    return fallback;
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-black min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Songs</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {songs.map((song) => {
              const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
              const songArtist = parseSongValue(song.artist, 'Unknown Artist');
              const songCoverArt = parseSongValue(song.coverArt, 'https://placehold.co/300x300');

              return (
                <div  
                  key={song._id} 
                  className=""
                >
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
                    <p className="text-xs text-gray-500 truncate">{songArtist}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {songs.map((song) => {
              const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
              const songArtist = parseSongValue(song.artist, 'Unknown Artist');
              const songCoverArt = parseSongValue(song.coverArt, 'https://placehold.co/100x100');

              return (
                <div 
                  key={song._id} 
                  className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <Image 
                    src={songCoverArt} 
                    alt={songTitle} 
                    width={100} 
                    height={100} 
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                    onClick={() => playSong(song)}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{songTitle}</h3>
                    <p className="text-xs text-gray-500">{songArtist}</p>
                  </div>
                  <button 
                    onClick={() => playSong(song)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
                  >
                    Play
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Songs</h1>
        <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 dark:hover:text-gray-600 transition-colors"
            >
              {viewMode === 'grid' ? (
                <ListIcon isActive={false} />
              ) : (
                <GridIcon isActive={false} />
              )}
            </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {songs.map((song) => {
            const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
            const songArtist = parseSongValue(song.artist, 'Unknown Artist');
            const songCoverArt = parseSongValue(song.coverArt, 'https://placehold.co/300x300');

            return (
              <div 
                key={song._id} 
                className="group relative cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden rounded-xl">
                  <Image 
                    src={songCoverArt} 
                    alt={songTitle} 
                    width={300} 
                    height={300} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => playSong(song)}
                  />
                  <button 
                    onClick={() => playSong(song)}
                    className="absolute bottom-2 left-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100"
                  >
                    <PlayIcon isActive={false} className="w-6 h-6" />
                  </button>
                </div>
                <div className="mt-2">
                  <h3 className="font-light text-sm truncate text-gray-900 dark:text-white">{songTitle}</h3>
                  <p className="text-xs text-gray-500 truncate">{songArtist}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {songs.map((song) => (
            <div 
              key={song._id} 
              className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <Image 
                src={song.coverArt || 'https://placehold.co/100x100'} 
                alt={song.title} 
                width={100} 
                height={100} 
                className="w-16 h-16 object-cover rounded-lg mr-4"
                onClick={() => playSong(song)}
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{song.title}</h3>
                <p className="text-xs text-gray-500">{song.artist}</p>
              </div>
              
              <button 
                onClick={() => playSong(song)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
              >
                Play
              </button>
              <Link 
                href={`songs/${song._id}`} 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


