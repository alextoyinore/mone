export default function AddToPlaylistIcon({ className = "w-6 h-6", isActive = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={isActive ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="3" y1="8" x2="17" y2="8" />
      <line x1="3" y1="12" x2="17" y2="12" />
      <line x1="3" y1="16" x2="17" y2="16" />
      <line x1="19" y1="12" x2="23" y2="12" />
      <line x1="21" y1="10" x2="21" y2="14" />
    </svg>
  );
}
