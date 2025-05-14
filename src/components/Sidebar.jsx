import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import HomeIcon from "./icons/HomeIcon";
import SearchIcon from "./icons/SearchIcon";
import NotificationIcon from "./icons/NotificationIcon";
import MessageIcon from "./icons/MessageIcon";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Search', icon: SearchIcon, path: '/search' },
    { name: 'Notifications', icon: NotificationIcon, path: '/notifications' },
    { name: 'Messages', icon: MessageIcon, path: '/messages' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-400 mb-6">Mone</h1>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  isActive ? 'font-bold text-primary dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {user && (
        <div className="mt-auto mb-4 flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <img 
            src={user.photoURL || 'https://via.placeholder.com/40'} 
            alt={user.displayName} 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{user.displayName || user.email}</p>
            <button 
              onClick={() => { logout(); navigate("/"); }} 
              className="text-xs text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <ThemeSwitcher />
    </div>
  );
}
