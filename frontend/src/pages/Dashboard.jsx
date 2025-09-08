import { useState, useContext, useEffect } from "react";
import { addExpense, getExpenses } from "../services/expenses.js";
import { AuthContext } from "../context/AuthContext";
import ExpenseList from "../components/ExpenseList.jsx";
import ExpenseFilter from "../components/ExpenseFilter.jsx";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import MonthlyBarChart from "../components/charts/MonthlyBarChart.jsx";
import downloadReport from "../services/report.js";
import {
  Wallet,
  BarChart2,
  CreditCard,
  Zap,
  FileDown,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import AIChatBox from "../components/AIChatBox.jsx";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

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

  const [summary, setSummary] = useState({
    total: 0,
    monthly: 0,
    count: 0,
    recurring: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // AI Chat toggle
  const [showChat, setShowChat] = useState(false);

  // Report state
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Fetch expenses
  const fetchExpenses = async () => {
    setFetching(true);
    setError("");
    try {
      const res = await getExpenses(filters);
      const expenses = res.data.expenses || [];

      if (!expenses.length) {
        setError("⚠️ No expenses found for this filter");
      }

      setExpensesData({
        expenses,
        total: res.data.total,
        pages: res.data.pages,
      });

      // Summary
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

      // Charts
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
        const m = new Date(e.date).toLocaleString("default", { month: "short" });
        monthMap[m] = (monthMap[m] || 0) + Number(e.amount);
      });
      setMonthlyData(
        Object.entries(monthMap).map(([month, amount]) => ({ month, amount }))
      );
    } catch (err) {
      setError("❌ Failed to fetch expenses");
      console.error("Failed to fetch expenses", err);
    } finally {
      setFetching(false);
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
    setError("");
    try {
      await addExpense(formData);
      toast.success("✅ Expense added successfully!");
      setFormData({ title: "", amount: "", category: "", date: "", notes: "" });
      fetchExpenses();
    } catch (error) {
      setError(error.response?.data?.message || "Error adding expense");
      toast.error("❌ Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadReport(month, year);
      toast.success("✅ Report downloaded successfully!");
    } catch (err) {
      setError("❌ Failed to download report", err);
      toast.error("❌ Report download failed");
    }
  };

  return (
    <Layout>
      <div className="px-4 py-8 space-y-10 relative">
        {error && (
          <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex items-center gap-4">
            <Wallet className="w-10 h-10 text-blue-500" />
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">
                Total Expenses
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                ₹{summary.total}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex items-center gap-4">
            <BarChart2 className="w-10 h-10 text-green-500" />
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">
                This Month
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                ₹{summary.monthly}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex items-center gap-4">
            <CreditCard className="w-10 h-10 text-purple-500" />
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">
                Transactions
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {summary.count}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex items-center gap-4">
            <Zap className="w-10 h-10 text-yellow-500" />
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">
                Recurring
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {summary.recurring}
              </p>
            </div>
          </div>
        </div>

        {/* PDF Report */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
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
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownload}
            className="flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <FileDown className="w-5 h-5" />
            Download Report
          </button>
        </div>

        {/* Add Expense + Expense List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Add Expense Form */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
              Add New Expense
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Grocery Shopping"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
                required
              />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 500"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
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
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
                required
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes..."
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg p-2"
                rows="3"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Expense List + Filters */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 lg:col-span-2">
            <ExpenseFilter filters={filters} setFilters={setFilters} />

            {fetching ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ExpenseList
                expensesData={expensesData}
                filters={filters}
                setFilters={setFilters}
                fetchExpenses={fetchExpenses}
              />
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Expenses by Category
            </h2>
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Monthly Spending Trend
            </h2>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>

        {/* Floating AI Chat Icon */}
        <button
          onClick={() => setShowChat(true)}
          className="cursor-pointer fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* AI Chat Box */}
        {showChat && <AIChatBox onClose={() => setShowChat(false)} />}
      </div>
    </Layout>
  );
};

export default Dashboard;
