"use client";

import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AuthLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 dark:bg-gray-900 rounded-xl">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
