import API from "./api.js";
export const register=(userdata)=>API.post('/auth/signup',userdata);
export const login=(userdata)=>API.post('/auth/login',userdata);
