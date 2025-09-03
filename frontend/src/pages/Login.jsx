import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth.js";
import toast from "react-hot-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password });
      loginUser({ token: res.data.token, user: res.data.user });

      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
      toast.error("Login failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl grid md:grid-cols-2 overflow-hidden">
        {/* Left side (branding / info) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-50 p-8">
          <h2 className="text-3xl font-bold text-blue-700">💰 Expense Tracker</h2>
          <p className="text-gray-600 mt-4 text-center">
            Manage your daily spending, track recurring expenses, and generate reports with ease.
          </p>
        </div>

        {/* Right side (form) */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Login to continue to your dashboard
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center font-medium shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 shadow-md transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
