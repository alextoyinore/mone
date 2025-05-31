import React from 'react';
import Image from 'next/image';
import PlayIcon from '@/components/icons/PlayIcon';
import defaultImage from '@/assets/default-image-black.svg';

const TrendingItem = ({ song }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="relative w-12 h-12">
        <Image
          src={song?.cover || defaultImage}
          alt={song?.title || 'Unknown'}
          fill
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{song?.title || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">{song?.artist || 'Unknown'}</p>
          </div>
          <button className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-900">
            <PlayIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>🔥 Trending</span>
          <span>•</span>
          <span>100k plays</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingItem;
