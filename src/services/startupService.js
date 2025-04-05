import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api';

const startupService = {
    getAllStartups: async () => {
        try {
            const user = authService.getCurrentUser();
            let headers = {
                'Content-Type': 'application/json'
            };
            
            // Add authorization header only if user is authenticated
            if (user && user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }
            
            const response = await axios.get(`${API_URL}/startups`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching startups:', error);
            throw error.response?.data || error.message;
        }
    },

    getStartupById: async (startupId) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.get(`${API_URL}/startups/${startupId}`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching startup details:', error);
            throw error.response?.data || error.message;
        }
    },

    getStartupProfile: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.get(`${API_URL}/startup-profile/${user.user.id}`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching startup profile:', error);
            throw error.response?.data || error.message;
        }
    },

    updateStartupProfile: async (profileData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            const response = await axios.put(`${API_URL}/startup-profile/${user.user.id}`, profileData, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating startup profile:', error);
            throw error.response?.data || error.message;
        }
    },

    getPitchDecks: async () => {
        try {
            const user = authService.getCurrentUser();
            const response = await axios.get(`${API_URL}/pitch-decks/startup/${user.user.id}`, {
                headers: { Authorization: `Bearer ${authService.getToken()}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    uploadPitchDeck: async (file, title, description) => {
        try {
            const user = authService.getCurrentUser();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('startupProfileId', user.user.id);

            const response = await axios.post(`${API_URL}/pitch-decks/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authService.getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default startupService; 