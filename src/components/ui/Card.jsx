export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}; 