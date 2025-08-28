import {  useState } from "react"
import { AuthContext } from "./AuthContext";

export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem('token')||"");
    const [user,setUser]=useState(()=>{
        try{
            const storedUser=localStorage.getItem("user");
            return storedUser?JSON.parse(storedUser):null;
        }
        catch(error){
            console.error('failed to parse from localhost',error);
            localStorage.removeItem("user");
            return null;
        }
    })
    const loginUser=(data)=>{
        localStorage.setItem("token",data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    }
    const logoutUser=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
    }
    return(
        <AuthContext.Provider value={{token,user,loginUser,logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}