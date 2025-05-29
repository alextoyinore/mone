export const MusicCard = ({ title, subtitle, image, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-gray-900 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <PlayIcon className="w-6 h-6 text-white" />
        </button>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white truncate">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
    </div>
  );
}; 