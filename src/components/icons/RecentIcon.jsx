import React from 'react';

export default function RecentIcon({ className = '', outline = true, filled = false }) {
  return outline ? (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' className={className}>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  ) : (
    <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24' className={className}>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  );
}
