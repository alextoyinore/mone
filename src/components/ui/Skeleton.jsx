export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-900 rounded ${className}`} />
  );
}; 