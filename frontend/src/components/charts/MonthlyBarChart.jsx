import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyBarChart = ({ data }) => {
  return (
    <div className="bg-gray-100 shadow-lg rounded-2xl p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Monthly Spending Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
