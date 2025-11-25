import { useState } from 'react';
import { createOrder, verifyPayment } from '../services/payment';
import PaymentHistory from '../components/PaymentHistory';
import Layout from '../components/Layout';
import { CreditCard, DollarSign, FileText, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RAZORPAY_KEY_ID } from '../config/razorpayConfig';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.amount || !formData.description || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    if (parseFloat(formData.amount) < 1) {
      toast.error('Amount must be at least ₹1');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay. Please try again.');
        setLoading(false);
        return;
      }

      // Create order
      const orderData = await createOrder(
        parseFloat(formData.amount),
        formData.description,
        formData.category
      );

      if (!orderData.success) {
        toast.error(orderData.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Expense Tracker',
        description: formData.description,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyData.success) {
              toast.success('✅ Payment successful! Expense added automatically.');
              setFormData({ amount: '', description: '', category: '' });
              setRefreshHistory((prev) => prev + 1); // Trigger history refresh
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-glow">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Make a Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quick and secure payments with automatic expense tracking
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-500" />
            Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g., 500"
                min="1"
                step="0.01"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 mr-1 text-blue-500" />
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Electricity Bill Payment"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Tag className="w-4 h-4 mr-1 text-blue-500" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-soft"
              >
                <option value="">-- Select Category --</option>
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-glow hover:shadow-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Now
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Note:</strong> After successful payment, an expense will be
              automatically created in your dashboard with the same details.
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-blue-500" />
            Payment History
          </h2>
          <PaymentHistory key={refreshHistory} />
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
