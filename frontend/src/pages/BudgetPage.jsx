import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getBudgets, setBudget, deleteBudget } from '../services/budget';
import { toast } from 'react-hot-toast';
import { PieChart, Wallet, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const categories = ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Utilities", "Healthcare", "Education", "Recurring", "Other"];

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await getBudgets(month, year);
      if (res.success) {
        setBudgets(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setBudget({
        ...formData,
        month,
        year
      });
      toast.success("Budget set successfully! 🎯");
      setFormData({ category: '', amount: '' });
      setShowForm(false);
      fetchBudgets();
    } catch (error) {
      toast.error(error.message || "Failed to set budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await deleteBudget(id);
      toast.success("Budget deleted");
      fetchBudgets();
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Wallet className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              Budget Manager
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Set limits and track your spending goals</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
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
              {[2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} /> Set Budget
            </button>
          </div>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <div className="glass-card p-6 rounded-2xl animate-slide-down">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Set Monthly Budget</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-auto sm:flex-1 md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto sm:flex-1 md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Limit Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g. 5000"
                  required
                  min="1"
                />
              </div>
              <button type="submit" className="btn-primary w-full md:w-auto h-[42px]">
                Save Budget
              </button>
            </form>
          </div>
        )}

        {/* Budget List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner w-10 h-10 border-blue-500"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No budgets set for this month</h3>
            <p className="text-gray-500 mt-2">Create a budget to start tracking your goals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <div key={budget._id} className="glass-card p-6 rounded-2xl relative group hover:scale-[1.02] transition-transform duration-300">
                <button
                  onClick={() => handleDelete(budget._id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{budget.category}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mt-2 border ${getStatusColor(budget.percentage)}`}>
                      {budget.percentage >= 100 ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                      {budget.percentage >= 100 ? 'Exceeded' : budget.percentage >= 80 ? 'Warning' : 'On Track'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">₹{budget.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Spent: ₹{budget.spent.toLocaleString()}</span>
                  <span className="text-gray-500 dark:text-gray-400">{budget.percentage.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(budget.percentage)}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {budget.remaining > 0 
                    ? `You can spend ₹${budget.remaining.toLocaleString()} more` 
                    : `Overspent by ₹${Math.abs(budget.remaining).toLocaleString()}`
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BudgetPage;
