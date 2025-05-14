"use client";

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import AuthRequired from '../components/AuthRequired';

const SAMPLE_ACTIVITIES = [
  {
    id: '1',
    type: 'playlist_created',
    title: 'Summer Vibes 2025',
    details: 'Created a new playlist with 25 tracks',
    timestamp: '2 hours ago',
    icon: '🎵'
  },
  {
    id: '2',
    type: 'track_liked',
    title: 'Midnight Memories',
    artist: 'Lunar Waves',
    details: 'Added to your liked songs',
    timestamp: 'Yesterday',
    icon: '❤️'
  },
  {
    id: '3',
    type: 'collaboration_started',
    title: 'Urban Rhythms Collab',
    details: 'Started a new collaboration with Alex Rodriguez',
    timestamp: '3 days ago',
    icon: '🤝'
  },
  {
    id: '4',
    type: 'profile_update',
    title: 'Profile Updated',
    details: 'Updated profile picture and bio',
    timestamp: 'Last week',
    icon: '👤'
  }
];

export default function ActivityPage() {
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  if (!user) {
    return <AuthRequired message="You must be logged in to view your activity." />;
  }

  return (
        <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recent Activity</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('playlist_created')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'playlist_created' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Playlists
          </button>
          <button 
            onClick={() => setFilter('track_liked')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'track_liked' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Tracks
          </button>
          <button 
            onClick={() => setFilter('collaboration_started')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'collaboration_started' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Collaborations
          </button>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No recent activities found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-3xl mr-4">{activity.icon}</div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {activity.type === 'playlist_created' && `Playlist: ${activity.title}`}
                      {activity.type === 'track_liked' && `Track: ${activity.title} by ${activity.artist}`}
                      {activity.type === 'collaboration_started' && `Collaboration: ${activity.title}`}
                      {activity.type === 'profile_update' && activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.details}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
              
              <div className="ml-4">
                {activity.type === 'playlist_created' && (
                  <Link 
                    href="/playlists" 
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    View Playlist
                  </Link>
                )}
                {activity.type === 'track_liked' && (
                  <Link 
                    href="/favorites" 
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    View Favorites
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
