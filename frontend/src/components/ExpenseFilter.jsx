import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

export default function ExpenseFilter({ filters, setFilters }) {
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setShowFilter(false);
  };

  return (
    <div className="mb-6">
      {/* Enhanced Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFilter}
          className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-glow hover:shadow-glow transition-all duration-200 hover:scale-105"
        >
          <span className="text-sm">🔍</span>
          <span className="font-medium">{showFilter ? "Hide Filters" : "Show Filters"}</span>
        </button>

        {Object.keys(filters).length > 0 && (
          <button
            onClick={clearFilters}
            className="group flex items-center space-x-2 px-3 py-2 text-sm bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white rounded-xl shadow-glow-danger hover:shadow-glow-danger transition-all duration-200 hover:scale-105"
          >
            <span>🗑️</span>
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Enhanced Filters Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-6 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-soft bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                <select
                  value={filters.category || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">End Date</label>
                <input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Sort By</label>
                <select
                  value={filters.sort || ""}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
                >
                  <option value="">Default</option>
                  <option value="amount_asc">Amount (Low → High)</option>
                  <option value="amount_desc">Amount (High → Low)</option>
                  <option value="date_desc">Date (Newest First)</option>
                  <option value="date_asc">Date (Oldest First)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Applied Filters as Badges */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>🏷️</span>
            <span className="font-medium">Active Filters:</span>
          </div>
          {Object.entries(filters).map(([key, value]) =>
            value ? (
              <span
                key={key}
                className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 text-sm rounded-full shadow-soft font-medium"
              >
                <span className="text-xs">✨</span>
                <span className="capitalize">{key}: {value}</span>
              </span>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
