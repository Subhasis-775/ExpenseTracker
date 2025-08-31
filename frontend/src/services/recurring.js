import API from "./api.js"

export const getRecurring=async()=>API.get('/recurring');
export const addRecurring=async(recurringData)=>API.post('/recurring',recurringData);
export const deleteRecurring=async(id)=>API.delete(`/recurring/${id}`);