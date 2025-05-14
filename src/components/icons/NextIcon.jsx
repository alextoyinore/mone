import React from 'react';

export default function NextIcon({ 
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
        d="M16.6 12l-8.5 6V6l8.5 6zm2.4 0a1 1 0 01-.5.87L6.5 20.51A1 1 0 015 19.62V4.38a1 1 0 011.5-.87l11.5 7.75a1 1 0 01.5.87z" 
      />
      <rect x="18" y="4" width="2" height="16" rx="1" />
    </svg>
  );
}
