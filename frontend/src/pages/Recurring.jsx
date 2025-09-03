// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getRecurring, deleteRecurring } from "../services/recurring.js";
// import RecurringForm from "../components/RecurringForm.jsx";
// import { Trash2, Zap, ArrowLeft } from "lucide-react";

// const Recurring = () => {
//   const [recurringExpenses, setRecurringExpenses] = useState([]);
//   const navigate = useNavigate();

//   // Fetch recurring expenses
//   const fetchRecurring = async () => {
//     try {
//       const res = await getRecurring();
//       setRecurringExpenses(res.data);
//     } catch (err) {
//       console.error("Failed to fetch recurring expenses", err);
//     }
//   };

//   useEffect(() => {
//     fetchRecurring();
//   }, []);

//   // Delete recurring
//   const handleDeleteRecurring = async (id) => {
//     if (!window.confirm("Delete this recurring expense?")) return;
//     try {
//       await deleteRecurring(id);
//       setRecurringExpenses((prev) => prev.filter((r) => r._id !== id));
//     } catch (err) {
//       console.error("Error deleting recurring expense", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 py-10 max-w-3xl mx-auto">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate("/dashboard")}
//         className="mb-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
//       >
//         <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//       </button>

//       <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         <Zap className="w-6 h-6 text-yellow-500" /> Recurring Expenses
//       </h1>

//       {/* Recurring Form */}
//       <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
//         <RecurringForm
//           onAdded={(newRecurring) => {
//             setRecurringExpenses((prev) => [newRecurring, ...prev]);
//           }}
//         />
//       </div>

//       {/* Recurring Expenses List */}
//       <div className="bg-white shadow-lg rounded-2xl p-6">
//         <ul className="divide-y divide-gray-200">
//           {recurringExpenses.length > 0 ? (
//             recurringExpenses.map((r) => (
//               <li
//                 key={r._id}
//                 className="flex justify-between items-center py-3"
//               >
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     ⚡ {r.title} - ₹{r.amount}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Frequency: {r.frequency} | Next Due:{" "}
//                     {new Date(r.nextDue).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteRecurring(r._id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </li>
//             ))
//           ) : (
//             <p className="text-gray-500">No recurring expenses yet.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Recurring;
