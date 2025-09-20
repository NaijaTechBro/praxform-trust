import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchNotifications, markAllNotificationsAsRead as apiMarkAllAsRead, markNotificationAsRead as apiMarkAsRead } from '../services/notificationService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const getNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }
        
        try {
            const { data } = await fetchNotifications();
            if (data.success) {
                setNotifications(data.data);
                setUnreadCount(data.unreadCount);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getNotifications();
            const intervalId = setInterval(getNotifications, 60000); // Poll every 60 seconds
            return () => clearInterval(intervalId);
        }
    }, [user, getNotifications]);

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;
        const previousNotifications = [...notifications];
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await apiMarkAllAsRead();
        } catch (err) {
            console.error('Failed to mark all as read', err);
            setNotifications(previousNotifications); // Revert on error
        }
    };
    
    // --- ADD THIS ENTIRE FUNCTION ---
    const markAsRead = async (notificationId) => {
        const notification = notifications.find(n => n._id === notificationId);
        // If it's not found or already read, do nothing.
        if (!notification || notification.isRead) return;

        // Optimistically update the UI
        const updatedNotifications = notifications.map(n => 
            n._id === notificationId ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(prev => prev - 1);

        // Make the API call in the background
        try {
            await apiMarkAsRead(notificationId);
        } catch (err) {
            console.error('Failed to mark notification as read', err);
            // On error, revert the changes
            setNotifications(notifications);
            setUnreadCount(prev => prev + 1);
        }
    };
    // --- END OF NEW FUNCTION ---

    const value = {
        notifications,
        unreadCount,
        loading,
        markAllAsRead,
        markAsRead, // EXPORT THE NEW FUNCTION
        refetchNotifications: getNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};