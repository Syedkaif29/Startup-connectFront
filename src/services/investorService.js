import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api';

const investorService = {
    getAllInvestors: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.get(`${API_URL}/investors`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching investors:', error);
            throw error.response?.data || error.message;
        }
    },

    getInvestorById: async (investorId) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.get(`${API_URL}/investors/${investorId}`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching investor details:', error);
            throw error.response?.data || error.message;
        }
    },

    getInvestorProfile: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.get(`${API_URL}/investor-profile/${user.user.id}`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching investor profile:', error);
            throw error.response?.data || error.message;
        }
    },

    updateInvestorProfile: async (profileData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.put(`${API_URL}/investor-profile/${user.user.id}`, profileData, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating investor profile:', error);
            throw error.response?.data || error.message;
        }
    },

    getTrendingInvestments: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.get(`${API_URL}/investments/trending`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trending investments:', error);
            throw error.response?.data || error.message;
        }
    }
};

export default investorService; 