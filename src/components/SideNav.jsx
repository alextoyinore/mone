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
import XitoIconWhite from '../assets/iconwhite.svg';
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
import { usePathname } from 'next/navigation';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

export default function SideNav() {
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const { isPlaying, currentSong } = useAudioPlayer();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const sidebarItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    // { name: 'Search', icon: SearchIcon, path: '/search' },
    // { name: 'Notifications', icon: NotificationIcon, onClick: () => setNotifOpen((o) => !o) },
    // { name: 'Theme', icon: ThemeIcon, onClick: () => setThemeOpen((o) => !o) },
    // { name: 'Artists', icon: ArtistIcon, path: '/artists' },
    { name: 'Albums', icon: AlbumIcon, path: '/albums' },
    { name: 'Songs', icon: SongIcon, path: '/songs' },
    { name: 'Upload', icon: UploadIcon, path: '/upload' },
    { name: 'Favorites', icon: FavoriteIcon, path: '/favorites' },
    { name: 'Recently Played', icon: RecentIcon, path: '/recent' },
    { name: 'Playlists', icon: PlaylistIcon, path: '/playlists' },
    { name: 'Inbox', icon: MessageIcon, path: '/inbox' },
  ];


  if (pathname == '/auth/login' || pathname == '/auth/signup') return null;

  return (
    <>
      <nav className={`hidden md:block sticky relative left-0 overflow-y-auto py-5 ${isExpanded ? 'min-w-60' : 'min-w-20'} bg-gray-100 dark:bg-black border-r border-gray-200 dark:border-gray-800 ${ currentSong ? 'top-0 max-h-[calc(100vh-5em)]' : 'top-0 max-h-screen' } transition-all duration-300 ease-in-out z-40`}>
        {/* Logo */}
        <Link href="/">
          <div className='flex px-5 items-center cursor-pointer gap-0.5 mb-6 ml-2'>
            <Image src={XitoIcon} alt="Logo" className='block dark:hidden' width={28} height={28} />
            <Image src={XitoIconWhite} alt="Logo" width={28} className='hidden dark:block' height={28} />
            {isExpanded && (
              <span className='text-xl font-bold text-black dark:text-white'>itoplay</span>
            )}
          </div>
        </Link>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className='absolute top-0 right-0 transition-all duration-300 ease-in-out hover:opacity-75 focus:outline-none cursor-pointer'
          style={{
            transform: `rotate(${isExpanded ? '0' : '0'}deg)`,
            transformOrigin: 'center'
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            className="fill-gray-800 dark:fill-gray-200"
          >
            <path d="M0 0 L20 0 L20 20 L0 0 Z" />
          </svg>
        </button>

        {/* Search */}
        {isExpanded && (
          <form onSubmit={handleSearch} className='mb-6 px-5'>
            <div className='relative'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search...'
                className='w-full focus:outline-none border-0 rounded-lg px-4 py-2 text-base bg-white dark:bg-gray-900 dark:text-white transition'
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
                className={`flex items-center text-sm ${isExpanded ? 'space-x-3 px-5 py-2' : 'justify-center p-2'} transition text-gray-700 dark:text-gray-300 ${pathname === item.path 
                  ? 'bg-blue-500 text-white dark:bg-gray-900 text-gray-900 dark:text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-black dark:hover:text-gray-400'}`}
              >
                <item.icon className={`w-4 h-4 ${isExpanded ? '' : 'w-5 h-5 cursor-pointer mx-auto'}`} />
                {isExpanded && <span>{item.name}</span>}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`w-full flex text-sm items-center ${isExpanded ? 'space-x-3 px-3 py-2' : 'justify-center p-2'} transition text-gray-700 dark:text-gray-300 ${item.active 
                  ? 'bg-blue-600 dark:bg-black text-gray-900 dark:text-white' 
                  : 'hover:bg-blue-600 dark:hover:bg-black dark:hover:text-gray-400'}`}
              >
                <item.icon className={`w-4 h-4 ${isExpanded ? '' : 'mx-auto'}`} />
                {isExpanded && <span>{item.name}</span>}
              </button>
            )
          ))}
        </nav>

        {/* User Profile or Login */}
        {user && isExpanded ? (
          <div className='absolute bottom-0 left-0 w-full px-5 py-3 border-t border-gray-200 dark:border-gray-800 pt-4 text-sm'>
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
                <div className='w-10 h-10 cursor-pointer font-bold text-gray-500 dark:text-gray-400 rounded-full bg-gray-200 dark:bg-gray-900 flex items-center justify-center'>
                  {user?.displayName ? user?.displayName[0].toUpperCase() : user?.email.split('@')[0][0].toUpperCase()}
                </div>
              )}
              <div className='flex flex-col items-start gap-1'>
                <Link href='/profile' className='font-medium text-gray-800 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-400'>
                  {user?.displayName.split(' ')[0] || user?.email.split('@')[0]}
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

        {
          user && !isExpanded && (
            <div className='absolute bottom-0 left-0 w-full px-5 py-3 border-t border-gray-200 dark:border-gray-800 pt-4 text-sm'>
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
                <div className='w-10 h-10 cursor-pointer font-bold text-gray-500 dark:text-gray-400 rounded-full bg-gray-200 dark:bg-gray-900 flex items-center justify-center'>
                  {user?.displayName ? user?.displayName[0].toUpperCase() : user?.email.split('@')[0][0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          )
        }
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