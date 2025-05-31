"use client";

import Image from 'next/image';
import FollowButton from './FollowButton';
import { PlayIcon } from '@heroicons/react/24/outline';
import defaultImage from '@/assets/default-image.svg';

export default function GridArtistItem({ 
  artist,
  playSong,
  isFollowing
}) {

  return (
    <div 
      key={artist._id} 
      className="group relative cursor-pointer"
    >
      <div className="aspect-square relative overflow-hidden rounded-xl">
        <Image 
          src={artist.avatar || defaultImage}
          alt={artist.name} 
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={() => playSong(artist.songs[0])}
        />
        
        {/* Play Button */}
        <button 
          onClick={() => playSong(artist.songs[0])}
          className="absolute bottom-2 left-2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100"
        >
          <PlayIcon className="w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-75" />
        </button>

        {/* Like Button */}
        <div className="absolute bottom-2 right-2">
          <FollowButton 
            artistId={artist._id}
            initialFollowing={isFollowing}
            onChange={(following) => {
              artist.followers = following;
            }}
            className="bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="font-light text-sm truncate text-gray-900 dark:text-white">{artist.name}</h3>
        <div className="flex gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
          {artist.genre && <span>{artist.genre}</span>}
          {artist.followers && <span>{artist.followers?.toLocaleString() || 0} Followers</span>}
        </div>
      </div>
    </div>
  );
}
