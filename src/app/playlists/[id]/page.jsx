'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import GridSongItem from '@/components/GridSongItem';
import ListSongItem from '@/components/ListSongItem';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import toast from 'react-hot-toast';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import defaultImage from '@/assets/default-image-black.svg';


export default function PlaylistDetailPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const { setSongsForPlayback, playSong, isPlaying, currentTrack } = useAudioPlayer();

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
    setSongsForPlayback(playlist.songs);
    playSong(playlist.songs[0]);
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
    <div className="min-h-screen mx-auto">
      {/* Full-width Header Section */}
      <div className="relative mb-6">
        <div className="relative h-[40vh] md:h-[30vh] lg:h-[40vh] w-full overflow-hidden">
          <Image
            src={playlist.cover || defaultImage}
            alt={playlist.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
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
                onClick={() => handlePlayAll()}
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition flex items-center gap-2 cursor-pointer"
              >
                {
                  isPlaying && playlist.songs.includes(currentTrack) ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  ) 
                }
                {isPlaying && playlist.songs.includes(currentTrack) ? 'Pause' : 'Play All'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">Songs</h2>
          <button className="flex items-center gap-2"
          onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          >
            {
              view === 'grid' ? (
                <GridIcon isActive={false} onClick={() => setView('grid')} />
              ) : (
                <ListIcon isActive={false} onClick={() => setView('list')} />
              ) 
            } 
          </button>
        </div>

      {
       
       view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlist.songs?.map((song) => (
          <GridSongItem
            key={song._id}
            song={song}
            isPlaying={isPlaying && currentTrack?._id === song._id}
            playSong={() => playSong(song)}  
            songCoverArt={song?.coverArt}
            songTitle={song?.title}
            songArtist={song?.artist}
          />
        ))}
      </div>
        ) : (
          <div className="">
          {playlist.songs?.map((song) => (
            <ListSongItem
              key={song._id}
              song={song}
              isPlaying={isPlaying && currentTrack?._id === song._id}
              playSong={() => playSong(song)} 
            />
          ))}
        </div>
        )
      }
      </section>

      

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

