"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import PlaylistGridItem from '@/components/PlaylistGridItem';
import PlaylistListItem from '@/components/PlaylistListItem';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import AuthRequired from '../../components/AuthRequired';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import ViewIcon from '@/components/icons/ViewIcon';
import TrashIcon from '@/components/icons/TrashIcon';

import toast, { Toaster } from 'react-hot-toast';
import PlayIcon from '@/components/icons/PlayIcon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSongsForPlayback } = useAudioPlayer();

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

  return (
    <>
    <Toaster />

    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        
        <div className="flex space-x-5 justify-between">
        <form onSubmit={handleCreatePlaylist} className="flex space-x-2">
          <input 
            type="text" 
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New Playlist Name"
            className="px-3 py-2 rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-900 dark:text-white w-64"
          />
          <button 
            type="submit" 
            disabled={isCreatingPlaylist}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingPlaylist ? 'Creating...' : 'Create'}
          </button>
        </form>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="transition-colors cursor-pointer"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? <ListIcon className="h-5 w-5" /> : <GridIcon className="h-5 w-5" />}
          </button>
        </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5' : 'flex flex-col'}>
        {playlists.length === 0 ? (
          <div className="col-span-full text-gray-500 dark:text-gray-400">
            No playlists yet. Create your first playlist!
          </div>
        ) : playlists.map((playlist) => (
          viewMode === 'grid' ? (
            <PlaylistGridItem 
              key={playlist._id}
              playlist={playlist}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          ) : (
            <PlaylistListItem 
              key={playlist._id}
              playlist={playlist}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          )
        ))}
      </div>
    </div>
    </>
  );
}

