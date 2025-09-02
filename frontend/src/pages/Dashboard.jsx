import { useState, useContext, useEffect } from "react";
import { addExpense, getExpenses } from "../services/expenses.js";
import { AuthContext } from "../context/AuthContext";
import ExpenseList from "../components/ExpenseList.jsx";
import ExpenseFilter from "../components/ExpenseFilter.jsx";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import MonthlyBarChart from "../components/charts/MonthlyBarChart.jsx";
import downloadReport  from "../services/report.js";
import {
  LogOut,
  User,
  Zap,
  CreditCard,
  BarChart2,
  Wallet,
  Repeat,
  FileDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // Summary state
  const [summary, setSummary] = useState({
    total: 0,
    monthly: 0,
    count: 0,
    recurring: 0,
  });

  // Chart data
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Report state
  const [month, setMonth] = useState(new Date().getMonth() + 1); // default: current month (1-12)
  const [year, setYear] = useState(new Date().getFullYear());

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await getExpenses(filters);
      const expenses = res.data.expenses || [];

      setExpensesData({
        expenses,
        total: res.data.total,
        pages: res.data.pages,
      });

      // ✅ Prepare summary
      const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const monthNow = new Date().getMonth();
      const monthly = expenses
        .filter((e) => new Date(e.date).getMonth() === monthNow)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const recurring = expenses.filter((e) => e.isRecurring).length;

      setSummary({
        total,
        monthly,
        count: expenses.length,
        recurring,
      });

      // ✅ Prepare chart data
      const categoryMap = {};
      expenses.forEach((e) => {
        categoryMap[e.category] =
          (categoryMap[e.category] || 0) + Number(e.amount);
      });
      setCategoryData(
        Object.entries(categoryMap).map(([category, amount]) => ({
          category,
          amount,
        }))
      );

      const monthMap = {};
      expenses.forEach((e) => {
        const m = new Date(e.date).toLocaleString("default", {
          month: "short",
        });
        monthMap[m] = (monthMap[m] || 0) + Number(e.amount);
      });
      setMonthlyData(
        Object.entries(monthMap).map(([month, amount]) => ({
          month,
          amount,
        }))
      );
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
      setTimeout(() => setMessage(""), 2000);
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: "",
        notes: "",
      });
      fetchExpenses();
    } catch (error) {
      setMessage(
        `❌ ${error.response?.data?.message || "Error adding expense"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadReport(month, year);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-xl font-bold text-gray-800">💰 Expense Tracker</h1>

        <div className="flex items-center gap-4">
          {/* ✅ New Recurring Manager Button */}
          <button
            onClick={() => navigate("/recurring")}
            className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg font-medium transition"
          >
            <Repeat className="w-4 h-4" />
            Recurring Manager
          </button>

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

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border p-2 z-10">
                  <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
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

      {/* Main Content */}
      <main className="px-4 py-10 max-w-7xl mx-auto space-y-10">
        {/* ✅ Row 0: Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4">
            <Wallet className="w-10 h-10 text-blue-500" />
            <div>
              <h3 className="text-sm text-gray-500">Total Expenses</h3>
              <p className="text-2xl font-bold">₹{summary.total}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4">
            <BarChart2 className="w-10 h-10 text-green-500" />
            <div>
              <h3 className="text-sm text-gray-500">This Month</h3>
              <p className="text-2xl font-bold">₹{summary.monthly}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4">
            <CreditCard className="w-10 h-10 text-purple-500" />
            <div>
              <h3 className="text-sm text-gray-500">Transactions</h3>
              <p className="text-2xl font-bold">{summary.count}</p>
            </div>
          </div>
          {/* ✅ Recurring card navigates to RecurringManager */}
          <button
            onClick={() => navigate("/recurring")}
            className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:bg-yellow-50 transition"
          >
            <Zap className="w-10 h-10 text-yellow-500" />
            <div className="text-left">
              <h3 className="text-sm text-gray-500">Recurring</h3>
              {/* <p className="text-2xl font-bold">{summary.recurring}</p> */}
            </div>
          </button>
        </div>

        {/* ✅ Row 0.5: PDF Report Download */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2"
          >
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2"
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownload}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <FileDown className="w-5 h-5" />
            Download Report
          </button>
        </div>

        {/* Row 1: Add Expense + Expense List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Add Expense Form */}
          <div className="bg-white shadow rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Add New Expense
            </h2>

            {message && (
              <p
                className={`mb-4 text-center font-medium ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Grocery Shopping"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 500"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
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
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes about this expense..."
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="3"
              />
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
          <div className="bg-white shadow rounded-2xl p-8 lg:col-span-2">
            <ExpenseFilter filters={filters} setFilters={setFilters} />
            <ExpenseList
              expensesData={expensesData}
              filters={filters}
              setFilters={setFilters}
              fetchExpenses={fetchExpenses}
            />
          </div>
        </div>

        {/* Row 2: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Expenses by Category</h2>
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Monthly Spending Trend</h2>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
