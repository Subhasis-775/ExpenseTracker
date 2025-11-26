import api from './api';

export const createGroup = async (data) => {
  try {
    const response = await api.post('/api/groups', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getGroups = async () => {
  try {
    const response = await api.get('/api/groups');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getGroupDetails = async (id) => {
  try {
    const response = await api.get(`/api/groups/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addGroupExpense = async (data) => {
  try {
    const response = await api.post('/api/groups/expense', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
