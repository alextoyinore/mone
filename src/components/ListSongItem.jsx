"use client";

import Image from 'next/image';
import Link from 'next/link';
import PauseIcon from '@/components/icons/PauseIcon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import SongOptionsDropdown from './SongOptionsDropdown';
import PlayIcon from '@/components/icons/PlayIcon';
import defaultImage from '@/assets/default-image.svg';

export default function ListSongItem({ 
  song, 
  playSong 
}) {
  const { currentSong, isPlaying } = useAudioPlayer();

  const isCurrentSong = currentSong?._id === song._id;
  const showPauseIcon = isCurrentSong && isPlaying;
  return (
    <div 
      key={song._id} 
      className={`flex items-center p-3 transition-all duration-300 group cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-900 hover:text-white dark:hover:text-white ${isCurrentSong ? 'bg-blue-400 dark:bg-blue-600 text-white' : 'odd:bg-white even:bg-gray-50 dark:odd:bg-black dark:even:bg-gray-900'}`}
    >
      <Image 
        src={song.coverArt || defaultImage} 
        alt={song.title} 
        width={60} 
        height={60} 
        className="w-12 h-12 object-cover rounded-lg mr-4 cursor-pointer"
        onClick={() => playSong(song)}
      />
      <div className="flex-grow">
        <h3 className="font-medium capitalize text-sm">{song.title}</h3>
        <p className="text-xs truncate">{song.artist.name}</p>
      </div>

      {isCurrentSong ? (
        <button 
          onClick={() => playSong(song)}
          className="text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
        ): (
        <>
        <button 
            className="text-white p-2 rounded-full hover:bg-blue-600 transition opacity-0 group-hover:opacity-100 cursor-pointer">

          {showPauseIcon ? (
            <PauseIcon className="w-5 h-5 " />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
        </>
      )}
      
      <SongOptionsDropdown song={song} />

    </div>
  );
}
