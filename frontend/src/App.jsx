import { Navigate, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Signup } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RecurringManager from "./pages/RecurringManager.jsx"; 
import Profile from "./pages/Profile.jsx"; // ✅ new import
import PaymentPage from "./pages/PaymentPage.jsx"; // ✅ payment page
import { Toaster } from "react-hot-toast"; // ✅ toaster

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Global toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/recurring"
          element={user ? <RecurringManager /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />} // ✅ added profile
        />
        <Route
          path="/payments"
          element={user ? <PaymentPage /> : <Navigate to="/login" />} // ✅ added payments
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
