// src/pages/Profile.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, User, Mail, Calendar, Shield ,Settings} from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setError("User not found.");
    }
    setLoading(false);
  }, [user]);

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      toast.success("Account deleted (mock) ✅");
      logout();
      navigate("/login");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 py-10 transition-all duration-500">
      {/* Enhanced Back button */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-3 rounded-xl shadow-soft text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 group-hover:animate-bounce-subtle" />
        <span className="font-medium">Back</span>
      </button>

      <div className="max-w-6xl mx-auto space-y-8 mt-8">
        {/* Enhanced Profile header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-3xl p-8 flex flex-col md:flex-row md:justify-between items-center transition-all duration-300 animate-slide-up">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              My Profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Manage your personal information and account settings
            </p>
          </div>
          <div className="mt-6 md:mt-0 w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
            {user?.name
              ?.split(" ")
              .map((n) => n[0]?.toUpperCase())
              .join("")
              .slice(0, 2) || "U"}
          </div>
        </div>

        {/* Enhanced Profile info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProfileCard
            icon={<User size={24} />}
            title="Full Name"
            value={user?.name}
            color="primary"
          />
          <ProfileCard
            icon={<Mail size={24} />}
            title="Email"
            value={user?.email}
            color="success"
          />
          <ProfileCard
            icon={<Calendar size={24} />}
            title="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"
            }
            color="warning"
          />
          <ProfileCard
            icon={<Shield size={24} />}
            title="Account Type"
            value="Standard"
            color="danger"
          />
        </div>

        {/* Enhanced Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button className="group flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-glow hover:shadow-glow transition-all duration-200 hover:scale-105">
            <Settings className="w-5 h-5 group-hover:animate-bounce-subtle" />
            <span className="font-semibold">Edit Profile</span>
          </button>
          <button
            onClick={handleDeleteAccount}
            className="group flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white rounded-xl shadow-glow-danger hover:shadow-glow-danger transition-all duration-200 hover:scale-105"
          >
            <span className="text-lg group-hover:animate-bounce-subtle">🗑️</span>
            <span className="font-semibold">Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const ProfileCard = ({ icon, title, value, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-300",
    success: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-600 dark:text-green-300",
    warning: "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 text-yellow-600 dark:text-yellow-300",
    danger: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-600 dark:text-red-300"
  };

  return (
    <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-soft p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-medium hover:scale-105 animate-slide-up">
      <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${colorClasses[color]} shadow-soft group-hover:shadow-glow transition-all duration-200`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {value || "N/A"}
        </p>
      </div>
      <div className="w-2 h-8 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};
