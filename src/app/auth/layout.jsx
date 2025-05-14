"use client";

import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AuthLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
