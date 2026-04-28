// src/components/user/Wallet.jsx
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categories = {
  in: [
    "Sales of Inventory Asset",
    "Partner Investments",
    "Uncategorized Asset",
    "Commissions & fees",
    "Interest Earned",
    "Allowance of bad debt",
  ],
  out: [
    "Business Operations Expenses",
    "Vehicle & Transportation Expenses",
    "Marketing & Advertising",
    "Professional Services",
    "Business Licenses & Permits",
    "Technology & Software",
    "Depreciation & Asset Purchases",
    "Taxes & Government Fees",
    "Bad Debt",
    "Commissions & fees",
    "Contract labor",
    "Employee retirement plans",
    "General Business expenses",
    "Members & subscriptions",
    "Business insurance",
    "Interest paid",
    "Office expenses",
    "Salaries",
    "Rent",
    "Repairs and maintenance",
    "Shipping supplies",
    "Tax paid",
    "Travel",
    "Utilities",
    "Vehicle Towing service",
    "Other Misc expense",
    "Vehicle expenses",
    "Inventory",
    "Inventory Asset",
    "Loans to others",
    "Loans to partners",
    "Payment to deposit",
    "Prepaid expenses",
    "Uncategorized Asset",
    "Vehicle Purchase",
    "Security Deposit",
    "Sales",
    "Sales of Product Income",
    "Partner Investments",
    "Retained Earnings",
    "Freight Shipping",
    "Account Receivable",
    "Account Payable",
    "Business penalties",
  ],
};

export default function Wallet() {
    const user = localStorage.getItem('userid');
    console.log(user)

  const [formData, setFormData] = useState({
    userId: user,
    date: '',
    description: '',
    amount: '',
    vendor: '',
    paymentMethod: '',
    type: 'in',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user ID exists
    if (!user) {
      toast.error("Please log in to submit transactions");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = ['date', 'description', 'amount', 'vendor', 'paymentMethod', 'category'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field} field`);
        return false;
      }
    }

    // Validate amount is a number and greater than 0
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be a positive number");
      return false;
    }

    return true;
  };

  const submitTransaction = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Create a new transaction directly
      const transactionData = {
        userId: user,
        date: formData.date,
        description: formData.description,
        amount: parseFloat(formData.amount),
        vendor: formData.vendor,
        paymentMethod: formData.paymentMethod,
        type: formData.type,
        category: formData.category
      };

      console.log("Submitting transaction:", transactionData);

      const response = await fetch(`${api}transaction/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit transaction');
      }

      toast.success('Transaction submitted successfully');
      console.log(result);

      // Reset form after successful submission
      setFormData({
        userId: user,
        date: '',
        description: '',
        amount: '',
        vendor: '',
        paymentMethod: '',
        type: 'in',
        category: '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error submitting transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Staff Transaction</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Transaction Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="in">Income (IN)</option>
          <option value="out">Expense (OUT)</option>
        </select>
      </div>
       <div className="mb-4 hidden">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date
        </label>
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="date"
          value={formData.userId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date
        </label>
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amount
        </label>
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vendor/Customer
        </label>
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter vendor or customer name"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Payment Method
        </label>
        <select
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Method</option>
          <option value="Cash Payment">Cash Payment</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Check">Check</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {categories[formData.type].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        onClick={submitTransaction}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded w-full font-bold transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Transaction'}
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
