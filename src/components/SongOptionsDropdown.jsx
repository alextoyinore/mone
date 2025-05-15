"use client";

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useSongOptions } from '@/contexts/SongOptionsContext';
import HorizontalThreeDotsIcon from './icons/HorizontalThreeDotsIcon';

export default function SongOptionsDropdown({ song }) {
  const { openDropdownId, setOpenDropdownId } = useSongOptions();
  const isOpen = openDropdownId === song._id;
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both dropdown and icon
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        iconRef.current && 
        !iconRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, setOpenDropdownId]);

  return (
    <div className="relative">
      <HorizontalThreeDotsIcon 
        ref={iconRef}
        onClick={() => setOpenDropdownId(isOpen ? null : song._id)}
        className="w-5 h-5 cursor-pointer z-50 opacity-0 group-hover:opacity-100 transition"
      />
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-48 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 origin-bottom-right animate-dropdown">
          <Link 
            href={`/songs/${song._id}`} 
            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-blue/10 transition cursor-pointer"
            onClick={() => setOpenDropdownId(null)}
          >
            View Song
          </Link>
          <hr className="my-1 border-black/10 dark:border-white/10" />
          <p 
            onClick={() => {
              // TODO: Implement share functionality
              console.log('Share song', song);
              setOpenDropdownId(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-blue/10 transition cursor-pointer"
          >
            Share
          </p>
        </div>
      )}
    </div>
  );
}
