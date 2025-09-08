import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { updateExpense, deleteExpense } from "../services/expenses.js";

const ExpenseItem = ({ expense, onUpdate, onDelete }) => {
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
    <tr className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
      {/* Title */}
      <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
        {editing ? (
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400
              border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        ) : (
          expense.title
        )}
      </td>

      {/* Amount */}
      <td className="py-3 px-4 text-center text-green-600 dark:text-green-400 font-semibold">
        {editing ? (
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-green-400
              border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        ) : (
          `₹${expense.amount}`
        )}
      </td>

      {/* Category */}
      <td className="py-3 px-4 text-center">
        {editing ? (
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-indigo-400
              border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        ) : (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {expense.category}
          </span>
        )}
      </td>

      {/* Date */}
      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
        {editing ? (
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-indigo-400
              border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        ) : (
          new Date(expense.date).toLocaleDateString("en-IN")
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 flex justify-center gap-2">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 
                dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800 transition"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 
                dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ExpenseItem;
