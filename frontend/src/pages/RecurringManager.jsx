import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import { Plus, Trash2 } from "lucide-react";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import MonthlyBarChart from "../components/charts/MonthlyBarChart.jsx";

const RecurringManager = () => {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", interval: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Chart data
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const dummyData = [
        { id: 1, category: "Netflix", amount: 499, interval: "Monthly" },
        { id: 2, category: "Gym", amount: 1200, interval: "Monthly" },
        { id: 3, category: "Spotify", amount: 199, interval: "Monthly" },
        { id: 4, category: "Netflix", amount: 499, interval: "Yearly" },
      ];
      setRecurringExpenses(dummyData);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Prepare Category Pie Chart data
    const catMap = {};
    recurringExpenses.forEach(exp => {
      catMap[exp.category] = (catMap[exp.category] || 0) + Number(exp.amount);
    });
    setCategoryData(Object.entries(catMap).map(([category, amount]) => ({ category, amount })));

    // Prepare Monthly Bar Chart data
    const monthMap = {};
    recurringExpenses.forEach(exp => {
      let months = [];
      if (exp.interval === "Monthly") months = Array.from({ length: 12 }, (_, i) => i);
      if (exp.interval === "Yearly") months = [new Date().getMonth()]; // for simplicity
      months.forEach(m => {
        const monthName = new Date(0, m).toLocaleString("default", { month: "short" });
        monthMap[monthName] = (monthMap[monthName] || 0) + Number(exp.amount);
      });
    });
    setMonthlyData(Object.entries(monthMap).map(([month, amount]) => ({ month, amount })));
  }, [recurringExpenses]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.interval) {
      setError("All fields are required");
      return;
    }
    const newExpense = { ...form, id: Date.now() };
    setRecurringExpenses([...recurringExpenses, newExpense]);
    setForm({ category: "", amount: "", interval: "" });
    setError("");
    toast.success("Recurring expense added ✅");
  };

  const handleDelete = (id) => {
    setRecurringExpenses(recurringExpenses.filter(exp => exp.id !== id));
    toast.success("Recurring expense deleted ❌");
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold">Manage Recurring Expenses</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}

        {/* Add Form */}
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-md grid md:grid-cols-3 gap-4 mb-6">
          <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category:e.target.value})} className="border p-2 rounded" />
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount:e.target.value})} className="border p-2 rounded" />
          <select value={form.interval} onChange={e => setForm({...form, interval:e.target.value})} className="border p-2 rounded">
            <option value="">Select Interval</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 rounded flex justify-center items-center gap-2">
            <Plus size={16} /> Add Recurring Expense
          </button>
        </form>

        {/* Expenses List */}
        {/* Expenses List */}
<div className="bg-white p-6 rounded-2xl shadow-md">
  <h3 className="text-lg font-semibold mb-6">Your Recurring Expenses</h3>
  {loading ? (
    <div className="h-40 flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) : recurringExpenses.length === 0 ? (
    <p className="text-gray-500">No recurring expenses found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recurringExpenses.map(exp => (
        <div
          key={exp.id}
          className="flex flex-col justify-between p-4 bg-gray-50 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-md font-semibold text-gray-800">{exp.category}</h4>
              <p className="text-sm text-gray-500 mt-1">Interval: <span className="font-medium">{exp.interval}</span></p>
            </div>
            <button
              onClick={() => handleDelete(exp.id)}
              className="text-red-600 hover:text-red-800 rounded-full p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-gray-900">₹{exp.amount}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecurringManager;
