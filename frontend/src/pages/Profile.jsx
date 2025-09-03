// src/pages/Profile.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, User, Mail, Calendar, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, logout } = useContext(AuthContext); // Add logout to handle account deletion
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
    // Call backend API to delete user
    if (window.confirm("Are you sure you want to delete your account?")) {
      toast.success("Account deleted (mock) ✅");
      logout(); // clear auth context
      navigate("/login");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="max-w-5xl mx-auto space-y-8 mt-6">
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col md:flex-row md:justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">My Profile</h2>
            <p className="text-gray-500 mt-1">Manage your personal information and account settings</p>
          </div>
          <div className="mt-6 md:mt-0 w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.split(" ").map(n => n[0]?.toUpperCase()).join("").slice(0,2) || "U"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard icon={<User size={22} />} title="Full Name" value={user?.name} />
          <ProfileCard icon={<Mail size={22} />} title="Email" value={user?.email} />
          <ProfileCard icon={<Calendar size={22} />} title="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"} />
          <ProfileCard icon={<Shield size={22} />} title="Account Type" value="Standard" />
        </div>

        <div className="flex justify-end gap-4">
          <button className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600">Edit Profile</button>
          <button onClick={handleDeleteAccount} className="px-5 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

const ProfileCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);
