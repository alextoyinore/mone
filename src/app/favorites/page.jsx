"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import GridSongItem from '@/components/GridSongItem';
import ListSongItem from '@/components/ListSongItem';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import AuthRequired from '@/components/AuthRequired';


export default function FavoritesPage() {
  const { user } = useAuth();
  const { playSong, setSongsForPlayback } = useAudioPlayer();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorite?user=${user.email}`);
        const data = await response.json();
        console.log('Favorites data:', data); 
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.email]);

  const handlePlayAll = () => {
    if (!favorites?.length) return;
    setSongsForPlayback(favorites.map(f => f.song));
    playSong(favorites.map(f => f.song)[0]);
  };

  if (!user) {
    return <AuthRequired />;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl font-bold">Favorites</h1>
          <p className="text-gray-600 text-sm">{favorites.length} favorites</p>
          <span className="text-blue-500 cursor-pointer text-sm hover:text-blue-800"
          onClick={() => handlePlayAll()}
          >Play All</span>
        </div>

        <button
          onClick={() => setIsGridView(!isGridView)}
          className="text-gray-600 hover:text-gray-800"
          title="Toggle view"
        >
          {isGridView ? (
            <ListIcon className="w-6 h-6" />
          ) : (
            <GridIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No favorites yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {isGridView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <GridSongItem
                  key={favorite.song._id}
                  song={favorite.song}
                  songTitle={favorite.song.title}
                  songArtist={favorite.song.artist}
                  songCoverArt={favorite.song.coverArt}
                  playSong={() => playSong(favorite.song)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <ListSongItem
                  key={favorite.song._id}
                  song={favorite.song}
                  songTitle={favorite.song.title}
                  songArtist={favorite.song.artist}
                  songCoverArt={favorite.song.coverArt}
                  playSong={() => playSong(favorite.song)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
