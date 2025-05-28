import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './SideNav';
import RightSidebar from './RightSidebar';
import MiniPlayer from './MiniPlayer';

const AUTH_ROUTES = ['/login', '/register', '/reset-password'];

export default function AppLayout({ children }) {
  const location = useLocation();

  // Determine if current route is an auth route
  const isAuthRoute = AUTH_ROUTES.some(route => 
    location.pathname.includes(route)
  );

  // Render layout based on route type
  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <main>
          <Outlet/>
        </main>
      </div>
    );
  }

  return (
    <div className="flex max-w-[100%] min-h-screen relative">
      {/* Sidebar (Always visible except on auth routes) */}
      <Navbar />

      {/* Main Content Area (Center Column) */}
      <main className="w-[calc(100%-30rem)] p-5 pb-20">
        <Outlet/>
      </main>

      {/* Right Sidebar */}
      <div className="w-[20rem]">
        <RightSidebar />
      </div>

      <MiniPlayer />
    </div>
  );
}

