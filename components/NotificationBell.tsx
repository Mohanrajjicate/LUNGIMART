
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface NotificationBellProps {
  target: 'user' | 'admin';
  direction?: 'up' | 'down';
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ target, direction = 'down', className }) => {
  const { notifications, markAsRead, clearAllNotifications, user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Static notification for logged-out users
  const loggedOutNotification = useMemo(() => ({
    id: 999999, // A unique ID that won't clash
    message: "Sign in to get your welcome offer coupon!",
    link: '/profile',
    read: false,
    timestamp: new Date().toISOString(),
    target: 'user' as const,
  }), []);

  // Determine which notifications to show
  const targetNotifications = useMemo(() => {
    if (target === 'user') {
      if (!user) {
        // If logged out, show only the sign-in prompt
        return [loggedOutNotification];
      }
      // If logged in, show their actual notifications
      return notifications.filter(n => n.target === 'user');
    }
    // For admin, keep original logic
    return notifications.filter(n => n.target === 'admin');
  }, [notifications, target, user, loggedOutNotification]);

  const unreadCount = useMemo(() => {
    if (target === 'user' && !user) {
      return 1; // Always show 1 for the logged-out prompt
    }
    return targetNotifications.filter(n => !n.read).length;
  }, [targetNotifications, target, user]);

  const handleNotificationClick = (id: number, link?: string) => {
    if (user) { // Only mark as read if a real user is logged in
      markAsRead(id);
    }
    setIsOpen(false);
    if (link) {
      navigate(link);
    }
  };

  const handleClearAll = () => {
    if (user) { // Only allow clearing for logged-in users
      clearAllNotifications(target);
    }
  };
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`relative ${className || ''}`} aria-label="Notifications">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 z-50 overflow-hidden ${direction === 'up' ? 'bottom-full mb-2' : 'mt-2'}`}>
          <div className="p-3 flex justify-between items-center border-b">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {user && targetNotifications.length > 0 && <button onClick={handleClearAll} className="text-xs font-semibold text-primary hover:underline">Clear All</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {targetNotifications.length > 0 ? (
              targetNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.link)}
                  className={`p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                >
                  <p className="text-sm text-slate-700">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-slate-500 text-center">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
