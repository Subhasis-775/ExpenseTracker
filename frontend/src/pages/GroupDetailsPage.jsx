import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getGroupDetails, addGroupExpense } from '../services/group';
import { createOrder, verifyPayment } from '../services/payment';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Users, Plus, ArrowLeft, Receipt, CheckCircle, CreditCard } from 'lucide-react';

const GroupDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [settling, setSettling] = useState(false);
  
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitBetween: []
  });

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getGroupDetails(id);
      if (res.success) {
        setGroupData(res.data);
        // Initialize splitBetween with all members by default
        setExpenseForm(prev => ({
            ...prev,
            paidBy: res.data.group.members[0],
            splitBetween: res.data.group.members
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch group details");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (member) => {
    setExpenseForm(prev => {
        const newSplit = prev.splitBetween.includes(member)
            ? prev.splitBetween.filter(m => m !== member)
            : [...prev.splitBetween, member];
        return { ...prev, splitBetween: newSplit };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expenseForm.splitBetween.length === 0) {
        return toast.error("Please select at least one person to split with");
      }

      await addGroupExpense({
        groupId: id,
        ...expenseForm
      });

      toast.success("Expense added! 💸");
      setExpenseForm({
        description: '',
        amount: '',
        paidBy: groupData.group.members[0],
        splitBetween: groupData.group.members
      });
      setShowForm(false);
      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Failed to add expense");
    }
  };

  const handleSettleUp = async (amount) => {
    if (!amount || amount <= 0) return;
    setSettling(true);
    try {
        // 1. Create Order
        const orderRes = await createOrder(amount, `Settlement for ${groupData.group.name}`, 'Utilities');
        
        if (!orderRes.success) throw new Error("Failed to create order");

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderRes.order.amount,
            currency: orderRes.order.currency,
            name: "Expense Tracker",
            description: `Settle Up - ${groupData.group.name}`,
            order_id: orderRes.order.id,
            handler: async function (response) {
                try {
                    // 2. Verify Payment
                    await verifyPayment({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature
                    });
                    
                    toast.success("Payment Successful! Recording settlement...");

                    // 3. Record Settlement Expense
                    // Find members with positive balances to split this payment among
                    const positiveBalanceMembers = Object.entries(groupData.balances)
                        .filter(([_, bal]) => bal > 0)
                        .map(([m]) => m);
                    
                    // If no one has positive balance (rare if I have negative), fallback to everyone else
                    const splitWith = positiveBalanceMembers.length > 0 
                        ? positiveBalanceMembers 
                        : groupData.group.members.filter(m => m !== user.name);

                    await addGroupExpense({
                        groupId: id,
                        description: 'Settlement Payment',
                        amount: parseFloat(amount),
                        paidBy: user.name,
                        splitBetween: splitWith
                    });

                    fetchDetails();
                    toast.success("Settled Up! 🎉");
                } catch (err) {
                    console.error(err);
                    toast.error("Payment verification or recording failed");
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: "#10B981",
            },
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error(err);
        toast.error("Failed to initiate payment");
    } finally {
        setSettling(false);
    }
  };

  if (loading) {
    return (
        <Layout>
            <div className="flex justify-center items-center h-screen">
                <div className="spinner w-10 h-10 border-indigo-500"></div>
            </div>
        </Layout>
    );
  }

  if (!groupData) return null;

  const { group, expenses, balances } = groupData;
  const userBalance = balances[user.name] || 0;

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/groups')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{group.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{group.members.length} members</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Balances & Add Expense */}
            <div className="space-y-8">
                {/* Balances Card */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-indigo-500" /> Balances
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(balances).map(([member, balance]) => (
                            <div key={member} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    {member}
                                    {member === user.name && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                                </span>
                                <span className={`font-bold ${balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                    {balance > 0 ? `gets back ₹${balance.toFixed(2)}` : balance < 0 ? `owes ₹${Math.abs(balance).toFixed(2)}` : 'settled'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Settle Up Button for Current User */}
                    {userBalance < 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 dark:text-gray-400">Your Debt</span>
                                <span className="text-xl font-bold text-red-600">₹{Math.abs(userBalance).toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={() => handleSettleUp(Math.abs(userBalance))}
                                disabled={settling}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                {settling ? (
                                    <div className="spinner w-5 h-5 border-white"></div>
                                ) : (
                                    <>
                                        <CheckCircle size={20} /> Settle Up Now
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Add Expense Button/Form */}
                {!showForm ? (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={20} /> Add Shared Expense
                    </button>
                ) : (
                    <div className="glass-card p-6 rounded-2xl animate-slide-down">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Add Expense</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="e.g. Dinner"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paid By</label>
                                <select
                                    value={expenseForm.paidBy}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                                    className="input-field w-full"
                                >
                                    {group.members.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Split Between</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {group.members.map(m => (
                                        <label key={m} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={expenseForm.splitBetween.includes(m)}
                                                onChange={() => handleCheckboxChange(m)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{m}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Right Column: Expense List */}
            <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Receipt size={24} className="text-indigo-500" /> Recent Activity
                </h3>
                
                {expenses.length === 0 ? (
                    <div className="text-center py-12 glass-card rounded-2xl">
                        <p className="text-gray-500">No expenses added yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {expenses.map((expense) => (
                            <div key={expense._id} className="glass-card p-4 rounded-xl flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                        {new Date(expense.date).getDate()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100">{expense.description}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{expense.paidBy}</span> paid ₹{expense.amount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1">Split by {expense.splitBetween.length}</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">₹{expense.amount.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default GroupDetailsPage;
