import api from './api';

export const getBudgets = async (month, year) => {
  try {
    const response = await api.get(`/api/budgets?month=${month}&year=${year}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const setBudget = async (budgetData) => {
  try {
    const response = await api.post('/api/budgets', budgetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`/api/budgets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
