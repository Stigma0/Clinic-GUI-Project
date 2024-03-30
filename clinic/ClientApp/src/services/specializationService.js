import axios from 'axios';

const API_URL = "/api";

export const getSpecializations = async () => {
  try {
    const response = await axios.get(`${API_URL}/specializations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw error;
  }
};

// Add more specialization-related functions here if needed
