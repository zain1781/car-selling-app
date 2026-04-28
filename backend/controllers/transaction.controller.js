// backend/controllers/transaction.controller.js
const Transaction = require('../models/transaction.model.js');

exports.addTransaction = async (req, res) => {
  try {
    const { userId, date, description, amount, vendor, paymentMethod, type, category } = req.body;

    // Create a new transaction directly
    const newTransaction = new Transaction({
      userId,
      date,
      description,
      amount,
      vendor,
      paymentMethod,
      type,
      category
    });

    // Save the transaction
    await newTransaction.save();

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: newTransaction
    });
  } catch (err) {
    console.error('Transaction error:', err);
    res.status(500).json({ message: 'Error adding transaction', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({
      success: true,
      transactions
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: err.message
    });
  }
};
