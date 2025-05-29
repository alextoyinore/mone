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
  const { user } = useAuth();
  const { playSong, currentSong, isPlaying, setSongsForPlayback } = useAudioPlayer();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'


  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        // Only fetch if user is logged in
        if (!user) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recently-played?user=${user.email}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const data = await response.json();
        console.log('data: ', data);
        
        setRecentlyPlayed(data);
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

  const handlePlayAll = () => {
    if (recentlyPlayed.length > 0) {
      setSongsForPlayback(recentlyPlayed);
      playSong(recentlyPlayed[0]);
    }
  };

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

  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return (
      <div className="bg-white dark:bg-black min-h-screen p-4">
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
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <h1 className="text-3xl font-bold">Recently Played</h1>
            <p className="text-gray-600 text-sm">{recentlyPlayed.length} songs</p>
            <span className="text-blue-500 cursor-pointer text-sm hover:text-blue-800"
            onClick={() => handlePlayAll()}
            >Play All</span>
          </div>
  
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="text-gray-600 hover:text-gray-800"
            title="Toggle view"
          >
            {viewMode === 'grid' ? (
              <ListIcon isActive={false} />
            ) : (
              <GridIcon isActive={false} />
            )}
          </button>
        </div>
  
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : recentlyPlayed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No recently played songs yet</p>
          </div>
        ) : (
          <div className="">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyPlayed.map((song) => (
                  <GridSongItem
                    key={song._id}
                    song={song}
                    songTitle={song.title}
                    songArtist={song.artist}
                    songCoverArt={song.coverArt}
                    playSong={() => playSong(song)}
                  />
                ))}
              </div>
            ) : (
              <div className="">
                {recentlyPlayed.map((song) => (
                  <ListSongItem
                    key={song._id}
                    song={song}
                    songTitle={song.title}
                    songArtist={song.artist}
                    songCoverArt={song.coverArt}
                    playSong={() => playSong(song)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
}

