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
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-2xl dark:bg-gray-800">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white sticky top-0">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-center">Amount</th>
              <th className="py-3 px-4 text-center">Category</th>
              <th className="py-3 px-4 text-center">Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <ExpenseItem
                  key={exp._id}
                  expense={exp}
                  onUpdate={fetchExpenses}
                  onDelete={fetchExpenses}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Prev
          </button>

          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 rounded-lg transition ${
                filters.page === p
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Showing Info */}
      <div className="text-center text-gray-600 mt-2 text-sm dark:text-gray-300">
        Showing {(filters.page - 1) * limit + 1} -{" "}
        {Math.min(filters.page * limit, total)} of {total} expenses
      </div>
    </div>
  );
};

export default ExpenseList;
