import axios from 'axios';
import authService from './authService';

const API_BASE = process.env.REACT_APP_API_URL || '';

export const getNotifications = async (userId) => {
  const token = authService.getToken();
  const res = await axios.get(`${API_BASE}/notifications`, {
    params: { userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const markNotificationsAsRead = async (notificationIds) => {
  const token = authService.getToken();
  await axios.put(`${API_BASE}/notifications/mark-as-read`, notificationIds, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

const notificationService = {
  getNotifications,
};

export default notificationService;
