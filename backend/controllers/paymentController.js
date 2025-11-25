import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpayConfig.js';
import Payment from '../models/paymentModel.js';
import Expense from '../models/expenseModel.js';

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id || req.user._id;

    // Validation
    if (!amount || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Amount, description, and category are required',
      });
    }

    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₹1',
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        description,
        category,
        userId: userId.toString(),
      },
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Save to database
    const payment = new Payment({
      userId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      description,
      category,
      status: 'created',
      notes: options.notes,
    });

    await payment.save();

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
      payment: payment,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const userId = req.user.id || req.user._id;

    // Validation
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details',
      });
    }

    // Find payment in database
    const payment = await Payment.findOne({
      razorpayOrderId,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Verify signature
    const text = razorpayOrderId + '|' + razorpayPaymentId;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      // Invalid signature
      payment.status = 'failed';
      payment.razorpayPaymentId = razorpayPaymentId;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Payment is valid - update payment
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'success';
    payment.paidAt = new Date();

    // Create expense automatically
    const expense = new Expense({
      title: payment.description,
      amount: payment.amount,
      category: payment.category,
      date: new Date(),
      notes: `Payment ID: ${razorpayPaymentId}`,
      userId: payment.userId,
    });

    await expense.save();

    // Link expense to payment
    payment.expenseId = expense._id;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment,
      expense,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { userId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('expenseId', 'title amount category date');

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message,
    });
  }
};

// Get Single Payment Details
export const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    const payment = await Payment.findOne({
      _id: id,
      userId,
    }).populate('expenseId', 'title amount category date notes');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message,
    });
  }
};
