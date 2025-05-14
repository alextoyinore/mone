import React from 'react';

export default function LoopIcon({ 
  className = 'w-6 h-6', 
  isActive = false, 
  onClick 
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={`${className} ${isActive ? 'text-blue-500' : 'text-gray-500'} fill-current`}
      onClick={onClick}
    >
      <path d="M17 17H7v-3l-4 4 4 4v-3h12v-6h-2z"/>
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2z"/>
    </svg>
  );
}
