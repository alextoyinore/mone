"use client";

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import AuthRequired from '../../components/AuthRequired';

const SAMPLE_FAVORITES = [
  { 
    id: '1', 
    title: 'Midnight Memories', 
    artist: 'Lunar Waves', 
    album: 'Starry Nights',
    duration: '3:45',
    coverImage: 'https://placehold.co/',
    genre: 'Electronic'
  },
  { 
    id: '2', 
    title: 'Acoustic Sunrise', 
    artist: 'Forest Echoes', 
    album: 'Wooden Strings',
    duration: '4:12',
    coverImage: 'https://placehold.co/',
    genre: 'Acoustic'
  },
  { 
    id: '3', 
    title: 'Urban Rhythm', 
    artist: 'City Beats', 
    album: 'Street Sounds',
    duration: '3:30',
    coverImage: 'https://placehold.co/',
    genre: 'Hip Hop'
  }
];

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(SAMPLE_FAVORITES);
  const [filter, setFilter] = useState('');

  const filteredFavorites = favorites.filter(song => 
    song.title.toLowerCase().includes(filter.toLowerCase()) ||
    song.artist.toLowerCase().includes(filter.toLowerCase())
  );

  const handleRemoveFavorite = (songId) => {
    setFavorites(favorites.filter(song => song.id !== songId));
  };

  if (!user) {
    return <AuthRequired message="You must be logged in to view your favorite tracks." />;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">My Favorite Tracks</h1>
      
      <div className="mb-6 flex space-x-4">
        <input 
          type="text" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter favorites..."
          className="flex-grow px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
        />
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No favorite tracks found.</p>
          <Link 
            href="/explore" 
            className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
          >
            Explore New Music
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFavorites.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <Image 
                src={song.coverImage} 
                alt={song.title} 
                width={64} 
                height={64} 
                className="w-16 h-16 object-cover rounded-md mr-4" 
                unoptimized
              />
              
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{song.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {song.artist} • {song.album} • {song.genre}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 dark:text-gray-400">{song.duration}</span>
                
                <button 
                  onClick={() => handleRemoveFavorite(song.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Remove from Favorites"
                >
                  ❌
                </button>
                
                <button 
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  title="Play"
                >
                  ▶️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
