import axios from 'axios';

const API_URL = "/api";

export const getDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getDoctor = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    throw error;
  }
};

export const addOrUpdateDoctor = async (doctorData, id = null) => {
  console.log('Doctor Data:', doctorData);
  const payload = {
    ...doctorData,
    specializationID: parseInt(doctorData.specializationID, 10) // Ensure this is an integer
  };

  try {
    const response = id
      ? await axios.put(`${API_URL}/doctors/${id}`, payload)
      : await axios.post(`${API_URL}/doctors`, payload);
    console.log('addOrUpdateDoctor response:', response.data, payload); // Log the response
    return response.data;
  } catch (error) {
    console.error(`Error ${id ? 'updating' : 'adding'} doctor:`, error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    await axios.delete(`${API_URL}/doctors/${id}`);
  } catch (error) {
    console.error(`Error deleting doctor with id ${id}:`, error);
    throw error;
  }
};
