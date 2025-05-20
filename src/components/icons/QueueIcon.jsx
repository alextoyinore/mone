import React from 'react';

export default function QueueIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" 
      />
    </svg>
  );
}
