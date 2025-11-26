import { Navigate, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Signup } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RecurringManager from "./pages/RecurringManager.jsx"; 
import Profile from "./pages/Profile.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import SplitBillsPage from "./pages/SplitBillsPage.jsx"; // ✅ Split Bills
import GroupDetailsPage from "./pages/GroupDetailsPage.jsx"; // ✅ Group Details
import SubscriptionPage from "./pages/SubscriptionPage.jsx";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Global toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Default route */}
        <Route path="/" element={<HomePage />} />

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
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/payments"
          element={user ? <PaymentPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/budgets"
          element={user ? <BudgetPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/groups"
          element={user ? <SplitBillsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/groups/:id"
          element={user ? <GroupDetailsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/subscription"
          element={user ? <SubscriptionPage /> : <Navigate to="/login" />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
