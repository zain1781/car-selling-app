// backend/routes/transaction.route.js
const express = require('express');
const { addTransaction, getTransactions } = require('../controllers/transaction.controller.js');
const router = express.Router();

router.post('/transaction', addTransaction);
router.get('/', getTransactions);
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await require('../models/transaction.model.js').find({ userId });
    res.status(200).json({
      success: true,
      transactions
    });
  } catch (err) {
    console.error('Error fetching user transactions:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user transactions',
      error: err.message
    });
  }
});

module.exports = router;
