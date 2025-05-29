"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

export default function SearchPage() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('tracks');
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: searchQuery,
          types: ['tracks', 'artists', 'albums', 'playlists']
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
      setSearchResults({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to access search</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner className="h-5 w-5" /> : '🔍'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-6 flex space-x-4">
        {(['tracks', 'artists', 'albums', 'playlists']).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : searchQuery && searchResults[activeTab].length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No {activeTab} found for "{searchQuery}"</p>
        </div>
      ) : !searchQuery ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Enter a search query to find songs, artists, albums, and playlists</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'tracks' && searchResults.tracks.map((track) => (
            <div 
              key={track.id} 
              className="flex items-center bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <Image 
                src={track.coverImage || 'https://via.placeholder.com/64'} 
                alt={track.title} 
                width={64} 
                height={64} 
                className="w-16 h-16 object-cover rounded-md mr-4" 
              />
              
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{track.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {track.artist} • {track.album}
                </p>
              </div>
              
              <span className="text-gray-500 dark:text-gray-400">{track.duration}</span>
            </div>
          ))}

          {activeTab === 'artists' && searchResults.artists.map((artist) => (
            <div 
              key={artist.id} 
              className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={artist.coverImage || 'https://placehold.co/'} 
                  alt={artist.name} 
                  layout="fill" 
                  objectCover="cover" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{artist.genre}</span>
                  <span>{artist.followers?.toLocaleString() || 0} Followers</span>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'albums' && searchResults.albums.map((album) => (
            <div 
              key={album.id} 
              className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={album.coverImage || 'https://placehold.co/'} 
                  alt={album.title} 
                  layout="fill" 
                  objectCover="cover" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{album.title}</h2>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{album.artist}</span>
                  <span>{album.year} • {album.tracks} Tracks</span>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'playlists' && searchResults.playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={playlist.coverImage || 'https://placehold.co/'} 
                  alt={playlist.title} 
                  layout="fill" 
                  objectCover="cover" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{playlist.title}</h2>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Created by {playlist.creator}</span>
                  <span>{playlist.tracks} Tracks</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
