import API from "./api.js";

export const getRecurring = async () =>
  API.get('/api/recurring');

export const addRecurring = async (recurringData) =>
  API.post('/api/recurring', recurringData);

export const deleteRecurring = async (id) =>
  API.delete(`/api/recurring/${id}`);
