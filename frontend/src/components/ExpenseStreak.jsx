import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getExpenses } from "../services/expenses.js";

const ExpenseStreak = () => {
  const [expenses, setExpenses] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses({ limit: 1000 });
        setExpenses(res.data.expenses || []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const getLast84Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const getExpensesForDate = (date) => {
    const dateStr = date.toDateString();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date).toDateString();
      return expenseDate === dateStr;
    });
  };

  const getIntensity = (count, total) => {
    if (count === 0) return 0;
    if (total === 0) return 1;
    
    const percentage = (total / 5000) * 100;
    if (percentage < 25) return 1;
    if (percentage < 50) return 2;
    if (percentage < 75) return 3;
    return 4;
  };

  const days = getLast84Days();
  const weeks = [];
  
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColorClass = (intensity) => {
    switch (intensity) {
      case 0: return "bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600";
      case 1: return "bg-green-200 dark:bg-green-900/40";
      case 2: return "bg-green-400 dark:bg-green-700/60";
      case 3: return "bg-green-500 dark:bg-green-600/80";
      case 4: return "bg-green-600 dark:bg-green-500";
      default: return "bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600";
    }
  };

  const monthLabels = [];
  let currentMonth = null;
  
  days.forEach((date, index) => {
    const month = date.getMonth();
    if (month !== currentMonth && index % 7 === 0) {
      monthLabels.push({
        month: date.toLocaleString('default', { month: 'short' }),
        position: Math.floor(index / 7)
      });
      currentMonth = month;
    }
  });

  return (
    <div className="p-4">
      <div className="relative">
        {/* Month labels */}
        <div className="flex gap-1 mb-2 ml-6">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              style={{ marginLeft: label.position > 0 ? `${(label.position - (monthLabels[index - 1]?.position || 0)) * 14}px` : '0' }}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
            <div style={{ height: '12px' }}></div>
            <div style={{ height: '12px' }}>Mon</div>
            <div style={{ height: '12px' }}></div>
            <div style={{ height: '12px' }}>Wed</div>
            <div style={{ height: '12px' }}></div>
            <div style={{ height: '12px' }}>Fri</div>
            <div style={{ height: '12px' }}></div>
          </div>

          {/* Weeks grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  const dayExpenses = getExpensesForDate(date);
                  const total = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
                  const intensity = getIntensity(dayExpenses.length, total);
                  
                  return (
                    <motion.div
                      key={dayIndex}
                      whileHover={{ scale: 1.2 }}
                      className={`w-3 h-3 rounded-sm cursor-pointer ${getColorClass(intensity)} transition-colors`}
                      onMouseEnter={() => setTooltipData({ date, count: dayExpenses.length, total })}
                      onMouseLeave={() => setTooltipData(null)}
                      title={`${date.toLocaleDateString()}: ${dayExpenses.length} expenses, ₹${total}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/60" />
            <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600/80" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
          </div>
          <span>More</span>
        </div>

        {/* Tooltip */}
        {tooltipData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 pointer-events-none"
          >
            <p className="font-semibold">{tooltipData.date.toLocaleDateString()}</p>
            <p>{tooltipData.count} expenses - ₹{tooltipData.total.toLocaleString()}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExpenseStreak;
