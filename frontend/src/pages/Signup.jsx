import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth.js";
import toast from "react-hot-toast";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await register({ name, email, password });
      if (res && (res.status === 200 || res.status === 201)) {
        loginUser({ token: res.data.token, user: res.data.user });

        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg);
      toast.error("Signup failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl grid md:grid-cols-2 overflow-hidden">
        {/* Left side (branding / info) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-50 p-8">
          <h2 className="text-3xl font-bold text-blue-700">🚀 Join Expense Tracker</h2>
          <p className="text-gray-600 mt-4 text-center">
            Start managing your money smarter today. Track, analyze, and save!
          </p>
        </div>

        {/* Right side (form) */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Create an Account
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Sign up and get started in just a few seconds
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 shadow-md transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
