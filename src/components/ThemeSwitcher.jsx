"use client";

import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect } from "react";

export default function ThemeSwitcher({ open, onClose }) {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: '☀️' },
    { value: 'dark', label: 'Dark Mode', icon: '🌙' },
    { value: 'system', label: 'System Preference', icon: '💻' }
  ];

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted, return null to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-white/90 dark:bg-gray-900/90 border-l border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="font-bold text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
          <span>🎨</span> Theme Selector
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          ✕
        </button>
      </div>
      
      <div className="p-6 space-y-4">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => { setTheme(option.value); onClose(); }}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition ${theme === option.value ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{option.icon}</span>
              <span className="text-base font-medium">{option.label}</span>
            </div>
            {theme === option.value && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}