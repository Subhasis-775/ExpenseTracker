import API from "./api.js";
export const register = (userdata) => API.post('/api/auth/signup', userdata);
export const login = (userdata) => API.post('/api/auth/login', userdata);
