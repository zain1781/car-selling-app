// backend/models/User.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: String,
  description: String,
  amount: Number,
  vendor: String,
  paymentMethod: String,
  type: { type: String, enum: ['in', 'out'] },
  category: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
});



module.exports = mongoose.model('Transaction', transactionSchema);
