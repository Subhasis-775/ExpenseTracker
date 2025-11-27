import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { createOrder, verifyPayment } from '../services/payment';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { Check, Crown, Zap } from 'lucide-react';

const SubscriptionPage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const orderRes = await createOrder(499, 'Premium Subscription', 'Subscription');
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderRes.order.amount,
                currency: orderRes.order.currency,
                name: "Expense Tracker Pro",
                description: "Upgrade to Premium",
                order_id: orderRes.order.id,
                handler: async function (response) {
                    try {
                        // 2. Verify Payment
                        await verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        
                        // 3. Upgrade User Status
                        const upgradeRes = await API.post('/api/auth/upgrade');
                        
                        if (upgradeRes.data.success) {
                            const updatedUser = { ...user, isPremium: true };
                            setUser(updatedUser);
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            toast.success("Welcome to Premium! 🌟");
                        }
                    } catch (err) {
                        toast.error("Upgrade failed after payment");
                    }
                },
                prefill: {
                    name: user?.name || 'User',
                    email: user?.email || 'user@example.com',
                },
                theme: {
                    color: "#F59E0B",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.error('Payment cancelled');
                    },
                },
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            toast.error("Failed to initiate upgrade");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Unlock Your Financial Potential
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Get advanced insights, unlimited groups, and more with Pro.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h2>
                        <p className="text-gray-500 mb-6">Essential features for everyone</p>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        
                        <ul className="space-y-4 mb-8">
                            {['Basic Expense Tracking', 'Monthly Reports', '3 Groups Max', 'Standard Support'].map((feature) => (
                                <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                                    <Check className="w-5 h-5 text-green-500 mr-3" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        <button className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-semibold text-gray-600 dark:text-gray-300 cursor-default">
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
                            <Crown size={12} /> POPULAR
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-2">Pro</h2>
                        <p className="text-indigo-100 mb-6">Power users & teams</p>
                        <div className="text-4xl font-bold mb-8">₹499<span className="text-lg text-indigo-200 font-normal">/mo</span></div>
                        
                        <ul className="space-y-4 mb-8">
                            {[
                                'Unlimited Groups',
                                'Advanced AI Insights',
                                'Export to CSV/Excel',
                                'Priority Support',
                                'Custom Categories',
                                'Recurring Expense Management'
                            ].map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <div className="bg-white/20 rounded-full p-1 mr-3">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        {user?.isPremium ? (
                            <button className="w-full py-3 rounded-xl bg-white text-indigo-600 font-bold cursor-default shadow-lg">
                                Plan Active
                            </button>
                        ) : (
                            <button 
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : <>Get Pro Access <Zap size={20} /></>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SubscriptionPage;
