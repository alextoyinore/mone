"use client";

export default function HorizontalThreeDotsIcon({ 
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
        d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}
