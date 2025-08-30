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
      {/* Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFilter}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {Object.keys(filters).length > 0 && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 border rounded-lg shadow bg-gray-50"
          >
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Category</label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block font-medium mb-1">Sort By</label>
              <select
                value={filters.sort || ""}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Default</option>
                <option value="amount_asc">Amount (Low → High)</option>
                <option value="amount_desc">Amount (High → Low)</option>
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applied Filters as Badges */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(filters).map(([key, value]) =>
            value ? (
              <span
                key={key}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {key}: {value}
              </span>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
