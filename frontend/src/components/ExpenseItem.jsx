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
      onUpdate(); // refresh parent list
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
      onDelete(); // refresh parent list
    } catch (err) {
      console.error("Failed to delete expense", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="transition hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-800">
        {editing ? (
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-1 rounded-lg w-full"
          />
        ) : (
          expense.title
        )}
      </td>
      <td className="py-3 px-4 text-center text-green-600 font-semibold">
        {editing ? (
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-1 rounded-lg w-full"
          />
        ) : (
          `₹${expense.amount}`
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {editing ? (
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-1 rounded-lg w-full"
          />
        ) : (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {expense.category}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-center text-gray-600">
        {editing ? (
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-1 rounded-lg w-full"
          />
        ) : (
          new Date(expense.date).toLocaleDateString("en-IN")
        )}
      </td>
      <td className="py-3 px-4 flex justify-center gap-3">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
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
