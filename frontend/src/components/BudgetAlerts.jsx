import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, Calendar, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { getBudgets } from '../services/budget';
import { getExpenses } from '../services/expenses';

const BudgetAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgetAlerts();
  }, []);

  const fetchBudgetAlerts = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      // Fetch budgets and expenses for current month
      const budgetRes = await getBudgets(currentMonth, currentYear);
      const expenseRes = await getExpenses({
        startDate: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
        endDate: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0],
      });

      if (!budgetRes.success || !expenseRes.data) {
        setAlerts([]);
        return;
      }

      const budgets = budgetRes.data;
      const expenses = expenseRes.data.expenses || [];

      // Calculate alerts for each budget
      const calculatedAlerts = budgets.map(budget => {
        const categoryExpenses = expenses.filter(e => e.category === budget.category);
        const spent = categoryExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const percentage = (spent / budget.amount) * 100;
        const remaining = budget.amount - spent;

        // Calculate daily average for this category
        const today = new Date().getDate();
        const dailyAvg = spent / today;
        
        // Days left in month
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const daysLeft = daysInMonth - today;

        // Predicted total at current rate
        const predictedTotal = dailyAvg * daysInMonth;
        const willExceed = predictedTotal > budget.amount;
        const daysUntilExceed = willExceed ? Math.floor(remaining / dailyAvg) : null;

        return {
          category: budget.category,
          budgetAmount: budget.amount,
          spent,
          percentage: percentage.toFixed(1),
          remaining,
          daysLeft,
          daysUntilExceed,
          willExceed,
          status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
        };
      });

      // Filter and sort alerts (prioritize warnings and exceeded)
      const filteredAlerts = calculatedAlerts
        .filter(alert => alert.status !== 'good' || alert.willExceed)
        .sort((a, b) => {
          if (a.status === 'exceeded' && b.status !== 'exceeded') return -1;
          if (a.status !== 'exceeded' && b.status === 'exceeded') return 1;
          if (a.status === 'warning' && b.status !== 'warning') return -1;
          if (a.status !== 'warning' && b.status === 'warning') return 1;
          return b.percentage - a.percentage;
        });

      setAlerts(filteredAlerts);
    } catch (error) {
      console.error('Failed to fetch budget alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (status) => {
    switch (status) {
      case 'exceeded':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (status) => {
    switch (status) {
      case 'exceeded':
        return 'from-red-500 to-red-600 text-white';
      case 'warning':
        return 'from-yellow-500 to-yellow-600 text-white';
      default:
        return 'from-blue-500 to-blue-600 text-white';
    }
  };

  const getAlertBorder = (status) => {
    switch (status) {
      case 'exceeded':
        return 'border-red-300 dark:border-red-700';
      case 'warning':
        return 'border-yellow-300 dark:border-yellow-700';
      default:
        return 'border-blue-300 dark:border-blue-700';
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">All Good! 🎉</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your budgets are on track</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Budget Alerts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{alerts.length} alert{alerts.length !== 1 ? 's' : ''} need attention</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border-2 ${getAlertBorder(alert.status)} rounded-xl p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
          >
            {/* Alert Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAlertColor(alert.status)} flex items-center justify-center shadow-md`}>
                  {getAlertIcon(alert.status)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{alert.category}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Budget: ₹{alert.budgetAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  alert.status === 'exceeded' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : alert.status === 'warning'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {alert.percentage}% Used
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    alert.status === 'exceeded' ? 'bg-red-500' :
                    alert.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Alert Messages */}
            <div className="space-y-2">
              {/* Amount Remaining */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-gray-100">
                    {alert.daysLeft} days left
                  </strong>
                  {alert.remaining > 0 ? (
                    <>, <span className="text-green-600 dark:text-green-400 font-semibold">₹{alert.remaining.toLocaleString()} remaining</span></>
                  ) : (
                    <>, <span className="text-red-600 dark:text-red-400 font-semibold">₹{Math.abs(alert.remaining).toLocaleString()} over budget</span></>
                  )}
                </span>
              </div>

              {/* Prediction Warning */}
              {alert.willExceed && alert.daysUntilExceed !== null && alert.daysUntilExceed > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-700 dark:text-orange-300">
                    You'll likely exceed budget in <strong>{alert.daysUntilExceed} day{alert.daysUntilExceed !== 1 ? 's' : ''}</strong> at current rate
                  </span>
                </div>
              )}

              {/* Exceeded Warning */}
              {alert.status === 'exceeded' && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    Budget exceeded! Consider reviewing your {alert.category.toLowerCase()} expenses
                  </span>
                </div>
              )}

              {/* Warning at 80% */}
              {alert.status === 'warning' && alert.percentage >= 80 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 dark:text-yellow-300 font-semibold">
                    {alert.percentage}% of your {alert.category} budget used!
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts;
