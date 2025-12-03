import { useState, useContext, useEffect } from "react";
import { addExpense, getExpenses, categorizeExpense } from "../services/expenses.js";
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
  HelpCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import AIChatBox from "../components/AIChatBox.jsx";
import { Link } from "react-router-dom";
import ReceiptScanner from "../components/ReceiptScanner.jsx";
import BudgetAlerts from "../components/BudgetAlerts.jsx";

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
  const [aiLoading, setAiLoading] = useState(false);

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

  const handleTitleBlur = async () => {
    if (!formData.title || formData.category) return; // Don't run if empty or category already set

    setAiLoading(true);
    try {
      const res = await categorizeExpense({ title: formData.title });
      if (res.data && res.data.category && res.data.category !== 'Other') {
        setFormData(prev => ({ ...prev, category: res.data.category }));
        toast.success(`🤖 AI suggested: ${res.data.category}`, {
            icon: '✨',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
      }
    } catch (error) {
      console.error("Auto-categorization failed", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleScanComplete = (data) => {
    setFormData(prev => ({
      ...prev,
      title: data.title || prev.title,
      amount: data.amount || prev.amount,
      date: data.date || prev.date
    }));
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
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-xl text-center font-medium shadow-soft animate-slide-down">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <SummaryCard 
            title="Total Expenses" 
            value={`₹${summary.total.toLocaleString()}`} 
            icon={<Wallet className="w-6 h-6 text-white" />}
            gradient="from-blue-500 to-blue-600"
            delay="0s"
          />
          <SummaryCard 
            title="This Month" 
            value={`₹${summary.monthly.toLocaleString()}`} 
            icon={<BarChart2 className="w-6 h-6 text-white" />}
            gradient="from-green-500 to-green-600"
            delay="0.1s"
          />
          <SummaryCard 
            title="Transactions" 
            value={summary.count} 
            icon={<CreditCard className="w-6 h-6 text-white" />}
            gradient="from-purple-500 to-purple-600"
            delay="0.2s"
          />
          <SummaryCard 
            title="Recurring" 
            value={summary.recurring} 
            icon={<Zap className="w-6 h-6 text-white" />}
            gradient="from-yellow-500 to-yellow-600"
            delay="0.3s"
          />
        </div>

        {/* Enhanced This Month Summary Card */}
        <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl animate-slide-up bg-gradient-to-br from-white/90 to-blue-50/50 dark:from-gray-800/90 dark:to-gray-800/50 border-2 border-blue-200/50 dark:border-blue-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <BarChart2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">This Month Summary</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {/* Total Spent This Month */}
            <div className="bg-white/80 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all">
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Spent</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">₹{summary.monthly.toLocaleString()}</p>
            </div>

            {/* Comparison with Last Month */}
            <div className="bg-white/80 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all">
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">vs Last Month</p>
              {(() => {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                const lastMonthExpenses = expensesData.expenses
                  .filter(e => new Date(e.date).getMonth() === lastMonth.getMonth())
                  .reduce((sum, e) => sum + Number(e.amount), 0);
                
                const difference = summary.monthly - lastMonthExpenses;
                const percentChange = lastMonthExpenses > 0 ? ((difference / lastMonthExpenses) * 100).toFixed(1) : 0;
                const isIncrease = difference > 0;
                
                return (
                  <div className="flex items-center gap-1 md:gap-2">
                    <p className={`text-2xl md:text-3xl font-bold ${isIncrease ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {isIncrease ? '↑' : '↓'} {Math.abs(percentChange)}%
                    </p>
                    {isIncrease && <span className="text-xs text-red-600 dark:text-red-400 font-medium">Higher</span>}
                    {!isIncrease && lastMonthExpenses > 0 && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Lower</span>}
                  </div>
                );
              })()}
            </div>

            {/* Top Spending Category */}
            <div className="bg-white/80 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all">
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Category</p>
              {(() => {
                const thisMonthExpenses = expensesData.expenses.filter(
                  e => new Date(e.date).getMonth() === new Date().getMonth()
                );
                const categoryTotals = thisMonthExpenses.reduce((acc, e) => {
                  acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
                  return acc;
                }, {});
                const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
                
                return topCategory ? (
                  <div>
                    <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 truncate">{topCategory[0]}</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">₹{topCategory[1].toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500">No data</p>
                );
              })()}
            </div>

            {/* Daily Average */}
            <div className="bg-white/80 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all">
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Daily Average</p>
              {(() => {
                const today = new Date().getDate();
                const dailyAvg = today > 0 ? (summary.monthly / today).toFixed(0) : 0;
                
                return (
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">₹{Number(dailyAvg).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{today} days tracked</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Insights</p>
                {(() => {
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  const lastMonthExpenses = expensesData.expenses
                    .filter(e => new Date(e.date).getMonth() === lastMonth.getMonth())
                    .reduce((sum, e) => sum + Number(e.amount), 0);
                  
                  const difference = summary.monthly - lastMonthExpenses;
                  const isIncrease = difference > 0;
                  
                  const thisMonthExpenses = expensesData.expenses.filter(
                    e => new Date(e.date).getMonth() === new Date().getMonth()
                  );
                  const categoryTotals = thisMonthExpenses.reduce((acc, e) => {
                    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
                    return acc;
                  }, {});
                  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
                  const topCategoryPercent = topCategory && summary.monthly > 0 
                    ? ((topCategory[1] / summary.monthly) * 100).toFixed(0) 
                    : 0;

                  return (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {isIncrease 
                        ? `You've spent ₹${Math.abs(difference).toLocaleString()} more than last month. `
                        : lastMonthExpenses > 0 
                          ? `Great job! You've saved ₹${Math.abs(difference).toLocaleString()} compared to last month. `
                          : "This is your first month tracking. "}
                      {topCategory && (
                        <>
                          Your top category is <strong className="text-gray-800 dark:text-gray-200">{topCategory[0]}</strong> ({topCategoryPercent}% of total spending).
                          {topCategoryPercent > 40 && " Consider reviewing this category to optimize your budget."}
                        </>
                      )}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Budget Alerts */}
        <BudgetAlerts />

        {/* Make Payment Button */}
        <Link to="/payments" className="block">
          <div className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Make a Payment</h3>
                  <p className="text-white/90 text-sm">Quick and secure bill payments</p>
                </div>
              </div>
              <div className="text-white transform group-hover:translate-x-2 transition-transform duration-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </Link>

        {/* Enhanced PDF Report */}
        <div className="glass-card p-6 rounded-2xl animate-slide-up">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
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
                  className="input-field py-2"
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="input-field py-2"
                >
                  {[2023, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Add Expense + Expense List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Enhanced Add Expense Form */}
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl animate-slide-up h-fit lg:sticky lg:top-24">
            <UpcomingExpenses />

            <div className="text-center mb-8 mt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Add New Expense</h2>
              <p className="text-gray-500 dark:text-gray-400">Track your spending easily</p>
            </div>

            <ReceiptScanner onScanComplete={handleScanComplete} />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Expense Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleTitleBlur}
                    placeholder="e.g., Grocery Shopping"
                    className="input-field pl-10"
                    required
                  />
                  {aiLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold">₹</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="input-field pl-8"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
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
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add details..."
                  className="input-field resize-none min-h-[80px]"
                  rows="2"
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg shadow-lg shadow-blue-500/20 group">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="spinner w-5 h-5 border-white"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Add Expense <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Enhanced Expense List + Filters */}
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl lg:col-span-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
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
                  <div className="spinner"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="glass-card p-4 sm:p-6 rounded-2xl animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Expenses by Category</h2>
            </div>
            <CategoryPieChart data={categoryData} />
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-2xl animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Monthly Spending Trend</h2>
            </div>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="glass-card p-6 rounded-2xl animate-fade-in">
            <WeeklyLineChart />
          </div>
          <div className="glass-card p-6 rounded-2xl animate-fade-in">
            <CategoryStackedBarChart />
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="glass-card p-6 rounded-2xl animate-slide-up mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Need Help?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ask our AI assistant anything</p>
              </div>
            </div>
            <button 
              onClick={() => setShowChat(true)}
              className="btn-secondary flex items-center gap-2"
            >
              Ask AI <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Enhanced Floating AI Chat Icon */}
        <button
          onClick={() => setShowChat(true)}
          className="group fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-2xl shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:scale-110 animate-bounce-subtle z-50"
        >
          <MessageSquare className="w-6 h-6 group-hover:animate-bounce-subtle" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-gray-900"></div>
        </button>

        {/* AI Chat Box */}
        <AnimatePresence>
          {showChat && <AIChatBox onClose={() => setShowChat(false)} />}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

const SummaryCard = ({ title, value, icon, gradient, delay }) => (
  <div className="group glass-card p-6 rounded-2xl animate-slide-up hover:scale-105 transition-transform duration-300 cursor-pointer" style={{ animationDelay: delay }}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
