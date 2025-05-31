import React from 'react';
import Image from 'next/image';
import defaultImage from '@/assets/default-image-black.svg';

const CommentItem = ({ user, song }) => {
  return (
    <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="relative w-10 h-10">
        <Image
          src={user.avatar || defaultImage}
          alt={user.name || 'Unknown'}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{user.name || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">commented on</p>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
            10m
          </span>
        </div>
        <p className="text-sm mt-1">"This song is amazing!"</p>
      </div>
    </div>
  );
};

export default CommentItem;
