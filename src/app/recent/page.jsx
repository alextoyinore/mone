"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequired from '../../components/AuthRequired';
import Image from 'next/image';
import Link from 'next/link';

const SAMPLE_RECENTLY_PLAYED = [
  {
    id: '1',
    title: 'Midnight Memories',
    artist: 'Lunar Waves',
    album: 'Echoes of Time',
    duration: '3:45',
    playedAt: '2 hours ago',
    coverArt: '/path/to/album/cover1.jpg'
  },
  {
    id: '2',
    title: 'Urban Rhythms',
    artist: 'City Beats',
    album: 'Street Sounds',
    duration: '4:12',
    playedAt: 'Today',
    coverArt: '/path/to/album/cover2.jpg'
  },
  {
    id: '3',
    title: 'Sunset Melody',
    artist: 'Horizon Sounds',
    album: 'Golden Hour',
    duration: '3:30',
    playedAt: 'Yesterday',
    coverArt: '/path/to/album/cover3.jpg'
  }
];

export default function RecentlyPlayedPage() {
  const { user } = useAuth();
  const [recentlyPlayed, setRecentlyPlayed] = useState(SAMPLE_RECENTLY_PLAYED);
  const [filter, setFilter] = useState('all');

  if (!user) {
    return <AuthRequired message="You must be logged in to view recently played songs." />;
  }

  const filteredSongs = recentlyPlayed.filter(song => 
    filter === 'all' || song.artist.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recently Played</h1>
        
        <div className="flex items-center space-x-2">
          <input 
            type="text"
            placeholder="Filter by artist"
            value={filter === 'all' ? '' : filter}
            onChange={(e) => setFilter(e.target.value || 'all')}
            className="px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {filteredSongs.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No recently played songs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSongs.map((song) => (
            <div 
              key={song.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center space-x-4">
                <Image 
                  src={song.coverArt} 
                  alt={`${song.title} album cover`} 
                  width={64} 
                  height={64} 
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{song.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {song.artist} • {song.album}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {song.duration}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {song.playedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
