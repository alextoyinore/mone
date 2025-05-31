"use client";

import Image from 'next/image';
import Link from 'next/link';
import ViewIcon from '@/components/icons/ViewIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import defaultImage from '@/assets/default-image-black.svg';

export default function PlaylistListItem({ playlist, handleDeletePlaylist }) {
  const { playSong, setSongsForPlayback } = useAudioPlayer();
  return (
    <div 
      key={playlist._id}
      className="flex items-center justify-between odd:bg-white even:bg-gray-50 dark:odd:bg-black dark:even:bg-gray-900 hover:bg-blue-500 cursor-pointer p-2 transition group"
    >
      <Link href={`/playlists/${playlist._id}`} className="flex hover:bg-blue-500 items-center space-x-4">
        <Image 
          src={playlist.cover || defaultImage} 
          alt={playlist.name} 
          width={60} 
          height={60} 
          className="w-16 h-16 object-cover rounded-lg cursor-pointer"
          unoptimized
        />
        <div className="flex-1">
          <h3 className="font-medium capitalize text-sm">{playlist.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white">{playlist.songs.length} tracks</p>
        </div>
      </Link>

      <div className="flex items-center space-x-2">
      <button
          onClick={(e) => {
            e.stopPropagation();
            setSongsForPlayback(playlist.songs);
            playSong(playlist.songs[0]);
          }}
          className="text-white p-2 rounded-full hover:bg-blue-600 transition opacity-0 group-hover:opacity-100 group-hover:text-white cursor-pointer"
        >
          <PlayIcon className="w-5 h-5" />
        </button>

        <Link 
          href={`/playlists/${playlist._id}`}
          className="text-white p-2 rounded-full hover:bg-blue-600 transition opacity-0 group-hover:opacity-100 group-hover:text-white cursor-pointer"
        >
          <ViewIcon className="w-5 h-5" />
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePlaylist(playlist._id);
          }}
          className="text-white p-2 rounded-full hover:bg-blue-600 transition opacity-0 group-hover:opacity-100 group-hover:text-white cursor-pointer"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
