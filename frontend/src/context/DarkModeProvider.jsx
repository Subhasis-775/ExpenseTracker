import {  useEffect, useState } from "react";
import { DarkModeContext } from "./DarkModeContext";
export const DarkModeProvider=({children})=>{
    const [darkMode,setDarkMode]=useState(false);

    useEffect(()=>{
        const savedMode=localStorage.getItem("darkMode");
        if(savedMode==="true") setDarkMode(true);
        else setDarkMode(false);
    },[]);

    useEffect(()=>{
        if(darkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");

        localStorage.setItem("darkMode",darkMode);
    },[darkMode]);

    const toggleDarkMode=()=>setDarkMode(prev=>!prev);

    return(
        <DarkModeContext.Provider value={{darkMode,toggleDarkMode}}>
            {children}
        </DarkModeContext.Provider>
    )
}