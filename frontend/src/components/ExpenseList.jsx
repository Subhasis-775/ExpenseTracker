import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expensesData, filters, setFilters, fetchExpenses }) => {
  const { expenses, total, pages } = expensesData;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full bg-white rounded-2xl">
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
              expenses.map(exp => (
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
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={filters.page === 1}
          >
            Prev
          </button>
          <span>
            Page {filters.page} of {pages} | Total Items: {total}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={filters.page === pages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ExpenseList;
