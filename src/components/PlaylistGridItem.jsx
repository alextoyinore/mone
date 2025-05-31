"use client";

import Image from 'next/image';
import { PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import defaultImage from '@/assets/default-image-black.svg';

export default function PlaylistGridItem({ playlist, handleDeletePlaylist }) {
  const { playSong, setSongsForPlayback } = useAudioPlayer();
  return (
    <div 
      key={playlist._id} 
      className="group relative cursor-pointer"
    >
        <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          {/* Playlist Cover */}
          <Link href={`/playlists/${playlist._id}`} className="absolute inset-0 cursor-pointer">
              <Image
                src={playlist.cover || defaultImage}
                alt={playlist.name}
                width={300}
                height={300}
                className="object-cover"
                unoptimized
              />
          </Link>

          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-colors duration-300" />
          
          {/* Action Buttons */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSongsForPlayback(playlist.songs);
              playSong(playlist.songs[0]);
            }}
            className="absolute bottom-2 cursor-pointer left-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100 z-20"
          >
            <PlayIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePlaylist(playlist._id);
            }}
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
    </div>
  );
}
