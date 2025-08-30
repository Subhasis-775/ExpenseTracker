import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expenses, fetchExpenses }) => {
  return (
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
                No expenses found. Add your first one!
              </td>
            </tr>
          ) : (
            expenses.map((exp) => (
              <ExpenseItem
                key={exp._id}
                expense={exp}
                onUpdate={fetchExpenses} // refresh list after edit
                onDelete={fetchExpenses} // refresh list after delete
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
