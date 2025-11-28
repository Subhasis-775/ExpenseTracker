import { useState, useEffect, useContext } from "react";
import { Target, Plus, TrendingUp, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Layout from "../components/Layout.jsx";
import GoalCard from "../components/GoalCard.jsx";
import GoalForm from "../components/GoalForm.jsx";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../services/goals.js";
import { AuthContext } from "../context/AuthContext";

const GoalsPage = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await getGoals();
      setGoals(res.data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      toast.success("Goal created successfully!");
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    }
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      await updateGoal(editingGoal._id, goalData);
      toast.success("Goal updated successfully!");
      setShowForm(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      await deleteGoal(id);
      toast.success("Goal deleted successfully!");
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const handleEditClick = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  // Calculate statistics
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const achievedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
  const overallProgress = totalTargetAmount > 0 ? (totalSavedAmount / totalTargetAmount) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Financial Goals
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Track your savings and achieve your dreams
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Saved</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ₹{totalSavedAmount.toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Target</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ₹{totalTargetAmount.toLocaleString()}
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {Math.round(overallProgress)}%
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">🎉</span>
              <p className="text-sm text-gray-500 dark:text-gray-400">Achieved Goals</p>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {achievedGoals} / {goals.length}
            </p>
          </div>
        </div>

        {/* Goals List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="spinner"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start setting financial goals to track your progress
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={handleEditClick}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
        )}

        {/* Goal Form Modal */}
        <AnimatePresence>
          {showForm && (
            <GoalForm
              onClose={handleCloseForm}
              onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
              initialData={editingGoal}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default GoalsPage;
