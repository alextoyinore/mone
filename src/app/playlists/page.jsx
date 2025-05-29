"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import AuthRequired from '../../components/AuthRequired';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import ViewIcon from '@/components/icons/ViewIcon';
import TrashIcon from '@/components/icons/TrashIcon';

import toast, { Toaster } from 'react-hot-toast';
import PlayIcon from '@/components/icons/PlayIcon';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
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

    <div className="min-h-screen p-8 bg-white dark:bg-black text-gray-900 dark:text-white">
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
        ) : (
          playlists.map((playlist) => (
            // playlist card
          viewMode === 'grid' ? (
            <div 
              key={playlist._id} 
              className="group relative cursor-pointer"
            >
               <Link href={`/playlists/${playlist._id}`} className="absolute inset-0 cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
                  {/* Playlist Cover */}
                
                    <Image
                      src={playlist.cover || 'https://placehold.co/400x400'}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-colors duration-300" />
                  
                  {/* Action Buttons */}
                  <button 
                    onClick={() => playPlaylist(playlist)}
                    className="absolute bottom-2 cursor-pointer left-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100 z-20"
                  >
                    <PlayIcon className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100 z-20"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                {/* Content */}
                <div className="flex flex-col text-gray-700 mt-2">
                    <h2 className="text-xs">{playlist.name}</h2>
                    <p className="text-xs">{playlist.songs.length} tracks</p>
                  </div>
              </Link>
            </div>
          ) : (
            <div 
              key={playlist._id}
              className="flex items-center justify-between odd:bg-white even:bg-gray-50 dark:odd:bg-black dark:even:bg-gray-900 hover:bg-blue-500 cursor-pointer p-4 transition"
            >
              <Link href={`/playlists/${playlist._id}`} className="flex items-center space-x-4">
                <Image 
                    src={playlist.cover || 'https://placehold.co/100x100'} 
                    alt={playlist.name} 
                    width={60} 
                    height={60} 
                    className="w-12 h-12 object-cover rounded-lg mr-4 cursor-pointer"
                    unoptimized
                  />
                <div className="flex-1">
                  <h3 className="font-medium capitalize text-sm">{playlist.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{playlist.songs.length} tracks</p>
                </div>
              </Link>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/playlists/${playlist._id}`}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition"
                >
                  <ViewIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition"
                >
                  <TrashIcon className="w-5 h-5" />
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


