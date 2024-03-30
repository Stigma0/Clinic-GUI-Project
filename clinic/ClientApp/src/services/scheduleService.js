import axios from 'axios';

const API_URL = "/api";

// Schedule CRUD Operations
export const getSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/schedules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

export const getSpecializations = async () => {
  try {
    const response = await axios.get(`${API_URL}/specializations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

export const getSchedule = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching schedule with id ${id}:`, error);
    throw error;
  }
};

export const addOrUpdateSchedule = async (scheduleData, id = null) => {
  const payload = {
    ...scheduleData,
    // Add any necessary data transformations here if needed
  };

  try {
    const response = id
      ? await axios.put(`${API_URL}/schedules/${id}`, payload)
      : await axios.post(`${API_URL}/schedules`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error ${id ? 'updating' : 'adding'} schedule:`, error);
    throw error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    await axios.delete(`${API_URL}/schedules/${id}`);
  } catch (error) {
    console.error(`Error deleting schedule with id ${id}:`, error);
    throw error;
  }
};

// VisitSlot Operations
export const getVisitSlots = async () => {
  try {
    const response = await axios.get(`${API_URL}/visitslots`);
    return response.data;
  } catch (error) {
    console.error('Error fetching visit slots:', error);
    throw error;
  }
};

export const updateVisitSlot = async (visitSlotData) => {
  const payload = {
    isBooked: visitSlotData.isBooked,
    description: visitSlotData.description,
  };

  try {
    const response = await axios.put(`${API_URL}/visitslots/${visitSlotData.id}`, payload);
    console.log('addOrUpdateSchedule response:', response.data, payload); // Log the response
    return response.data;
  } catch (error) {
    console.error(`Error updating visit slot:`, error);
    throw error;
  }
};
export const getVisitSlotsBySchedule = async (scheduleId) => {
  try {
    const response = await axios.get(`${API_URL}/visitslots/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching visit slots for schedule ${scheduleId}:`, error);
    throw error;
  }
};

