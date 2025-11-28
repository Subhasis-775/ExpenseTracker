import Goal from '../models/goalModel.js';

// Get all goals for the authenticated user
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goals' });
  }
};

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, category } = req.body;
    
    const goal = await Goal.create({
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category,
      userId: req.user.id
    });
    
    res.status(201).json({ success: true, goal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create goal' });
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const goal = await Goal.findOne({ _id: id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    
    Object.keys(updates).forEach(key => {
      goal[key] = updates[key];
    });
    
    await goal.save();
    
    res.status(200).json({ success: true, goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ success: false, message: 'Failed to update goal' });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    
    res.status(200).json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
};
