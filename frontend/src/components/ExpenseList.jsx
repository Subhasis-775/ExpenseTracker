import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expensesData, filters, setFilters, fetchExpenses }) => {
  const { expenses, total, pages } = expensesData;
  const limit = 5; // matches backend

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl shadow-soft border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white sticky top-0 rounded-t-2xl">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">Title</th>
              <th className="py-4 px-6 text-center font-semibold">Amount</th>
              <th className="py-4 px-6 text-center font-semibold">Category</th>
              <th className="py-4 px-6 text-center font-semibold">Date</th>
              <th className="py-4 px-6 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-lg font-medium">No expenses found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Start adding expenses to see them here</p>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((exp, index) => (
                <ExpenseItem
                  key={exp._id}
                  expense={exp}
                  onUpdate={fetchExpenses}
                  onDelete={fetchExpenses}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3 flex-wrap">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
          >
            ← Previous
          </button>

          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 shadow-soft ${
                filters.page === p
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pages}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft"
          >
            Next →
          </button>
        </div>
      )}

      {/* Enhanced Showing Info */}
      <div className="text-center text-gray-600 dark:text-gray-300 mt-4 text-sm">
        <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl shadow-soft">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>
            Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{(filters.page - 1) * limit + 1}</span> -{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">{Math.min(filters.page * limit, total)}</span> of{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">{total}</span> expenses
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
