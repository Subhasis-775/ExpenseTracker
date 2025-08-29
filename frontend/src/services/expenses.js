import API from "./api.js";

export const addExpense=(expenseData)=>API.post('/expenses',expenseData);
export const getExpenses=()=>API.get('/expenses');
export const updateExpense=(id,expenseData)=>API.put(`/expenses/${id}`,expenseData);
export const deleteExpense=(id)=>API.delete(`/expenses/${id}`);
