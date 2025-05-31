import React from 'react';
import Image from 'next/image';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';

const FeedItem = ({ user, currentSong }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="relative w-10 h-10">
        <Image
          src={user.avatar || '/default-avatar.svg'}
          alt={user.name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500">is listening to</p>
          </div>
          <button className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-900">
            {currentSong ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm mt-1">{currentSong?.title}</p>
      </div>
    </div>
  );
};

export default FeedItem;
