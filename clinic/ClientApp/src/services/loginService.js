import axios from 'axios';

const API_URL = "/api";

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/Users/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
