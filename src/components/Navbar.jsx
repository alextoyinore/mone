"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import NotificationsPanel from './NotificationsPanel';
import ThemeSwitcher from './ThemeSwitcher';
import Image from 'next/image';
import XitoIcon from '../assets/icondark.svg';
import HomeIcon from './icons/HomeIcon';
import SearchIcon from './icons/SearchIcon';
import NotificationIcon from './icons/NotificationIcon';
import MessageIcon from './icons/MessageIcon';
import ArtistIcon from './icons/ArtistIcon';
import SongIcon from './icons/SongIcon';
import UploadIcon from './icons/UploadIcon';
import FavoriteIcon from './icons/FavoriteIcon';
import RecentIcon from './icons/RecentIcon';
import PlaylistIcon from './icons/PlaylistIcon';
import ProfileIcon from './icons/ProfileIcon';
import AlbumIcon from './icons/AlbumIcon';
import ThemeIcon from './icons/ThemeIcon';


export default function Navbar() {
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const sidebarItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Search', icon: SearchIcon, path: '/search' },
    { name: 'Notifications', icon: NotificationIcon, onClick: () => setNotifOpen((o) => !o) },
    { name: 'Theme', icon: ThemeIcon, onClick: () => setThemeOpen((o) => !o) },
    { name: 'Inbox', icon: MessageIcon, path: '/inbox' },
    { name: 'Artists', icon: ArtistIcon, path: '/artists' },
    { name: 'Albums', icon: AlbumIcon, path: '/albums' },
    { name: 'Songs', icon: SongIcon, path: '/songs' },
    { name: 'Upload', icon: UploadIcon, path: '/upload' },
    { name: 'Favorites', icon: FavoriteIcon, path: '/favorites' },
    { name: 'Recently Played', icon: RecentIcon, path: '/recent' },
    { name: 'Playlists', icon: PlaylistIcon, path: '/playlists' },
    // { name: 'Profile', icon: ProfileIcon, path: '/profile' },
  ];

  return (
    <>
      <nav className={`sticky relative top-0 left-0 overflow-y-auto p-5 ${isExpanded ? 'w-80' : 'w-20'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out z-40`}>
        {/* Logo */}
        <Link href="/">
          <div className='flex items-center cursor-pointer gap-1 mb-6 ml-2'>
            <Image src={XitoIcon} alt="Logo" width={28} height={28} />
            {isExpanded && (
              <span className='text-xl font-bold text-gray-800 dark:text-white'>itoplay</span>
            )}
          </div>
        </Link>
        <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className='absolute top-10 -right-[5px] z-50 text-gray-500 hover:text-gray-700 p-2 dark:text-gray-300 dark:hover:text-gray-400 dark:bg-gray-900 rounded-l-full'
      >
        {isExpanded ? '←' : '→'}
      </button>

        {/* Search */}
        {isExpanded && (
          <form onSubmit={handleSearch} className='mb-2'>
            <div className='relative'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search...'
                className='w-full border-0 rounded-lg px-4 py-2 text-base bg-gray-100 dark:bg-gray-800 dark:text-white transition'
              />
              <button 
                type='submit' 
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-primary dark:bg-primary-600 text-gray-500 p-2 rounded-full text-sm font-medium hover:bg-primary-600 dark:hover:bg-primary-700 transition'
              >
                <SearchIcon className='w-4 h-4' />
              </button>
            </div>
          </form>
        )}
        
        {/* Navigation */}
        <nav className='space-y-1'>
          {sidebarItems.map((item) => (
            item.path ? (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`flex items-center text-sm ${isExpanded ? 'space-x-3 px-3 py-2' : 'justify-center p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 dark:hover:text-gray-400`}
              >
                <item.icon className={`w-4 h-4 ${isExpanded ? '' : 'w-5 h-5 cursor-pointer mx-auto'}`} />
                {isExpanded && <span>{item.name}</span>}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`w-full flex text-sm items-center ${isExpanded ? 'space-x-3 px-3 py-2' : 'justify-center p-2'} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 dark:hover:text-gray-400`}
              >
                <item.icon className={`w-4 h-4 ${isExpanded ? '' : 'mx-auto'}`} />
                {isExpanded && <span>{item.name}</span>}
              </button>
            )
          ))}
        </nav>

        {/* User Profile or Login */}
        {user && isExpanded ? (
          <div className='mt-6 border-t border-gray-200 dark:border-gray-800 pt-4 text-sm'>
            <div className='flex items-center space-x-3'>
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt="Profile" 
                  width={40} 
                  height={40} 
                  className='rounded-full'
                />
              ) : (
                <div className='w-10 h-10 cursor-pointer font-bold text-gray-500 dark:text-gray-400 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email.split('@')[0][0].toUpperCase()}
                </div>
              )}
              <div className='flex flex-col gap-2'>
                <Link href='/profile' className='font-medium text-gray-800 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-400'>
                  {user.displayName.split(' ')[0] || user.email.split('@')[0]}
                </Link>
                <button 
                  onClick={logout} 
                  className='text-xs cursor-pointer text-red-500 hover:text-red-700'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          isExpanded && (
            <div className='mt-6 border-t border-gray-200 dark:border-gray-800 pt-4 text-sm'>
              <Link 
                href='/auth/login' 
                className='flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400 transition'
              >
                <span>Login</span>
              </Link>
            </div>
          )
        )}
      </nav>

      {/* Notifications Panel */}
      <NotificationsPanel 
        open={notifOpen} 
        onClose={() => setNotifOpen(false)} 
      />

      {/* Theme Switcher */}
      <ThemeSwitcher 
        open={themeOpen} 
        onClose={() => setThemeOpen(false)} 
      />
    </>
  );
}