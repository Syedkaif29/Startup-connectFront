import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const startupService = {
    getAllStartups: async () => {
        try {
            const user = authService.getCurrentUser();
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (user?.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }
            
            const response = await axios.get(`${API_URL}/startups`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching startups:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch startups');
        }
    },

    getStartupById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/startups/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching startup:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch startup');
        }
    },

    getStartupProfile: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            const response = await axios.get(`${API_URL}/startups/profile`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching startup profile:', error);
            if (error.response?.status === 403) {
                throw new Error('You must be logged in to access this page');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch startup profile');
        }
    },

    updateStartupProfile: async (profileData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            const response = await axios.put(`${API_URL}/startups/profile`, profileData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating startup profile:', error);
            throw new Error(error.response?.data?.message || 'Failed to update startup profile');
        }
    },

    getPitchDecks: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            
            const startupProfile = await startupService.getStartupProfile();
            if (!startupProfile || !startupProfile.id) {
                throw new Error('Startup profile not found');
            }
            
            const response = await axios.get(`${API_URL}/pitchdecks/startup/${startupProfile.id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching pitch decks:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch pitch decks');
        }
    },

    uploadPitchDeck: async (file, title, description) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }
            
            const startupProfile = await startupService.getStartupProfile();
            if (!startupProfile || !startupProfile.id) {
                throw new Error('Startup profile not found');
            }
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('description', description || '');
            formData.append('isPublic', false);
            
            const response = await axios.post(
                `${API_URL}/pitchdecks/upload/${startupProfile.id}`,
                formData,
                {
                    headers: { 
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Error uploading pitch deck:', error);
            throw new Error(error.response?.data?.message || 'Failed to upload pitch deck');
        }
    },

    updatePitchDeck: async (deckId, updateData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            const response = await axios.put(
                `${API_URL}/pitchdecks/${deckId}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating pitch deck:', error);
            throw new Error(error.response?.data?.message || 'Failed to update pitch deck');
        }
    },

    deletePitchDeck: async (deckId) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            await axios.delete(`${API_URL}/pitchdecks/${deckId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        } catch (error) {
            console.error('Error deleting pitch deck:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete pitch deck');
        }
    },

    getInvestmentOffers: async (startupId) => {
        try {
            const user = authService.getCurrentUser();
            const response = await axios.get(`${API_URL}/startups/${startupId}/investment-offers`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching investment offers:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch investment offers');
        }
    },

    getMyInvestmentOffers: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            const startupProfile = await startupService.getStartupProfile();
            if (!startupProfile || !startupProfile.id) {
                throw new Error('Startup profile not found');
            }

            const response = await axios.get(`${API_URL}/startups/${startupProfile.id}/offers`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching my investment offers:', error);
            if (error.response?.status === 403) {
                throw new Error('You must be logged in as a startup to access investment offers');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch investment offers');
        }
    },

    createInvestmentOffer: async (offerData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            const startupProfile = await startupService.getStartupProfile();
            if (!startupProfile || !startupProfile.id) {
                throw new Error('Startup profile not found');
            }

            const response = await axios.post(`${API_URL}/startups/${startupProfile.id}/offers`, offerData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating investment offer:', error);
            console.error('Error response:', error.response);
            
            if (error.response?.data) {
                throw new Error(error.response.data);
            }
            throw new Error('Failed to create investment offer');
        }
    },

    updateInvestmentOffer: async (offerId, offerData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            // First get the startup profile to get the startupId
            const startupProfile = await startupService.getStartupProfile();
            if (!startupProfile || !startupProfile.id) {
                throw new Error('Startup profile not found');
            }

            const response = await axios.put(`${API_URL}/startups/${startupProfile.id}/offers/${offerId}`, offerData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating investment offer:', error);
            if (error.response?.status === 403) {
                throw new Error('You must be logged in as a startup to update investment offers');
            }
            throw new Error(error.response?.data?.message || 'Failed to update investment offer');
        }
    },

    deleteInvestmentOffer: async (offerId) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            // First get the startup profile to get the startupId
            const startupProfile = await startupService.getStartupProfile();
            if (!startupProfile || !startupProfile.id) {
                throw new Error('Startup profile not found');
            }

            const response = await axios.delete(`${API_URL}/startups/${startupProfile.id}/offers/${offerId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting investment offer:', error);
            if (error.response?.status === 403) {
                throw new Error('You must be logged in as a startup to delete investment offers');
            }
            throw new Error(error.response?.data?.message || 'Failed to delete investment offer');
        }
    }
};

export default startupService; 