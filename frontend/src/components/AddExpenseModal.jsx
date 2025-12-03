import { motion } from "framer-motion";
import { X, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import ReceiptScanner from "./ReceiptScanner";

const AddExpenseModal = ({
  formData,
  setFormData,
  handleChange,
  handleTitleBlur,
  handleScanComplete,
  handleSubmit,
  loading,
  aiLoading,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Add New Expense</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your spending easily</p> 
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Receipt Scanner */}
        <ReceiptScanner onScanComplete={handleScanComplete} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Expense Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleTitleBlur}
                placeholder="e.g., Grocery Shopping"
                className="input-field pl-12"
                required
              />
              {aiLoading && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold text-lg">₹</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Category</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field appearance-none"
                required
              >
                <option value="">Select Category</option>
                <option value="Food">🍽️ Food</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Education">📚 Education</option>
                <option value="Bills">💳 Bills</option>
                <option value="Healthcare">🏥 Healthcare</option>
                <option value="Travel">✈️ Travel</option>
                <option value="Utilities">⚡ Utilities</option>
                <option value="Other">📦 Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add details..."
              className="input-field resize-none min-h-[100px]"
              rows="3"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-4">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-4 text-lg shadow-lg shadow-blue-500/30 group">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner w-5 h-5 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Add Expense <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddExpenseModal;
