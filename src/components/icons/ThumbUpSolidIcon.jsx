"use client";

export default function ThumbUpSolidIcon({ className = "", ...props }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M6 18L3 15l3-3m0 0L9 11l3-3m-3 3v-2.5M14 10l2 1m0 0l2-1m-2 1v2.5M18 18L15 15l3-3m0 0L11 11l3-3m-3 3v2.5M18 18l-3 3m0 0l-3-3m3 3v-2.5M18 18l-3 3m0 0l-3-3m3 3v-2.5" />
    </svg>
  );
}
