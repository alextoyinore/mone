"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequired from '../../components/AuthRequired';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    cover: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists`, { user: user.email });
        setPlaylists(response.data);
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
    if (!newPlaylist.name.trim() || !user) {
      toast.error('Playlist name is required');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists`, {
        name: newPlaylist.name,
        user: user.email,
        description: newPlaylist.description,
        cover: newPlaylist.cover,
        isPublic: newPlaylist.isPublic
      });

      setPlaylists([...playlists, response.data]);
      setNewPlaylist({
        name: '',
        description: '',
        cover: '',
        isPublic: false
      });
      toast.success('Playlist created successfully');
    } catch (err) {
      console.error('Failed to create playlist', err);
      toast.error('Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/${playlistId}`);
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err) {
      console.error('Failed to delete playlist', err);
      setError('Failed to delete playlist');
    }
  };

  if (!user) {
    return <AuthRequired message="You must be logged in to view playlists." />;
  } 

  if (loading) {
    return <div className="text-center py-8">Loading playlists...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">My Playlists</h1>
      
      <form onSubmit={handleCreatePlaylist} className="mb-6 space-y-4">
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={newPlaylist.name}
            onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
            placeholder="Playlist Name"
            className="flex-grow px-3 py-2 rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex items-center">
            <label className="mr-2 text-sm">
              Public
              <input 
                type="checkbox"
                checked={newPlaylist.isPublic}
                onChange={(e) => setNewPlaylist({...newPlaylist, isPublic: e.target.checked})}
                className="ml-2"
              />
            </label>
          </div>
        </div>
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={newPlaylist.description}
            onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
            placeholder="Description (optional)"
            className="flex-grow px-3 py-2 rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <input 
            type="text" 
            value={newPlaylist.cover}
            onChange={(e) => setNewPlaylist({...newPlaylist, cover: e.target.value})}
            placeholder="Cover URL (optional)"
            className="flex-grow px-3 py-2 rounded-lg focus:outline-none bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Playlist
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.length === 0 ? (
          <div className="col-span-full text-gray-500 dark:text-gray-400">
            No playlists yet. Create your first playlist!
          </div>
        ) : (
          playlists.map((playlist) => (
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
        )))}
      </div>
    </div>
  );
}


