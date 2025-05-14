import React from 'react';

export default function PreviousIcon({ 
  className = 'w-6 h-6', 
  isActive = false, 
  onClick 
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={`${className} fill-current`}
      onClick={onClick}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M7.4 12l8.5 6V6l-8.5 6zm-2.4 0a1 1 0 00.5.87l11.5 7.75A1 1 0 0019 19.62V4.38a1 1 0 00-1.5-.87L6 11.26a1 1 0 00-.5.87z" 
      />
      <rect x="4" y="4" width="2" height="16" rx="1" />
    </svg>
  );
}
