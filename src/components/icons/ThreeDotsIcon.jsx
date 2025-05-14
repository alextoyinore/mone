"use client";

export default function ThreeDotsIcon({ 
  className = "w-5 h-5", 
  onClick 
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      onClick={onClick}
    >
      <path 
        fillRule="evenodd" 
        d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM10.5 18a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}
