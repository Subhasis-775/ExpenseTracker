import { useState, useContext, useEffect } from "react";
import { addExpense, getExpenses } from "../services/expenses.js";
import { AuthContext } from "../context/AuthContext";
import ExpenseList from "../components/ExpenseList.jsx";
import ExpenseFilter from "../components/ExpenseFilter.jsx";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import MonthlyBarChart from "../components/charts/MonthlyBarChart.jsx";
import WeeklyLineChart from "../components/charts/WeeklyLineChart.jsx";
import CategoryStackedBarChart from "../components/charts/CategoryStackedBarChart.jsx";
import UpcomingExpenses from "../components/UpcomingExpenses.jsx";
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
import { Link } from "react-router-dom";

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
      <div className="space-y-8 relative animate-fade-in">
        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-danger-50 to-danger-100 dark:from-danger-900/20 dark:to-danger-800/20 border border-danger-200 dark:border-danger-700 text-danger-700 dark:text-danger-300 p-4 rounded-xl text-center font-medium shadow-soft animate-slide-down">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-danger-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 hover:shadow-medium transition-all duration-300 hover:scale-105 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-glow">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Expenses
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ₹{summary.total.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 hover:shadow-medium transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-glow-success">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    This Month
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ₹{summary.monthly.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 hover:shadow-medium transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-glow">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transactions
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {summary.count}
                  </p>
                </div>
              </div>
              <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 hover:shadow-medium transition-all duration-300 hover:scale-105 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recurring
                  </h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {summary.recurring}
                  </p>
                </div>
              </div>
              <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>

        {/* Make Payment Button */}
        <Link to="/payments" className="block">
          <div className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-glow hover:shadow-glow-success rounded-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Make a Payment
                  </h3>
                  <p className="text-white/90 text-sm">
                    Quick and secure bill payments
                  </p>
                </div>
              </div>
              <div className="text-white text-2xl group-hover:animate-bounce-subtle">
                →
              </div>
            </div>
          </div>
        </Link>

        {/* Enhanced PDF Report */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Generate Report</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download your expense summary</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center space-x-3">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                >
                  {[
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                  ].map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                >
                  {[2023, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleDownload}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-glow hover:shadow-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <FileDown className="w-5 h-5 group-hover:animate-bounce-subtle" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Add Expense + Expense List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Add Expense Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-8 animate-slide-up">
            
            {/* Upcoming Expenses Widget */}
            <UpcomingExpenses />

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-glow">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Add New Expense
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Track your spending easily</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expense Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Grocery Shopping"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                  required
                >
                  <option value="">-- Select Category --</option>
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
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft resize-none"
                  rows="3"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-glow hover:shadow-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Expense"
                )}
              </button>
            </form>
          </div>

          {/* Enhanced Expense List + Filters */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-8 lg:col-span-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-glow-success">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Recent Expenses</h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {expensesData.total} total transactions
                </div>
              </div>
              <ExpenseFilter filters={filters} setFilters={setFilters} />
            </div>

            {fetching ? (
              <div className="flex justify-center items-center h-40">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Loading expenses...</p>
                </div>
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

        {/* Enhanced Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-glow">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Expenses by Category
              </h2>
            </div>
            <CategoryPieChart data={categoryData} />
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Monthly Spending Trend
              </h2>
            </div>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 animate-fade-in">
            <WeeklyLineChart />
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-6 animate-fade-in">
            <CategoryStackedBarChart />
          </div>
        </div>

        {/* Enhanced Floating AI Chat Icon */}
        <button
          onClick={() => setShowChat(true)}
          className="group fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-2xl shadow-glow hover:shadow-glow transition-all duration-300 hover:scale-110 animate-bounce-subtle"
        >
          <MessageSquare className="w-6 h-6 group-hover:animate-bounce-subtle" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-success-500 rounded-full animate-pulse"></div>
        </button>

        {/* AI Chat Box */}
        {showChat && <AIChatBox onClose={() => setShowChat(false)} />}
      </div>
    </Layout>
  );
};

export default Dashboard;
