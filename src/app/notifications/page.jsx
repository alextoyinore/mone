"use client";

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import AuthRequired from '../../components/AuthRequired';

const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'friend_request',
    user: {
      name: 'Emma Johnson',
      avatar: 'https://placehold.co/'
    },
    message: 'wants to connect with you',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    type: 'playlist_share',
    user: {
      name: 'Music Collective',
      avatar: 'https://placehold.co/'
    },
    message: 'shared a new playlist with you',
    time: 'Yesterday',
    read: true
  },
  {
    id: '3',
    type: 'collaboration_invite',
    user: {
      name: 'Alex Rodriguez',
      avatar: 'https://placehold.co/'
    },
    message: 'invited you to collaborate on a track',
    time: '3 days ago',
    read: false
  }
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const handleClearNotification = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || 
    (filter === 'unread' && !notif.read) ||
    (filter === 'read' && notif.read)
  );

  if (!user) {
    return <AuthRequired message="You must be logged in to view your notifications." />;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
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
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Unread
          </button>
          <button 
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'read' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No notifications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-center p-4 rounded-lg shadow-md transition ${
                notification.read 
                  ? 'bg-gray-100 dark:bg-gray-800' 
                  : 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600'
              }`}
            >
              <Image 
                src={notification.user.avatar} 
                alt={notification.user.name} 
                width={48} 
                height={48} 
                className="rounded-full mr-4"
              />
              
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {notification.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {notification.time}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {!notification.read && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Mark as Read"
                  >
                    ✓
                  </button>
                )}
                
                <button 
                  onClick={() => handleClearNotification(notification.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Remove Notification"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
