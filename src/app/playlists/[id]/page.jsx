'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import GridSongItem from '@/components/GridSongItem';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import toast from 'react-hot-toast';

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentTrack, setQueue, isPlaying, currentTrack } = useAudioPlayer();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/${id}`);
        if (!response.ok) throw new Error('Failed to fetch playlist');
        const data = await response.json();
        console.log('Playlist data:', data);
        setPlaylist(data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        toast.error('Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handlePlayAll = () => {
    if (!playlist?.songs?.length) return;
    setQueue(playlist.songs);
    setCurrentTrack(playlist.songs[0]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Playlist not found</h1>
        <Link href="/playlists" className="text-blue-500 hover:underline">
          Back to playlists
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Full-width Header Section */}
      <div className="relative mb-12">
        <div className="relative h-[30vh] md:h-[40vh] lg:h-[50vh] w-full overflow-hidden">
          <Image
            src={playlist.cover || 'https://placehold.co/400x400'}
            alt={playlist.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl font-bold text-white mb-2">{playlist.name}</h1>
              <p className="text-gray-300 mb-4">
                {playlist.songs?.length || 0} tracks
              </p>
              {playlist.description && (
                <p className="text-gray-300 mb-4">
                  {playlist.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayAll}
                className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                Play All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlist.songs?.map((song) => (
          <GridSongItem
            key={song._id}
            song={song}
            isPlaying={isPlaying && currentTrack?._id === song._id}
          />
        ))}
      </div>

      {/* Empty State */}
      {(!playlist.songs || playlist.songs.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            This playlist is empty
          </p>
          <Link
            href="/songs"
            className="text-blue-500 hover:underline"
          >
            Browse songs to add
          </Link>
        </div>
      )}
    </div>
  );
}
