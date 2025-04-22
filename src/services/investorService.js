import axios from 'axios';
import authService from './authService';
import { jwtDecode } from 'jwt-decode';

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

            // Use the investor profile endpoint
            const response = await axios.get(`${API_URL}/investor/profile/${investorId}`, {
                headers: { 
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const investorData = response.data;
            return {
                ...investorData,
                name: investorData.companyName || 
                      investorData.fullName || 
                      investorData.name || 
                      investorData.email ||
                      `Investor #${investorId}`
            };
        } catch (error) {
            console.error('Error fetching investor details:', error);
            // Return a minimal object instead of throwing
            return {
                id: investorId,
                name: `Investor #${investorId}`
            };
        }
    },

    getInvestorProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/investor/profile`, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Ensure investment range is properly formatted as numbers
            return {
                ...response.data,
                investmentRangeMin: Number(response.data.investmentRangeMin),
                investmentRangeMax: Number(response.data.investmentRangeMax)
            };
        } catch (error) {
            console.error('Error fetching investor profile:', error);
            throw error.response?.data || error.message;
        }
    },

    updateInvestorProfile: async (profileData) => {
        try {
            // Format investment range as numbers
            const formattedData = {
                ...profileData,
                investmentRangeMin: Number(profileData.investmentRangeMin),
                investmentRangeMax: Number(profileData.investmentRangeMax)
            };

            const response = await axios.put(`${API_URL}/investor/profile`, formattedData, {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Ensure investment range is properly formatted in the response
            return {
                ...response.data,
                investmentRangeMin: Number(response.data.investmentRangeMin),
                investmentRangeMax: Number(response.data.investmentRangeMax)
            };
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
    },

    getDashboardStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/investor/dashboard/stats`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSectorDistribution: async () => {
        try {
            const response = await axios.get(`${API_URL}/investor/dashboard/sector-distribution`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getRecentActivities: async () => {
        try {
            const response = await axios.get(`${API_URL}/investor/dashboard/activities`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPortfolio: async () => {
        try {
            const response = await axios.get(`${API_URL}/investor/portfolio`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getPortfolioPerformance: async () => {
        try {
            const response = await axios.get(`${API_URL}/investor/portfolio/performance`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getInvestmentDetails: async (investmentId) => {
        try {
            const response = await axios.get(`${API_URL}/investor/investments/${investmentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    invest: async (investmentData) => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            const response = await axios.post(`${API_URL}/investments`, investmentData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error making investment:', error);
            throw new Error(error.response?.data?.message || 'Failed to process investment');
        }
    },

    getMyInvestments: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user || !user.token) {
                throw new Error('No authenticated user found');
            }

            // Get the current user's ID from the token
            const decodedToken = jwtDecode(user.token);
            const userId = decodedToken.sub; // sub contains the user ID in JWT

            const response = await axios.get(`${API_URL}/transactions/investor/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching investments:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch investments');
        }
    }
};

export default investorService; 