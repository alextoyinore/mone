export default function LoadingSpinner({ className = "h-12 w-12" }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${className}`}></div>
    </div>
  );
}
