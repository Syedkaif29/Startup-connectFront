import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || 'Login failed';
        }
    },

    register: async (userData) => {
        try {
            console.log('Making registration request to:', `${API_URL}/register`);
            console.log('Registration data:', userData);
            
            const response = await axios.post(`${API_URL}/register`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
            
            if (error.response?.data) {
                throw error.response.data;
            } else if (error.message) {
                throw error.message;
            } else {
                throw 'Registration failed. Please try again.';
            }
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    getToken: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.token;
    }
};

export default authService; 