"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import AuthRequired from '../../components/AuthRequired';
import Image from 'next/image';

import toast, { Toaster } from 'react-hot-toast';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists?user=${user.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      
      const data = await response.json();
      setPlaylists(data);
      setLoading(false);
      } catch (err) {
        setError('Failed to fetch playlists');
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);


  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !user) {
      toast.error('Playlist name is required');
      return;
    }

    setIsCreatingPlaylist(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newPlaylistName,
          user: user.email
        })
      });


      const responseBody = await response.text();
      console.log('Response body:', responseBody);

      if (!response.ok) {
        throw new Error(`Failed to create playlist: ${responseBody}`);
      }

      const newPlaylistData = JSON.parse(responseBody);
      setPlaylists([...playlists, newPlaylistData]);
      setNewPlaylistName('');
      toast.success('Playlist created successfully');
    } catch (err) {
      console.error('Playlist creation error:', err);
      toast.error(`Failed to create playlist: ${err.message}`);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/${playlistId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err) {
      toast.error('Failed to delete playlist');
    }
  };

  if (!user) {
    return <AuthRequired message="You must be logged in to view playlists." />;
  } 

  if (loading) {
    return <div className="text-center py-8">Loading playlists...</div>;
  }

  return (
    <>
    <Toaster />

    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        
        <form onSubmit={handleCreatePlaylist} className="flex space-x-2">
          <input 
            type="text" 
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New Playlist Name"
            className="px-3 py-2 rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-white w-64"
          />
          <button 
            type="submit" 
            disabled={isCreatingPlaylist}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingPlaylist ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <ListIcon className="h-5 w-5" /> : <GridIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col'}>
        {playlists.length === 0 ? (
          <div className="col-span-full text-gray-500 dark:text-gray-400">
            No playlists yet. Create your first playlist!
          </div>
        ) : (
          playlists.map((playlist) => (
            // playlist card
          viewMode === 'grid' ? (
            <div 
              key={playlist._id} 
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{playlist.songs.length} tracks</p>
              <div className="mt-4 flex space-x-2">
                <Link 
                  href={`/playlists/${playlist._id}`} 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  View
                </Link>
                <button 
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div 
              key={playlist._id}
              className="flex items-center justify-between odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 p-4 transition"
            >
              <div className="flex items-center space-x-4">
                <Image 
                    src={playlist.cover || 'https://placehold.co/100x100'} 
                    alt={playlist.name} 
                    width={60} 
                    height={60} 
                    className="w-12 h-12 object-cover rounded-lg mr-4 cursor-pointer"
                    unoptimized
                  />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{playlist.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{playlist.songs.length} tracks</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/playlists/${playlist._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )))}
      </div>
    </div>
    </>
  );
}


