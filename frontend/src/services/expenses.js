import API from "./api.js";

export const addExpense=(expenseData)=>API.post('/expenses',expenseData);
export const getExpenses=(queryParams={})=>{
    const queryString=new  URLSearchParams(queryParams).toString();
  return API.get(`/expenses?${queryString}`);
}
export const updateExpense=(id,expenseData)=>API.put(`/expenses/${id}`,expenseData);
export const deleteExpense=(id)=>API.delete(`/expenses/${id}`);
