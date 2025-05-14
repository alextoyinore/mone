// Utility functions for song-related operations

// Defensive parsing of song value
export const parseSongValue = (value, fallback = '') => {
  // Ensure only primitive values are used
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'object' && value.toString) return value.toString();
  return fallback;
};

// Format time in MM:SS
export const formatTime = (sec) => {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};
