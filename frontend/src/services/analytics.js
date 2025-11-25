import api from './api';

// Get weekly spending trends
export const getWeeklyTrends = async () => {
  try {
    const response = await api.get('/api/analytics/weekly');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get category comparison
export const getCategoryComparison = async () => {
  try {
    const response = await api.get('/api/analytics/category-comparison');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get monthly comparison
export const getMonthlyComparison = async () => {
  try {
    const response = await api.get('/api/analytics/monthly-comparison');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
