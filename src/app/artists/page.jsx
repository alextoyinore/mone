"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequired from '../../components/AuthRequired';

const SAMPLE_ARTISTS = [
  {
    id: '1',
    name: 'Lunar Waves',
    genre: 'Electronic',
    followers: 12500,
    monthlyListeners: 850000,
    coverImage: 'https://placehold.co/400',
    topTracks: [
      { id: 'track1', title: 'Midnight Memories', duration: '3:45' },
      { id: 'track2', title: 'Starry Nights', duration: '4:12' },
      { id: 'track3', title: 'Cosmic Journey', duration: '3:30' }
    ]
  },
  {
    id: '2',
    name: 'Forest Echoes',
    genre: 'Acoustic',
    followers: 8700,
    monthlyListeners: 450000,
    coverImage: 'https://placehold.co/400',
    topTracks: [
      { id: 'track4', title: 'Wooden Strings', duration: '4:05' },
      { id: 'track5', title: 'Mountain Breeze', duration: '3:55' },
      { id: 'track6', title: 'River Song', duration: '4:20' }
    ]
  },
  {
    id: '3',
    name: 'Urban Rhythms',
    genre: 'Hip Hop',
    followers: 15300,
    monthlyListeners: 1200000,
    coverImage: 'https://placehold.co/400',
    topTracks: [
      { id: 'track7', title: 'City Lights', duration: '3:40' },
      { id: 'track8', title: 'Street Sounds', duration: '3:55' },
      { id: 'track9', title: 'Concrete Dreams', duration: '4:10' }
    ]
  }
];

export default function ArtistsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const filteredArtists = SAMPLE_ARTISTS.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (genreFilter ? artist.genre.toLowerCase() === genreFilter.toLowerCase() : true)
  );

  if (!user) {
    return <AuthRequired message="You must be logged in to view artists." />;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Artists</h1>
      
      <div className="mb-6 flex space-x-4">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search artists..."
          className="flex-grow px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        />
        
        <select 
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Genres</option>
          <option value="Electronic">Electronic</option>
          <option value="Acoustic">Acoustic</option>
          <option value="Hip Hop">Hip Hop</option>
        </select>
      </div>

      {filteredArtists.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No artists found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div 
              key={artist.id} 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={artist.coverImage} 
                  alt={artist.name} 
                  layout="fill" 
                  objectcover="cover" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{artist.genre}</span>
                  <span>{artist.monthlyListeners.toLocaleString()} Monthly Listeners</span>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Top Tracks</h3>
                  <ul className="space-y-1">
                    {artist.topTracks.map((track) => (
                      <li 
                        key={track.id} 
                        className="flex justify-between text-sm"
                      >
                        <span>{track.title}</span>
                        <span>{track.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-4">
                  <Link 
                    href={`/artist/${artist.id}`} 
                    className="flex-grow text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Artist
                  </Link>
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    title="Play Artist Radio"
                  >
                    ▶️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
