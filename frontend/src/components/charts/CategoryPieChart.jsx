// src/components/CategoryPieChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#A28DFF",
  "#FF6F91",
  "#00B8A9",
];

const CategoryPieChart = ({ data }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Spending by Category
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={50}
            paddingAngle={3}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, white)",
              color: "var(--tooltip-text, black)",
            }}
            formatter={(value) => `₹${value}`}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: "currentColor" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
