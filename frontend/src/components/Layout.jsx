// src/components/Layout.jsx
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext"; // ✅ Import Dark Mode Context
import { Menu, X, LogOut, Sun, Moon } from "lucide-react"; // ✅ Icons

export default function Layout({ children }) {
  const { user, logoutUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); // ✅ Dark mode state
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // ✅ Avatar initials
  const getInitials = (name = "User") =>
    name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md p-4 transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* ✅ Branding */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl shadow">
            ₹
          </div>
          <span className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
            Expense <span className="text-blue-600">Tracker</span>
          </span>
        </div>

        {/* ✅ Nav links */}
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/recurring"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            Recurring Manager
          </NavLink>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-20 flex items-center justify-between px-4 py-3">
          {/* Sidebar toggle on mobile */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Expense Tracker
          </h1>

          {/* ✅ Right Section: Dark mode + Avatar */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Avatar with dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white font-semibold shadow"
              >
                {getInitials(user?.name || user?.email || "U")}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-md z-50">
                  {/* Profile button */}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    👤 Profile
                  </button>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ✅ Centered Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
