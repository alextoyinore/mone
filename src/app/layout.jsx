// "use client";

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import './globals.css';
import Navbar from '@/components/Navbar';
import MiniPlayer from '@/components/MiniPlayer';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] 
});

export const metadata = {
  title: 'Xitoplay - Music Streaming',
  description: 'Your personal music streaming platform',
  icons: {
    icon: '/icondark.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <AuthProvider>
          <ThemeProvider>
            <AudioPlayerProvider>
              <Navbar />
              <main className="flex-grow relative overflow-y-auto transition-all duration-300">
                <MiniPlayer className="sticky top-0 left-0 right-0 z-50" />
                {children}
              </main>
            </AudioPlayerProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

