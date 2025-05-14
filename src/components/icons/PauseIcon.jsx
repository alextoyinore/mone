import React from 'react';

export default function PauseIcon({ 
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
        d="M10 4H6v16h4V4zm8 0h-4v16h4V4z" 
      />
    </svg>
  );
}
