import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryComparison } from '../../services/analytics';
import { BarChart3 } from 'lucide-react';

const CategoryStackedBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getCategoryComparison();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching category comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
        <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
        <p>No category data available</p>
      </div>
    );
  }

  // Calculate totals
  const currentTotal = data.reduce((sum, item) => sum + item.currentMonth, 0);
  const previousTotal = data.reduce((sum, item) => sum + item.previousMonth, 0);
  const percentageChange = previousTotal > 0 
    ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
          Category Comparison
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">This month vs Last month</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="category" 
            stroke="#6b7280"
            style={{ fontSize: '11px' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
            formatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="previousMonth" fill="#94a3b8" name="Last Month" radius={[4, 4, 0, 0]} />
          <Bar dataKey="currentMonth" fill="#10b981" name="This Month" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">Last Month</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            ₹{previousTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{currentTotal.toLocaleString()}
          </p>
        </div>
        <div className={`p-4 rounded-xl ${
          percentageChange >= 0 
            ? 'bg-red-50 dark:bg-red-900/20' 
            : 'bg-green-50 dark:bg-green-900/20'
        }`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Change</p>
          <p className={`text-2xl font-bold ${
            percentageChange >= 0 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryStackedBarChart;
