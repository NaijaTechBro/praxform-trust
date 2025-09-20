import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches notifications for the logged-in user.
 * Your AuthContext interceptor will automatically add the token.
 */
export const fetchNotifications = () => {
    return axios.get(`${API_BASE_URL}/notifications`);
};

/**
 * Marks a specific notification as read.
 * @param {string} notificationId - The ID of the notification to mark as read.
 */

export const markNotificationAsRead = (notificationId) => {
    return axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
}

/**
 * Marks all of the user's notifications as read.
 */
export const markAllNotificationsAsRead = () => {
    return axios.put(`${API_BASE_URL}/notifications/read-all`);
};