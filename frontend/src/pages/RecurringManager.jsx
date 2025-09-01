// src/pages/RecurringManager.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecurring, deleteRecurring } from "../services/recurring.js";
import RecurringForm from "../components/RecurringForm.jsx";
import { Trash2, Zap, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f"];

const RecurringManager = () => {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const navigate = useNavigate();

  // Fetch recurring expenses
  const fetchRecurring = async () => {
    try {
      const res = await getRecurring();
      setRecurringExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch recurring expenses", err);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  // Delete recurring
  const handleDeleteRecurring = async (id) => {
    if (!window.confirm("Delete this recurring expense?")) return;
    try {
      await deleteRecurring(id);
      setRecurringExpenses((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting recurring expense", err);
    }
  };

  // 📊 Data prep for charts
  const monthlyData = recurringExpenses.map((r) => ({
    name: r.title,
    amount: r.amount,
  }));

  const categoryData = recurringExpenses.reduce((acc, r) => {
    const existing = acc.find((item) => item.name === r.category);
    if (existing) {
      existing.value += r.amount;
    } else {
      acc.push({ name: r.category || "Other", value: r.amount });
    }
    return acc;
  }, []);

  // 📌 Summary Stats
  const totalCost = recurringExpenses.reduce((sum, r) => sum + r.amount, 0);
  const upcomingCount = recurringExpenses.filter(
    (r) => new Date(r.nextDue) > new Date()
  ).length;
  const activeCount = recurringExpenses.length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Zap className="w-6 h-6 text-yellow-500" /> Recurring Manager
      </h1>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <p className="text-gray-500">Total Monthly Cost</p>
          <p className="text-2xl font-bold">₹{totalCost}</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <p className="text-gray-500">Upcoming Payments</p>
          <p className="text-2xl font-bold">{upcomingCount}</p>
        </div>
        <div className="bg-white shadow rounded-2xl p-6 text-center">
          <p className="text-gray-500">Active Subscriptions</p>
          <p className="text-2xl font-bold">{activeCount}</p>
        </div>
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Recurring by Item</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Recurring by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 Add Recurring Form */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <RecurringForm
          onAdded={(newRecurring) => {
            setRecurringExpenses((prev) => [newRecurring, ...prev]);
          }}
        />
      </div>

      {/* 🔹 Recurring Expenses List */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="font-semibold mb-4">All Recurring Expenses</h2>
        <ul className="divide-y divide-gray-200">
          {recurringExpenses.length > 0 ? (
            recurringExpenses.map((r) => {
              const dueDate = new Date(r.nextDue);
              const today = new Date();
              let status = "Active";
              if (dueDate < today) status = "Overdue";
              else if ((dueDate - today) / (1000 * 60 * 60 * 24) <= 7)
                status = "Due Soon";

              return (
                <li
                  key={r._id}
                  className="flex justify-between items-center py-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      ⚡ {r.title} - ₹{r.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      {r.category} | Every {r.frequency} | Next Due:{" "}
                      {dueDate.toLocaleDateString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        status === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : status === "Due Soon"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteRecurring(r._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })
          ) : (
            <p className="text-gray-500">No recurring expenses yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RecurringManager;
