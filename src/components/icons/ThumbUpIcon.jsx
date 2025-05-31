"use client";

export default function ThumbUpIcon({ className = "", ...props }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 10l-2 1m0 0l-2-1m2 1v2.5M6 18L3 15l3-3m0 0L9 11l3-3m-3 3v-2.5m-6-1a9 9 0 1118 0 9 9 0 01-18 0z"
      />
    </svg>
  );
}
