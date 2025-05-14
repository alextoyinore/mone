"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequired from '../../components/AuthRequired';

const SAMPLE_ALBUMS = [
  {
    id: '1',
    title: 'Starry Nights',
    artist: 'Lunar Waves',
    genre: 'Electronic',
    year: 2024,
    tracks: 12,
    duration: '45:30',
    coverImage: 'https://placehold.co/400',
    topTracks: [
      { id: 'track1', title: 'Midnight Memories', duration: '3:45' },
      { id: 'track2', title: 'Cosmic Journey', duration: '4:12' },
      { id: 'track3', title: 'Stellar Drift', duration: '3:30' }
    ]
  },
  {
    id: '2',
    title: 'Wooden Strings',
    artist: 'Forest Echoes',
    genre: 'Acoustic',
    year: 2023,
    tracks: 10,
    duration: '38:15',
    coverImage: 'https://placehold.co/400',
    topTracks: [
      { id: 'track4', title: 'Mountain Breeze', duration: '4:05' },
      { id: 'track5', title: 'River Song', duration: '3:55' },
      { id: 'track6', title: 'Forest Whispers', duration: '4:20' }
    ]
  },
  {
    id: '3',
    title: 'Street Sounds',
    artist: 'Urban Rhythms',
    genre: 'Hip Hop',
    year: 2025,
    tracks: 14,
    duration: '52:45',
    coverImage: 'https://placehold.co/400',
    topTracks: [
      { id: 'track7', title: 'City Lights', duration: '3:40' },
      { id: 'track8', title: 'Concrete Dreams', duration: '3:55' },
      { id: 'track9', title: 'Urban Flow', duration: '4:10' }
    ]
  }
];

export default function AlbumsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const filteredAlbums = SAMPLE_ALBUMS.filter(album => 
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (genreFilter ? album.genre.toLowerCase() === genreFilter.toLowerCase() : true) &&
    (yearFilter ? album.year.toString() === yearFilter : true)
  );

  if (!user) {
    return <AuthRequired message="You must be logged in to view albums." />;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Albums</h1>
      
      <div className="mb-6 flex space-x-4">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search albums..."
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

        <select 
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Years</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {filteredAlbums.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No albums found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <div 
              key={album.id} 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={album.coverImage} 
                  alt={album.title} 
                  layout="fill" 
                  objectcover="cover" 
                  className="absolute inset-0"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{album.title}</h2>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{album.artist}</span>
                  <span>{album.year}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>{album.genre}</span>
                  <span>{album.tracks} Tracks • {album.duration}</span>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Top Tracks</h3>
                  <ul className="space-y-1">
                    {album.topTracks.map((track) => (
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
                    href={`/album/${album.id}`} 
                    className="flex-grow text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Album
                  </Link>
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    title="Play Album"
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
