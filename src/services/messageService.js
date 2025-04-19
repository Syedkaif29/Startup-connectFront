import axios from 'axios';
import authService from './authService';

const API_BASE = process.env.REACT_APP_API_URL || '';

export const getConversationUsers = async (userId) => {
  const token = authService.getToken();
  const res = await axios.get(`${API_BASE}/messages/conversation-users`, {
    params: { userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const messageService = {
  getConversationUsers,
};

export default messageService;
