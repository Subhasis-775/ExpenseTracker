import Expense from '../models/expenseModel.js';

// Get weekly spending trends (last 8 weeks)
export const getWeeklyTrends = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    // Get date 8 weeks ago
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56); // 8 weeks = 56 days

    // Aggregate expenses by week
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: eightWeeksAgo }
        }
      },
      {
        $project: {
          amount: 1,
          week: { $week: '$date' },
          year: { $year: '$date' }
        }
      },
      {
        $group: {
          _id: { week: '$week', year: '$year' },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 }
      }
    ]);

    // Format data for frontend
    const weeklyData = expenses.map((item, index) => ({
      week: `Week ${index + 1}`,
      amount: item.total,
      weekNumber: item._id.week
    }));

    res.status(200).json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    console.error('Weekly trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly trends',
      error: error.message
    });
  }
};

// Get category comparison (current month vs previous month)
export const getCategoryComparison = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Get current month start
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get previous month start
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Aggregate current month by category
    const currentMonth = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: currentMonthStart }
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      }
    ]);

    // Aggregate previous month by category
    const previousMonth = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: previousMonthStart, $lte: previousMonthEnd }
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      }
    ]);

    // Combine data for stacked chart
    const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Utilities', 'Healthcare', 'Education', 'Other'];
    
    const comparisonData = categories.map(category => {
      const current = currentMonth.find(c => c._id === category);
      const previous = previousMonth.find(p => p._id === category);
      
      return {
        category,
        currentMonth: current ? current.amount : 0,
        previousMonth: previous ? previous.amount : 0
      };
    }).filter(item => item.currentMonth > 0 || item.previousMonth > 0);

    res.status(200).json({
      success: true,
      data: comparisonData
    });
  } catch (error) {
    console.error('Category comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category comparison',
      error: error.message
    });
  }
};

// Get monthly comparison (last 6 months)
export const getMonthlyComparison = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    // Get date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Aggregate by month
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $project: {
          amount: 1,
          month: { $month: '$date' },
          year: { $year: '$date' }
        }
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = expenses.map(item => ({
      month: monthNames[item._id.month - 1],
      amount: item.total,
      year: item._id.year
    }));

    res.status(200).json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    console.error('Monthly comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly comparison',
      error: error.message
    });
  }
};
