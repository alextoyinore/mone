"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SongContext = createContext(null);

export function SongProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  // Fetch songs from backend
  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/songs`);
      setSongs(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch songs');
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new song
  const addSong = async (songData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/songs`, songData);
      setSongs([...songs, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add song');
      throw err;
    }
  };

  // Update a song
  const updateSong = async (id, updates) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/${id}`, updates);
      setSongs(songs.map(song => song._id === id ? response.data : song));
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update song');
      throw err;
    }
  };

  // Delete a song
  const deleteSong = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/${id}`);
      setSongs(songs.filter(song => song._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete song');
      throw err;
    }
  };

  // Select a song
  const selectSong = (song) => {
    setSelectedSong(song);
  };

  // Clear selected song
  const clearSelectedSong = () => {
    setSelectedSong(null);
  };

  // Initialize songs when component mounts
  useEffect(() => {
    fetchSongs();
  }, []);

  // Context value
  const value = {
    songs,
    loading,
    error,
    selectedSong,
    fetchSongs,
    addSong,
    updateSong,
    deleteSong,
    selectSong,
    clearSelectedSong,
  };

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  );
}

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
};

export default SongContext;