import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWeeklyTrends } from '../../services/analytics';
import { TrendingUp } from 'lucide-react';

const WeeklyLineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getWeeklyTrends();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching weekly trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
        <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
        <p>No weekly data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
          Weekly Spending Trends
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last 8 weeks</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="week" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Spending']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Weekly Spending"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Highest Week</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{Math.max(...data.map(d => d.amount)).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average/Week</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{Math.round(data.reduce((sum, d) => sum + d.amount, 0) / data.length).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLineChart;
