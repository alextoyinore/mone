"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getUserTheme, setUserTheme } from "../apiTheme";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const { user } = useAuth() || { user: null };
  const [theme, setThemeState] = useState(() => {
    // Use typeof window check for server-side rendering
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
      return "light";
    }
    return "light";
  });

  // On login/app load, fetch user theme if logged in
  useEffect(() => {
    if (user && user.uid) {
      getUserTheme(user.uid)
        .then(userTheme => {
          setThemeState(userTheme);
          if (typeof window !== 'undefined') {
            localStorage.setItem("theme", userTheme);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Apply theme to document and localStorage
  useEffect(() => {
    const applyTheme = () => {
      let t = theme;
      if (theme === "system") {
        t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(t);
      localStorage.setItem("theme", theme);
    };

    // Only run on client
    if (typeof window !== 'undefined') {
      applyTheme();

      // Handle system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (theme === "system") {
          applyTheme();
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Custom setTheme that syncs with backend if logged in
  const setTheme = useCallback((newTheme) => {
    // Ensure this only runs on client
    if (typeof window !== 'undefined') {
      setThemeState(newTheme);
      localStorage.setItem("theme", newTheme);
      
      // Backend theme sync (if user is logged in)
      if (user && user.uid) {
        setUserTheme(user.uid, newTheme).catch(console.error);
      }
    }
  }, [user, setUserTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
