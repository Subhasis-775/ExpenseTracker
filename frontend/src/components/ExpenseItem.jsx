import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { updateExpense, deleteExpense } from "../services/expenses.js";

const ExpenseItem = ({ expense, onUpdate, onDelete, index }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date.split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateExpense(expense._id, formData);
      setEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update expense", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    setDeleting(true);
    try {
      await deleteExpense(expense._id);
      onDelete();
    } catch (err) {
      console.error("Failed to delete expense", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr 
      className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/30 dark:hover:from-gray-800/50 dark:hover:to-gray-700/30 animate-slide-up"
      style={{animationDelay: `${index * 0.1}s`}}
    >
      {/* Title */}
      <td className="py-4 px-6 font-medium text-gray-800 dark:text-gray-200">
        {editing ? (
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{expense.title}</span>
          </div>
        )}
      </td>

      {/* Amount */}
      <td className="py-4 px-6 text-center">
        {editing ? (
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-soft text-center"
          />
        ) : (
          <div className="inline-flex items-center space-x-1 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg">
            <span className="text-green-600 dark:text-green-400 font-bold text-lg">₹</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">{expense.amount.toLocaleString()}</span>
          </div>
        )}
      </td>

      {/* Category */}
      <td className="py-4 px-6 text-center">
        {editing ? (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
          >
            <option value="Food">🍽️ Food</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Education">📚 Education</option>
            <option value="Bills">💳 Bills</option>
            <option value="Healthcare">🏥 Healthcare</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Utilities">⚡ Utilities</option>
            <option value="Other">📦 Other</option>
          </select>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 shadow-soft">
            {expense.category}
          </span>
        )}
      </td>

      {/* Date */}
      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-300">
        {editing ? (
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
          />
        ) : (
          <div className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
            <span className="text-sm">📅</span>
            <span className="text-sm font-medium">{new Date(expense.date).toLocaleDateString("en-IN")}</span>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-6">
        <div className="flex justify-center gap-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 shadow-glow-success hover:shadow-glow-success hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 shadow-soft hover:scale-105"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="group p-2 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 text-yellow-700 dark:text-yellow-300 hover:from-yellow-200 hover:to-yellow-300 dark:hover:from-yellow-800 dark:hover:to-yellow-700 transition-all duration-200 shadow-soft hover:shadow-glow hover:scale-110"
              >
                <Edit size={18} className="group-hover:animate-bounce-subtle" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="group p-2 rounded-lg bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-700 dark:text-red-300 hover:from-red-200 hover:to-red-300 dark:hover:from-red-800 dark:hover:to-red-700 transition-all duration-200 shadow-soft hover:shadow-glow-danger hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Trash2 size={18} className="group-hover:animate-bounce-subtle" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ExpenseItem;
