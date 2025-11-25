// src/components/Layout.jsx
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  Home, 
  Repeat, 
  User,
  Settings,
  ChevronDown,
  CreditCard
} from "lucide-react";

import NotificationBell from "./NotificationBell.jsx";

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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-soft p-6 transform transition-all duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Enhanced Branding */}
        <div className="flex items-center space-x-3 mb-10 animate-fade-in">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl shadow-glow">
            ₹
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-800 dark:text-gray-100">
              Expense <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">Tracker</span>
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Smart Finance Management</p>
          </div>
        </div>

        {/* Enhanced Nav links */}
        <nav className="space-y-3 animate-slide-up">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow transform scale-105"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:transform hover:scale-105"
              }`
            }
          >
            <Home size={20} className={`${sidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200`} />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <NavLink
            to="/recurring"
            className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow transform scale-105"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:transform hover:scale-105"
              }`
            }
          >
            <Repeat size={20} className={`${sidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200`} />
            <span className="font-medium">Recurring Manager</span>
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow transform scale-105"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:transform hover:scale-105"
              }`
            }
          >
            <CreditCard size={20} className={`${sidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200`} />
            <span className="font-medium">Payments</span>
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
        {/* Enhanced Header */}
        <header className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-soft z-20 flex items-center justify-between px-6 py-4">
          {/* Sidebar toggle on mobile */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Expense Tracker
            </h1>
            <div className="hidden sm:block w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 font-medium">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </p>
          </div>

          {/* Enhanced Right Section: Dark mode + Avatar */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="group p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 shadow-soft transition-all duration-200 hover:shadow-glow"
            >
              {darkMode ? <Sun size={20} className="group-hover:animate-bounce-subtle" /> : <Moon size={20} className="group-hover:animate-bounce-subtle" />}
            </button>

            {/* Enhanced Avatar with dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="group flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-glow hover:shadow-glow transition-all duration-200 hover:scale-105"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
                  {getInitials(user?.name || user?.email || "U")}
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 animate-scale-in overflow-hidden ring-1 ring-black/5">
                  {/* User Info Header */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="p-2">
                    {/* Profile button */}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="p-2 mr-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                        <User size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      Profile Settings
                    </button>

                    {/* Logout button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group mt-1"
                    >
                      <div className="p-2 mr-3 bg-red-50 dark:bg-red-900/30 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                        <LogOut size={18} className="text-red-600 dark:text-red-400" />
                      </div>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Enhanced Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 lg:p-10 animate-fade-in">
          <div className="min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
