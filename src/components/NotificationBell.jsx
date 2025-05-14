"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationBell({ onClick }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const audioInstance = new Audio('/notification.mp3');
        setAudio(audioInstance);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let prevCount = 0;

    const fetchCount = () => {
      fetch(`/api/notifications?user=${user.email}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const unread = data.filter(n => !n.read).length;
          if (unread > prevCount) {
            if (audio) {
              audio.play().catch(() => {});
            }
            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
              window.navigator.vibrate(200);
            }
          }
          prevCount = unread;
          setCount(unread);
        });
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [user, audio]);

  if (!user) return null;

  return (
    <button
      className="relative text-2xl hover:text-blue-600 transition"
      onClick={onClick}
      title="Notifications"
    >
      🔔
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
          {count}
        </span>
      )}
    </button>
  );
}