import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth.js";

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
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-purple-100 p-8 animate-fadeIn">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4 tracking-tight">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Login to continue to your dashboard
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center font-medium border border-red-200 shadow-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:underline hover:text-purple-700 transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
