"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequired from '../../components/AuthRequired';
import axios from 'axios';

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/playlists?user=${user.email}`);
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
    if (!newPlaylistName.trim() || !user) return;

    try {
      const response = await axios.post('/api/playlists', {
        name: newPlaylistName,
        user: user.email,
        description: '',
        isPublic: false
      });

      setPlaylists([...playlists, response.data]);
      setNewPlaylistName('');
    } catch (err) {
      console.error('Failed to create playlist', err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`/api/playlists/${playlistId}`);
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err) {
      console.error('Failed to delete playlist', err);
    }
  };

  if (!user) {
    return <AuthRequired message="You must be logged in to view playlists." />;
  } 

  if (loading) {
    return <div className="text-center py-8">Loading playlists...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">My Playlists</h1>
      
      <form onSubmit={handleCreatePlaylist} className="mb-6 flex">
        <input 
          type="text" 
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Create new playlist"
          className="flex-grow px-3 py-2 border rounded-l-lg bg-gray-100 dark:bg-gray-800 dark:text-white"
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
        >
          Create
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div 
            key={playlist._id} 
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{playlist.songs.length} tracks</p>
            <div className="mt-4 flex space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                View
              </button>
              <button 
                onClick={() => handleDeletePlaylist(playlist._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

