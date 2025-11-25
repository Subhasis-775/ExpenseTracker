import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext.jsx";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="relative group p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 
                 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700
                 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95
                 border-2 border-gray-300 dark:border-gray-600"
      aria-label="Toggle dark mode"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-500 transform
            ${darkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
          strokeWidth={2.5}
        />
        
        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-500 transform
            ${darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
          strokeWidth={2.5}
        />
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-blue-500 dark:to-purple-500 
                      opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"></div>
    </button>
  );
};

export default DarkModeToggle;