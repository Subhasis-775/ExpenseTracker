import { useState, useEffect } from "react";
import API from "../services/api.js";
import { Trash2, Edit, Zap } from "lucide-react";

const RecurringExpensesPage = () => {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    frequency: "monthly",
    nextDue: "",
  });

  const fetchRecurring = async () => {
    try {
      const res = await API.get("/recurring");
      setRecurringExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch recurring expenses", err);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/recurring", formData);
      setRecurringExpenses((prev) => [res.data, ...prev]);
      setFormData({ title: "", amount: "", frequency: "monthly", nextDue: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding recurring expense", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recurring expense?")) return;
    try {
      await API.delete(`/recurring/${id}`);
      setRecurringExpenses((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting expense", err);
    }
  };

  const getStatus = (nextDue) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const dueDate = new Date(nextDue).setHours(0, 0, 0, 0);
    if (dueDate < today) return "Overdue";
    if (dueDate === today) return "Due Today";
    return "Upcoming";
  };

  const statusColor = (status) => {
    if (status === "Overdue") return "bg-red-100 text-red-600";
    if (status === "Due Today") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  // --- Summary Calculations ---
  const totalMonthly = recurringExpenses.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );
  const upcoming = recurringExpenses.length
    ? new Date(
        recurringExpenses.reduce((earliest, r) =>
          new Date(r.nextDue) < new Date(earliest.nextDue) ? r : earliest
        ).nextDue
      ).toLocaleDateString()
    : "No payments";

  const activeCount = recurringExpenses.length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Zap className="w-7 h-7 text-teal-500" /> Recurring Expenses
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-medium">Total Monthly Cost</h2>
          <p className="text-2xl font-bold mt-2">₹{totalMonthly}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-medium">Upcoming Payment</h2>
          <p className="text-2xl font-bold mt-2">{upcoming}</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-medium">Active Recurring</h2>
          <p className="text-2xl font-bold mt-2">{activeCount}</p>
        </div>
      </div>

      {/* Add Recurring Expense Button */}
      <div className="mb-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300"
          >
            + Add Recurring Expense
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-md space-y-4 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-800">
              New Recurring Expense
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="date"
                name="nextDue"
                value={formData.nextDue}
                onChange={handleChange}
                required
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recurring Expense Cards */}
      {recurringExpenses.length === 0 ? (
        <p className="text-gray-500 text-lg">No recurring expenses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recurringExpenses.map((r) => {
            const status = getStatus(r.nextDue);
            return (
              <div
                key={r._id}
                className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {r.title}
                  </h3>
                  <p className="text-gray-600 mb-1">₹ {r.amount}</p>
                  <p className="text-gray-500 mb-2">
                    Frequency:{" "}
                    <span className="capitalize font-medium">
                      {r.frequency}
                    </span>
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">
                    Next Due: {new Date(r.nextDue).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition duration-300"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-100 hover:bg-red-200 p-2 rounded-lg transition duration-300"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecurringExpensesPage;
