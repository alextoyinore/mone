"use client";

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.displayName || user.email}</h2>
            <p className="text-gray-600 dark:text-gray-300">Your music journey starts here.</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/upload" className="block text-blue-600 dark:text-blue-400 hover:underline">Upload a Song</a>
              <a href="/playlists" className="block text-blue-600 dark:text-blue-400 hover:underline">My Playlists</a>
              <a href="/favorites" className="block text-blue-600 dark:text-blue-400 hover:underline">Favorite Tracks</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Welcome to Xitoplay</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Discover, upload, and share your favorite music. Create playlists, 
              explore new artists, and enjoy a personalized music experience.
            </p>
            <div className="space-y-4">
              <a 
                href="/auth/login" 
                className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Log In
              </a>
              <a 
                href="/auth/signup" 
                className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Sign Up
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>Explore music without an account</p>
              <a href="/explore" className="text-blue-600 dark:text-blue-400 hover:underline">
                Browse Public Playlists
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
