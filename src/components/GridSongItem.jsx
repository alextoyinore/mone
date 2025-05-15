"use client";

import Image from 'next/image';
import PlayIcon from '@/components/icons/PlayIcon';
import SongOptionsDropdown from './SongOptionsDropdown';

export default function GridSongItem({ 
  song, 
  playSong, 
  songTitle, 
  songArtist, 
  songCoverArt 
}) {
  return (
    <div 
      key={song._id} 
      className="group relative cursor-pointer"
    >
      <div className="aspect-square relative overflow-hidden rounded-xl">
        <Image 
          src={songCoverArt} 
          alt={songTitle} 
          width={300} 
          height={300} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={() => playSong(song)}
        />
        <button 
          onClick={() => playSong(song)}
          className="absolute bottom-2 left-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100"
        >
          <PlayIcon isActive={false} className="w-6 h-6 opacity-0 group-hover:opacity-75" />
        </button>

        <button 
          className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100"
        >
          <SongOptionsDropdown song={song} />
        </button>
      </div>
      <div className="mt-2">
        <h3 className="font-light text-sm truncate text-gray-900 dark:text-white">{songTitle}</h3>
        <p className="text-xs text-gray-500 truncate">{songArtist}</p>
      </div>
    </div>
  );
}
