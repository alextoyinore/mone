import React from 'react';

export default function FastBackwardIcon({ 
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
        d="M11.5 12l8.5 6V6l-8.5 6zm-9 0l8.5 6V6l-8.5 6z" 
      />
    </svg>
  );
}
