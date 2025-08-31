import { useState } from "react";
import API from "../services/api.js";
import { Plus, X } from "lucide-react";

const RecurringForm = ({ onAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    frequency: "monthly",
    nextDue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/recurring", formData);
      if (onAdded) onAdded(res.data);

      setFormData({ title: "", amount: "", frequency: "monthly", nextDue: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding recurring expense", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-3xl p-6 transition-all duration-500">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-2xl shadow-lg text-lg transition-transform transform hover:scale-105"
        >
          <Plus className="w-5 h-5" /> Add Recurring Expense
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-800">New Recurring Expense</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Expense Title"
              required
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
            />
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
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
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none transition"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-2xl transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RecurringForm;
