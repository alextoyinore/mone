import React from "react";

export default function ShareButtons({ url, title }) {
  const shareText = encodeURIComponent(title + " - Listen on Mone");
  const shareUrl = encodeURIComponent(url);
  return (
    <div className="flex gap-2 mt-2">
      <button
        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
        onClick={() => { navigator.clipboard.writeText(url); }}
        title="Copy link"
      >Copy Link</button>
      <a
        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
        target="_blank" rel="noopener noreferrer"
      >Twitter</a>
      <a
        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank" rel="noopener noreferrer"
      >Facebook</a>
      <a
        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200"
        href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
        target="_blank" rel="noopener noreferrer"
      >WhatsApp</a>
    </div>
  );
}
