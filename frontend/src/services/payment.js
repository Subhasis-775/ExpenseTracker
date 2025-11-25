import api from './api';

// Create Razorpay Order
export const createOrder = async (amount, description, category) => {
  try {
    const response = await api.post('/api/payments/create-order', {
      amount,
      description,
      category,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Verify Payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/api/payments/verify', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Payment History
export const getPaymentHistory = async (filters = {}) => {
  try {
    const response = await api.get('/api/payments/history', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Payment Details
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
