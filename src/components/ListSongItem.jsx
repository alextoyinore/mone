"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function ListSongItem({ 
  song, 
  playSong 
}) {
  return (
    <div 
      key={song._id} 
      className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-3 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <Image 
        src={song.coverArt || 'https://placehold.co/100x100'} 
        alt={song.title} 
        width={100} 
        height={100} 
        className="w-16 h-16 object-cover rounded-lg mr-4"
        onClick={() => playSong(song)}
      />
      <div className="flex-grow">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{song.title}</h3>
        <p className="text-xs text-gray-500 truncate">{song.artist}</p>
      </div>
      
      <button 
        onClick={() => playSong(song)}
        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
      >
        Play
      </button>
      <Link 
        href={`songs/${song._id}`} 
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
