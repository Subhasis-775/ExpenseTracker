import { useContext } from "react"
import { DarkModeContext } from "../context/DarkModeContext.jsx"

const DarkModeToggle=()=>{
    const {darkMode,toggleDarkMode} =useContext(DarkModeContext);

    return(
        <button onClick={toggleDarkMode}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {darkMode?"Light Mode":"Dark Mode"}
        </button>
    );
};
export default DarkModeToggle;