import axios from 'axios';

const API_URL = "/api";

export const getPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getPatient = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/patients/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching patient with id ${id}:`, error);
    throw error;
  }
};

export const addOrUpdatePatient = async (patientData, id = null) => {
    console.log('Patient Data:', patientData);
    const payload = {
        ...patientData,
        id: parseInt(patientData.id, 10) // Ensure this is an integer
      };
    try {
      const response = id
        ? await axios.put(`${API_URL}/patients/${id}`, payload)
        : await axios.post(`${API_URL}/patients`, payload);
      console.log('addOrUpdatePatient response:', response.data, payload); // Log the response
      return response.data;
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'adding'} patient:`, error);
      throw error;
    }
  };
  

export const deletePatient = async (id) => {
  try {
    await axios.delete(`${API_URL}/patients/${id}`);
  } catch (error) {
    console.error(`Error deleting patient with id ${id}:`, error);
    throw error;
  }
};
