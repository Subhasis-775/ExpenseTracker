import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, AlertCircle } from 'lucide-react';

const UpcomingExpenses = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = async () => {
    try {
      const response = await api.get('/api/recurring');
      // Filter for expenses due in the next 7 days
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcomingExpenses = response.data.filter(item => {
        const dueDate = new Date(item.nextDue);
        return dueDate >= today && dueDate <= nextWeek;
      });

      setUpcoming(upcomingExpenses);
    } catch (error) {
      console.error('Error fetching upcoming expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null; // Don't show anything while loading to avoid layout shift
  if (upcoming.length === 0) return null; // Don't show if no upcoming expenses

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/50 rounded-2xl p-6 mb-8 animate-fade-in">
      <div className="flex items-center mb-4">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Upcoming Expenses
        </h3>
      </div>
      
      <div className="space-y-3">
        {upcoming.map((expense) => (
          <div 
            key={expense._id}
            className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{expense.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {new Date(expense.nextDue).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ₹{expense.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingExpenses;
