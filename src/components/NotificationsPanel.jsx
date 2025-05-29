"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

export default function NotificationsPanel({ open, onClose }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ comment: true, like: true, follow: true, system: true });
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
    if (!user || !open) return;
    setLoading(true);
    let prevIds = [];

    const fetchNotifications = () => {
      fetch(`/api/notifications?user=${user.email}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setNotifications(data);
          const newIds = data.filter(n => !n.read).map(n => n._id);
          if (audio && prevIds.length && newIds.some(id => !prevIds.includes(id))) {
            audio.play().catch(() => {});
            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
              window.navigator.vibrate(200);
            }
          }
          prevIds = newIds;
        })
        .finally(() => setLoading(false));
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user, open, audio]);

  const markAllRead = async () => {
    await fetch("/api/notifications/readall", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.email })
    });
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(n => filter[n.type]);

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-white/90 dark:bg-black/90 border-l border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="font-bold text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
          <span>🔔</span> Notifications
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          ✕
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {Object.keys(filter).map(type => (
              <button
                key={type}
                onClick={() => setFilter(prev => ({ ...prev, [type]: !prev[type] }))}
                className={`px-2 py-1 rounded text-xs ${filter[type] 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
              >
                {type}
              </button>
            ))}
          </div>
          {filteredNotifications.some(n => !n.read) && (
            <button 
              onClick={markAllRead} 
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications</div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map(notification => (
              <Link 
                key={notification._id} 
                href={notification.link || '#'}
                className={`block p-3 rounded-lg transition ${
                  notification.read 
                    ? 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-900' 
                    : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}