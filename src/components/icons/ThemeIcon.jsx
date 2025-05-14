import React from 'react';

export default function ThemeIcon({ className = 'w-5 h-5', outline = true, filled = false }) {
  return outline ? (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.93 5.93m12.728 12.728 1.414-1.414M6.343 5.657 5.93 4.243m12.728 12.728 1.414 1.414M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
  ) : (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.5 10.5 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
    </svg>
  );
}
