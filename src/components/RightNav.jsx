"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSongOptions } from '@/contexts/SongOptionsContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useFriendActivity } from '@/contexts/FriendActivityContext';
import FeedItem from './FeedItem';
import ActivityItem from './ActivityItem';
import CommentItem from './CommentItem';
import TrendingItem from './TrendingItem';

const tabs = [
  { id: 'feeds', label: 'Feeds' },
  { id: 'activities', label: 'Activities' },
  { id: 'comments', label: 'Comments' },
  { id: 'trending', label: 'Trending' },
];

const RightNav = () => {
  const [activeTab, setActiveTab] = useState('feeds');
  const { user } = useAuth();
  const { currentSong } = useAudioPlayer();
  const { friendsListening } = useFriendActivity();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feeds':
        return (
          <div className="space-y-4">
            {friendsListening.map((friend) => (
              <FeedItem
                key={friend.id}
                user={friend}
                currentSong={friend.currentSong}
              />
            ))}
          </div>
        );
      case 'activities':
        return (
          <div className="space-y-4">
            {/* Activities will be populated from backend */}
            <ActivityItem user={user} action="played" song={currentSong} />
          </div>
        );
      case 'comments':
        return (
          <div className="space-y-4">
            {/* Comments will be populated from backend */}
            <CommentItem user={user} song={currentSong} />
          </div>
        );
      case 'trending':
        return (
          <div className="space-y-4">
            {/* Trending content will be populated from backend */}
            <TrendingItem song={currentSong} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-80 hidden lg:block sticky ${ currentSong ? 'top-0 max-h-[calc(100vh-5em)]' : 'top-0 max-h-screen' } right-0 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 p-4 space-y-4`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default RightNav;
