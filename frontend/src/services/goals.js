import API from "./api.js";

export const getGoals = () => {
  return API.get("/api/goals");
};

export const createGoal = (goalData) => {
  return API.post("/api/goals", goalData);
};

export const updateGoal = (id, goalData) => {
  return API.put(`/api/goals/${id}`, goalData);
};

export const deleteGoal = (id) => {
  return API.delete(`/api/goals/${id}`);
};
