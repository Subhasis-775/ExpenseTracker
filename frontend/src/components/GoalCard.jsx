import { Edit, Trash2, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  
  const data = [
    { name: 'Saved', value: goal.currentAmount },
    { name: 'Remaining', value: remaining }
  ];

  const COLORS = ['#10b981', '#e5e7eb'];

  const getCategoryIcon = (category) => {
    const icons = {
      "Vacation": "🏖️",
      "Electronics": "💻",
      "Education": "📚",
      "Emergency Fund": "🚨",
      "Home": "🏠",
      "Vehicle": "🚗",
      "Other": "📦"
    };
    return icons[category] || "📦";
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const daysRemaining = goal.deadline 
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getCategoryIcon(goal.category)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {goal.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
          >
            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                ₹{goal.currentAmount.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                / ₹{goal.targetAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {remaining > 0 && (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">₹{remaining.toLocaleString()} to go</span>
              </div>
            )}
            
            {goal.deadline && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(goal.deadline)}
                  {daysRemaining !== null && daysRemaining > 0 && (
                    <span className="ml-1 text-xs">({daysRemaining}d left)</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {progress >= 100 && (
            <div className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold inline-block">
              🎉 Goal Achieved!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GoalCard;
