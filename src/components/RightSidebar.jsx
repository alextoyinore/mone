import React from 'react';
import Footer from './Footer';

export default function RightSidebar() {
  return (
    <aside className="sticky top-0 right-0 h-screen overflow-y-auto w-80 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 p-6 hidden md:block">
      <div className="space-y-6">
        {/* Trending Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Trending</h2>
          <div className="space-y-3">
            {/* Placeholder for trending items */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div>
                <p className="text-sm font-medium">Trending Song Title</p>
                <p className="text-xs text-gray-500">Artist Name</p>
              </div>
            </div>
            {/* More trending items... */}
          </div>
        </section>

        {/* Recommended Artists */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recommended Artists</h2>
          <div className="space-y-3">
            {/* Placeholder for recommended artists */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Artist Name</p>
                <p className="text-xs text-gray-500">Genre</p>
              </div>
            </div>
            {/* More recommended artists... */}
          </div>
        </section>

        {/* Recommended Playlists */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recommended Playlists</h2>
          <div className="space-y-3">
            {/* Placeholder for recommended playlists */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div>
                <p className="text-sm font-medium">Playlist Name</p>
                <p className="text-xs text-gray-500">Creator Name</p>
              </div>
            </div>
            {/* More recommended playlists... */}
          </div>
        </section>

        {/* Recommended Albums */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recommended Albums</h2>
          <div className="space-y-3">
            {/* Placeholder for recommended albums */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div>
                <p className="text-sm font-medium">Album Name</p>
                <p className="text-xs text-gray-500">Artist Name</p>
              </div>
            </div>
            {/* More recommended albums... */}
          </div>
        </section>

        <section>
          <Footer />
        </section>
      </div>
    </aside>
  );
}
