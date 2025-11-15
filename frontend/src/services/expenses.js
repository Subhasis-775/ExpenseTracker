import API from "./api.js";

export const addExpense = (expenseData) =>
  API.post('/api/expenses', expenseData);

export const getExpenses = (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return API.get(`/api/expenses?${queryString}`);
};

export const updateExpense = (id, expenseData) =>
  API.put(`/api/expenses/${id}`, expenseData);

export const deleteExpense = (id) =>
  API.delete(`/api/expenses/${id}`);
