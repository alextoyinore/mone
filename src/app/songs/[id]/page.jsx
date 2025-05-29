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
import QueueIcon from '@/components/icons/QueueIcon';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

export default function SongDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { currentSong, isPlaying, togglePlayPause, setSongsForPlayback, addToQueue, playSong } = useAudioPlayer();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        console.log('Fetching song with ID:', id);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/${id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch response not ok:', {
            status: response.status,
            statusText: response.statusText,
            errorText
          });
          throw new Error(`Failed to fetch song: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extensive logging of fetched song data
        console.log('Fetched song data:', {
          id: data._id,
          title: data.title,
          audioUrl: data.audioUrl,
          artist: data.artist?.name,
          fullData: data
        });

        // Validate critical song properties
        const requiredProps = ['_id', 'title', 'audioUrl', 'artist'];
        const missingProps = requiredProps.filter(prop => {
          if (prop === 'artist') return !data.artist?._id;
          return !data[prop];
        });

        if (missingProps.length > 0) {
          console.error('Song is missing critical properties:', missingProps);
          toast.error(`Incomplete song data: ${missingProps.join(', ')}`);
        }

        setSong(data);
      } catch (error) {
        console.error('Comprehensive error fetching song:', {
          error,
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/songs/${id}`
        });
        toast.error('Failed to load song details');
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id, toast]);

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
    try {
      // First, set the song as the current track
      setSongsForPlayback([song]);
      
      // Then play it
      playSong(song);
      
      // If we're already playing, toggle pause
      if (isPlaying) {
        togglePlayPause();
      }
    } catch (error) {
      console.error('Error playing song:', error);
      toast.error('Failed to play song');
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast.error('Please sign in to add to favorites');
      return;
    }
    if (user.favorites?.includes(song._id)) {
      toast.error('Song is already in favorites');
      return;
    }
    const updatedUser = {
      ...user,
      favorites: [...(user.favorites || []), song._id],
    };
    updateUser(updatedUser);
    toast.success('Song added to favorites');
  };

  const handleRemoveFromFavorites = () => {
    if (!user) {
      toast.error('Please sign in to remove from favorites');
      return;
    }
    const updatedUser = {
      ...user,
      favorites: user.favorites?.filter((id) => id !== song._id),
    };
    updateUser(updatedUser);
    toast.success('Song removed from favorites');
  };


  return (
    <div className="">
      {/* Full-width Cover Art */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <Image
          src={song.coverArt || 'https://placehold.co/1920x1080'}
          alt={song.title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-6 md:p-12 flex flex-wrap items-center">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{song.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <span>{song.artist?.name}</span>
              <span className="mx-2 opacity-50">•</span>
              <span>{song.genre}</span>
              <span className="mx-2 opacity-50">•</span>
              <span>{song.duration}</span>
              <span className="mx-2 opacity-50">•</span>
              <span>{song.plays || 0} plays</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base mt-4">
              <span>Album: {song.album || 'Single'}</span>
              <span className="mx-2 opacity-50">•</span>
              <span>Release Date: {new Date(song.createdAt).toLocaleDateString()}</span>
              <span className="mx-2 opacity-50">•</span>
              <span>Likes: {song.likes?.length || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePlayClick}
              className="bg-green-500 cursor-pointer text-sm text-white px-6 py-2 rounded-full hover:bg-green-600 transition flex items-center gap-2"
            >
              {isPlaying && currentSong?._id === song._id ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
              {isPlaying && currentSong?._id === song._id ? 'Pause' : 'Play'}
            </button>

            
            {user && (
              <button
                onClick={handleAddToQueue}
                className="dark:bg-white/10 cursor-pointer bg-black/10 text-sm text-white px-4 py-2 rounded-full hover:dark:bg-white/20 hover:bg-black/20 transition flex items-center gap-2"
              >
                <QueueIcon className="w-5 h-5" />
                {isCurrentSong ? 'Remove from Queue' : 'Add to Queue'}
              </button>
            )}

            {user?.favorites?.includes(song._id) ? (
                <button
                  onClick={handleRemoveFromFavorites}
                  className="dark:bg-white/10 cursor-pointer bg-black/10 text-sm text-white px-4 py-2 rounded-full hover:dark:bg-white/20 hover:bg-black/20 transition flex items-center gap-2"
                >
                  <FavoriteIcon className="w-5 h-5" />
                  Remove from Favorites
                </button>
              ) : (
                <button
                  onClick={handleAddToFavorites}
                  className="dark:bg-white/10 cursor-pointer bg-black/10 text-sm text-white px-4 py-2 rounded-full hover:dark:bg-white/20 hover:bg-black/20 transition flex items-center gap-2"
                >
                  <FavoriteIcon className="w-5 h-5" />
                  Add to Favorites
                </button>
              )}

            <button
              onClick={handleShare}
              className="dark:bg-white/10 cursor-pointer bg-black/10 text-sm text-white px-4 py-2 rounded-full hover:dark:bg-white/20 hover:bg-black/20 transition flex items-center gap-2"
            >
              <ShareIcon className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Song Details Container */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Song Description */}
        <div className="">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About This Song</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {song.description || 'No description available.'}
          </p>
        </div>

        {/* Artist Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
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
