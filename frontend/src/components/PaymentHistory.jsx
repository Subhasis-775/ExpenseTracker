import { useState, useEffect } from 'react';
import { getPaymentHistory } from '../services/payment';
import PaymentStatusBadge from './PaymentStatusBadge';
import { Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPaymentHistory(filters);
      setPayments(data.payments);
      setPagination({
        total: data.total,
        pages: data.pages,
        page: data.page,
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">No payment history found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Make your first payment to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleStatusFilter('')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filters.status === ''
              ? 'bg-blue-500 text-white shadow-glow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleStatusFilter('success')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filters.status === 'success'
              ? 'bg-green-500 text-white shadow-glow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Success
        </button>
        <button
          onClick={() => handleStatusFilter('failed')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filters.status === 'failed'
              ? 'bg-red-500 text-white shadow-glow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Failed
        </button>
        <button
          onClick={() => handleStatusFilter('pending')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filters.status === 'pending'
              ? 'bg-yellow-500 text-white shadow-glow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Pending
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Payment ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payment.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {payment.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    ₹{payment.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {payment.razorpayPaymentId || 'N/A'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
