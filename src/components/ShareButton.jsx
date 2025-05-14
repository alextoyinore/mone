import { useState } from "react";

export default function ShareButton({ songId, songTitle }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/song/${songId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="inline-block relative">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-md bg-white/80 dark:bg-gray-800/80 border border-blue-200 dark:border-blue-700 text-blue-500 text-xl hover:text-blue-700 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={copyToClipboard}
        title="Share song"
        aria-label="Share song"
      >
        🔗
      </button>
      {copied && (
        <span className="absolute left-1/2 -translate-x-1/2 top-6 bg-white border border-gray-300 rounded px-2 py-1 text-xs shadow">
          Link copied!
        </span>
      )}
    </div>
  );
}
