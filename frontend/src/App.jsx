import { Navigate, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Signup } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Recurring from "./pages/Recurring.jsx"; // import recurring page

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

      {/* Auth routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/recurring" element={user ? <Recurring /> : <Navigate to="/login" />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
