import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Plus, Trash2, Zap, BarChart2, HelpCircle, ArrowRight } from "lucide-react";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import MonthlyBarChart from "../components/charts/MonthlyBarChart.jsx";
import { Link } from "react-router-dom";
import { getRecurring, addRecurring, deleteRecurring } from "../services/recurring.js";

const RecurringManager = () => {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [form, setForm] = useState({ 
    title: "", 
    amount: "", 
    frequency: "", 
    nextDue: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Chart data
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Fetch recurring expenses from backend
  useEffect(() => {
    fetchRecurringExpenses();
  }, []);

  const fetchRecurringExpenses = async () => {
    try {
      setLoading(true);
      const response = await getRecurring();
      setRecurringExpenses(response.data || []);
    } catch (err) {
      console.error("Error fetching recurring expenses:", err);
      toast.error("Failed to load recurring expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prepare Category Pie Chart data
    const catMap = {};
    recurringExpenses.forEach(exp => {
      catMap[exp.title] = (catMap[exp.title] || 0) + Number(exp.amount);
    });
    setCategoryData(Object.entries(catMap).map(([category, amount]) => ({ category, amount })));

    // Prepare Monthly Bar Chart data
    const monthMap = {};
    recurringExpenses.forEach(exp => {
      let months = [];
      if (exp.frequency === "monthly") months = Array.from({ length: 12 }, (_, i) => i);
      if (exp.frequency === "weekly") months = Array.from({ length: 12 }, (_, i) => i);
      if (exp.frequency === "daily") months = Array.from({ length: 12 }, (_, i) => i);
      
      months.forEach(m => {
        const monthName = new Date(0, m).toLocaleString("default", { month: "short" });
        monthMap[monthName] = (monthMap[monthName] || 0) + Number(exp.amount);
      });
    });
    setMonthlyData(Object.entries(monthMap).map(([month, amount]) => ({ month, amount })));
  }, [recurringExpenses]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.frequency || !form.nextDue) {
      setError("All fields are required");
      return;
    }

    try {
      await addRecurring({
        title: form.title,
        amount: Number(form.amount),
        frequency: form.frequency,
        nextDue: form.nextDue
      });
      
      setForm({ title: "", amount: "", frequency: "", nextDue: "" });
      setError("");
      toast.success("Recurring expense added ✅");
      fetchRecurringExpenses(); // Refresh the list
    } catch (err) {
      console.error("Error adding recurring expense:", err);
      toast.error("Failed to add recurring expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurring(id);
      toast.success("Recurring expense deleted ❌");
      fetchRecurringExpenses(); // Refresh the list
    } catch (err) {
      console.error("Error deleting recurring expense:", err);
      toast.error("Failed to delete recurring expense");
    }
  };

  return (
    <Layout>
      <div className="space-y-8 relative animate-fade-in">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recurring Expenses</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your subscriptions and regular bills</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 animate-slide-down">
            {error}
          </div>
        )}

        {/* Add Form */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Add New Subscription
          </h3>
          <form onSubmit={handleAdd} className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Service Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Zap className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. Netflix" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  className="input-field pl-10" 
                  required
                />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">₹</span>
                </div>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={form.amount} 
                  onChange={e => setForm({...form, amount: e.target.value})} 
                  className="input-field pl-8" 
                  required
                />
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Frequency</label>
              <div className="relative">
                <select 
                  value={form.frequency} 
                  onChange={e => setForm({...form, frequency: e.target.value})} 
                  className="input-field appearance-none"
                  required
                >
                  <option value="">Select Frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Next Due</label>
              <input 
                type="date" 
                value={form.nextDue} 
                onChange={e => setForm({...form, nextDue: e.target.value})} 
                className="input-field"
                required
              />
            </div>
            
            <div className="md:col-span-2 flex items-end">
              <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Add
              </button>
            </div>
          </form>
        </div>

        {/* Expenses List */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Subscriptions</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{recurringExpenses.length} active</span>
          </div>
          
          {loading ? (
            <div className="h-40 flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          ) : recurringExpenses.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No recurring expenses found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recurringExpenses.map((exp, index) => (
                <div
                  key={exp._id}
                  className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{exp.title}</h4>
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mt-1 ${
                        exp.frequency === 'monthly' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        exp.frequency === 'weekly' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {exp.frequency.charAt(0).toUpperCase() + exp.frequency.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cost</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">₹{exp.amount}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Next: {new Date(exp.nextDue).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cost Distribution</h3>
            </div>
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="glass-card p-6 rounded-2xl animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Projected Annual Cost</h3>
            </div>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>

        {/* Help Section */}
        <div className="glass-card p-6 rounded-2xl animate-slide-up mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Need Help Managing Subscriptions?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Learn how to optimize your recurring expenses</p>
              </div>
            </div>
            <Link to="/" className="btn-secondary flex items-center gap-2">
              View Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecurringManager;
