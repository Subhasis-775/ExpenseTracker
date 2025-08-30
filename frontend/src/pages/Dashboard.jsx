import { useState, useContext, useEffect } from "react";
import { addExpense, getExpenses } from "../services/expenses.js";
import { AuthContext } from "../context/AuthContext";
import ExpenseList from "../components/ExpenseList.jsx";
import ExpenseFilter from "../components/ExpenseFilter.jsx";
import { Menu, LogOut, User } from "lucide-react";

const Dashboard = () => {
  const { logoutUser, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Filters & pagination state
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    sort: "newest",
    limit: 10,
    page: 1,
  });

  const [expensesData, setExpensesData] = useState({
    expenses: [],
    total: 0,
    pages: 1,
  });

  // Fetch expenses based on filters
  const fetchExpenses = async () => {
    try {
      const res = await getExpenses(filters);
      setExpensesData({
        expenses: res.data.expenses,
        total: res.data.total,
        pages: res.data.pages,
      });
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense(formData);
      setMessage("✅ Expense added successfully!");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: "",
        notes: "",
      });
      fetchExpenses(); // refresh list dynamically
    } catch (error) {
      setMessage(
        `❌ ${error.response?.data?.message || "Error adding expense"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-xl font-bold text-gray-800">💰 Expense Tracker</h1>

        <div className="flex items-center gap-4">
          {/* Avatar Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block font-medium text-gray-700">
                  {user.name}
                </span>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border p-2 z-10">
                  <button
                    className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <User className="w-4 h-4 mr-2" /> Profile
                  </button>
                  <button
                    onClick={logoutUser}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Add Expense Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Add New Expense
            </h2>

            {message && (
              <p
                className={`mb-4 text-center font-medium ${
                  message.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Grocery Shopping"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">-- Select Category --</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Bills">Bills</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes about this expense..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Expense List + Filters */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <ExpenseFilter filters={filters} setFilters={setFilters} />
            <ExpenseList
              expensesData={expensesData}
              filters={filters}
              setFilters={setFilters}
              fetchExpenses={fetchExpenses}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
