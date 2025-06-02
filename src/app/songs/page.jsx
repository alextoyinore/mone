"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import toast from 'react-hot-toast';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import GridSongItem from '@/components/GridSongItem';
import ListSongItem from '@/components/ListSongItem';
import LoadingSpinner from '@/components/loading/LoadingSpinner';


export default function SongsPage() {
  const { user, getToken } = useAuth();
  const { playSong, setSongsForPlayback } = useAudioPlayer();
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
    artist: song.artist?.name || extractPrimitiveValue(song, ['artist', 'name'], 'Unknown Artist'),
    artistAvatar: song.artist?.avatar || extractPrimitiveValue(song, ['artist', 'avatar'], ''),
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
    return (
      <div className="bg-white dark:bg-black min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }


  if (error) {
    return (
      <div className="bg-white dark:bg-black min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }


  // Defensive parsing of song value
  const parseSongValue = (value, fallback = '') => {
    // Ensure only primitive values are used
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (typeof value === 'object') {
      // Check for nested name property
      if (value.name) return value.name;
      // If object has toString method, use it
      if (value.toString) return value.toString();
      // Last resort: JSON stringify
      return JSON.stringify(value);
    }
    return fallback;
  };


  if (!songs || songs.length === 0) {
    return (
      <div className="bg-white dark:bg-black min-h-screen">
        <div className="sticky top-0 left-0 flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 w-1/3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Songs</h1>
            <div className="flex items-center space-x-2">
              <span>{songs.length} songs</span>
              <span onClick={() => {setSongsForPlayback(songs); playSong(songs[0])}} className="text-blue-500 cursor-pointer">Play All</span>
            </div>
          </div>
          <div className="flex items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {songs.map((song) => {
              const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
              const songArtist = parseSongValue(song.artist, 'Unknown Artist');
              const songCoverArt = parseSongValue(song.coverArt, 'https://placehold.co/300x300');
              const songArtistAvatar = parseSongValue(song.artistAvatar, '');

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
          // List View
          <div className="space-y-3">
            {songs.map((song) => {
              const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
              const songArtist = parseSongValue(song.artist, 'Unknown Artist');

              return (
                <ListSongItem
                  key={song._id}
                  song={{
                    ...song,
                    title: songTitle,
                    artist: songArtist
                  }}
                  playSong={playSong}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto">
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

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {songs.map((song) => {
              const songTitle = parseSongValue(song.name || song.title, 'Unknown Song');
              const songArtist = parseSongValue(song.artist, 'Unknown Artist');
              const songCoverArt = parseSongValue(song.coverArt, 'https://placehold.co/300x300');

              return (
                <GridSongItem
                  key={song._id}
                  song={song}
                  playSong={playSong}
                  songTitle={songTitle}
                  songArtist={songArtist}
                  songCoverArt={songCoverArt}
                />
              );
            })}
        </div>
      ) : (
        // List View
        <div className="">
          {songs.map((song) => (
            <ListSongItem
              key={song._id}
              song={song}
              playSong={playSong}
            />
          ))}
        </div>
      )}
    </div>
  );
}


