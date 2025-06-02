"use client";

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';

const SAMPLE_PLAYLISTS = [
  { 
    id: '1', 
    name: 'Chill Beats', 
    creator: 'Xitoplay', 
    tracks: 25, 
    genre: 'Lo-Fi',
    coverImage: 'https://placehold.co/' 
  },
  { 
    id: '2', 
    name: 'Workout Mix', 
    creator: 'Community', 
    tracks: 40, 
    genre: 'Electronic',
    coverImage: 'https://placehold.co/' 
  },
  { 
    id: '3', 
    name: 'Acoustic Vibes', 
    creator: 'Folk Artists', 
    tracks: 18, 
    genre: 'Acoustic',
    coverImage: 'https://placehold.co/' 
  },
  { 
    id: '4', 
    name: 'Late Night Jazz', 
    creator: 'Jazz Collective', 
    tracks: 30, 
    genre: 'Jazz',
    coverImage: 'https://placehold.co/' 
  }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [playlists, setPlaylists] = useState(SAMPLE_PLAYLISTS);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlaylists(SAMPLE_PLAYLISTS);
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (genre ? playlist.genre.toLowerCase() === genre.toLowerCase() : true)
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Explore Public Playlists</h1>
      
      <div className="mb-6 flex space-x-4">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search playlists..."
          className="flex-grow px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
        />
        
        <select 
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
        >
          <option value="">All Genres</option>
          <option value="Lo-Fi">Lo-Fi</option>
          <option value="Electronic">Electronic</option>
          <option value="Acoustic">Acoustic</option>
          <option value="Jazz">Jazz</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlaylists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <Image 
              src={playlist.coverImage} 
              alt={playlist.name} 
              className="w-full h-48 object-cover"
              unoptimized
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <p>By {playlist.creator}</p>
                <p>{playlist.tracks} tracks • {playlist.genre}</p>
              </div>
              <Link 
                href={`/playlist/${playlist.id}`} 
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Playlist
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
          <p>No playlists found matching your search.</p>
        </div>
      )}
    </div>
  );
}

