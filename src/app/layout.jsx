// "use client";

import { DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { SongOptionsProvider } from '@/contexts/SongOptionsContext';
import './globals.css';
import SideNav from '@/components/SideNav';
import MiniPlayer from '@/components/MiniPlayer';
import RightNav from '@/components/RightNav';

const dmSans = DM_Sans({ 
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
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${dmSans.className} w-full flex justify-center items-center bg-white dark:bg-black text-gray-900 dark:text-white`}>
        <AuthProvider>
          <ThemeProvider>
            <AudioPlayerProvider>
              <SongOptionsProvider>
                <main className="flex flex-col mx-auto min-h-screen w-full relative">
                  <section className="flex w-full relative">
                    <SideNav />
                    <div className="flex-grow relative overflow-y-auto transition-all duration-300 p-6">
                      {children}
                    </div>
                    <RightNav />
                  </section>
                  <MiniPlayer className="sticky bottom-0 left-0 z-50" />
                </main>
              </SongOptionsProvider>
            </AudioPlayerProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
