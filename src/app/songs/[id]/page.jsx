"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

export default function SongDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { currentSong, isPlaying, togglePlayPause, playSong, setSongsForPlayback, setCurrentTrack, addToQueue } = useAudioPlayer();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch song');
        const data = await response.json();
        setSong(data);
      } catch (error) {
        console.error('Error fetching song:', error);
        toast.error('Failed to load song');
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handlePlaySong = () => {
    if (!song) return;
    setCurrentTrack(song);
  };

  const handleAddToQueue = () => {
    if (!song) return;
    addToQueue(song);
  };

  const handleShare = () => {
    if (!song) return;

    const shareData = {
      title: song.title,
      text: `Check out ${song.title} by ${song.artist?.name || 'Unknown Artist'}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error('Error sharing:', error);
        toast.error('Failed to share song');
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.url).then(() => {
        toast.success('Song link copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Song not found</h1>
        <Link href="/songs" className="text-blue-500 hover:underline">
          Back to songs
        </Link>
      </div>
    );
  }

  const isCurrentSong = currentSong?._id === song._id;

  const handlePlayClick = () => {
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      setSongsForPlayback([song]);
      playSong(0);
    }
  };

  return (
    <div className="">
      {/* Full-width Cover Art */}
      <div className="relative w-full h-[30vh] md:h-[40vh] lg:h-[50vh]">
        <Image
          src={song.coverArt || 'https://placehold.co/1920x1080'}
          alt={song.title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Song Details Container */}
      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 md:p-12">
          {/* Song Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
            <div className="relative aspect-square w-48 md:w-64 -mt-24 md:-mt-32 shadow-xl rounded-xl overflow-hidden">
              <Image
                src={song.coverArt || 'https://placehold.co/400x400'}
                alt={song.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Song Details */}
          <div className="flex-1">
            <h1 className="text-6xl font-bold mb-2">{song.title}</h1>
            
            <Link 
              href={`/artists/${song.artist?._id}`}
              className="text-xl text-gray-600 dark:text-gray-400 hover:underline mb-6 block"
            >
              {song.artist?.name || 'Unknown Artist'}
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handlePlayClick}
                className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                {isCurrentSong ? (
                  isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />
                ) : (
                  <PlayIcon className="w-8 h-8" />
                )}
              </button>

              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <FavoriteIcon className="w-8 h-8" />
              </button>

              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <ShareIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Song Info</h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Album</dt>
                    <dd>{song.album || 'Single'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Genre</dt>
                    <dd>{song.genre || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Release Date</dt>
                    <dd>{new Date(song.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Stats</h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Plays</dt>
                    <dd>{song.plays || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Likes</dt>
                    <dd>{song.likes?.length || 0}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Song Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About This Song</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {song.description || 'No description available.'}
          </p>
        </div>

        {/* Artist Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">About the Artist</h2>
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={song.artist?.avatar || 'https://placehold.co/150x150'}
                alt={song.artist?.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {song.artist?.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                {song.artist?.bio || 'No artist bio available.'}
              </p>
              <Link 
                href={`/artists/${song.artist?._id}`}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
              >
                View Artist Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Related Songs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {song.relatedSongs && song.relatedSongs.length > 0 ? (
              song.relatedSongs.map((relatedSong) => (
                <Link
                  key={relatedSong._id}
                  href={`/songs/${relatedSong._id}`}
                  className="group"
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl">
                    <Image
                      src={relatedSong.coverArt || 'https://placehold.co/400x400'}
                      alt={relatedSong.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-base font-semibold line-clamp-1">{relatedSong.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{relatedSong.artist?.name}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 col-span-full text-center">
                No related songs found.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
