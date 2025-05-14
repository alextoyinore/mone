import React from 'react';

export default function FastForwardIcon({ 
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
        d="M12.5 12l-8.5 6V6l8.5 6zm9-6v12l-8.5-6 8.5-6z" 
      />
    </svg>
  );
}
