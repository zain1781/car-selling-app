import React, { useState, useEffect, useRef } from 'react';
import {
  FaWallet,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaFileInvoice,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaPlus,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaCarAlt,
  FaUpload,
  FaTrash,
  FaDownload
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transaction = () => {
  // State variables
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [userRole, setUserRole] = useState('staff'); // 'staff', 'partner', or 'customer'
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [userFilter, setUserFilter] = useState('');
  const [transactionType, setTransactionType] = useState('all'); // 'all', 'in', 'out'

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    vendor: '',
    paymentMethod: 'Cash Payment',
    category: '',
    transactionType: 'in',
    expenseType: 'general', // 'general' or 'vin-specific'
    vins: [],
    documents: []
  });

  // Transfer funds form state
  const [transfer, setTransfer] = useState({
    amount: '',
    description: 'Transfer to company account',
    date: new Date().toISOString().split('T')[0]
  });

  // Category options
  const inCategories = [
    'Sales of Inventory Asset',
    'Partner Investments',
    'Uncategorized Asset',
    'Commissions & fees',
    'Interest Earned',
    'Allowance of bad debt'
  ];

  const outCategories = [
    'Business Operations Expenses',
    'Vehicle & Transportation Expenses',
    'Marketing & Advertising',
    'Professional Services',
    'Business Licenses & Permits',
    'Technology & Software',
    'Depreciation & Asset Purchases',
    'Taxes & Government Fees',
    'Bad Debt',
    'Commissions & fees',
    'Contract labor',
    'Employee retirement plans',
    'General Business expenses',
    'Memberships & subscriptions',
    'Business insurance',
    'Interest paid',
    'Office expenses',
    'Salaries',
    'Rent',
    'Repairs and maintenance',
    'Shipping supplies',
    'Tax paid',
    'Travel',
    'Utilities',
    'Vehicle Towing service',
    'Other Misc expense',
    'Vehicle expenses',
    'Inventory',
    'Inventory Asset',
    'Loans to others',
    'Loans to partners',
    'Payment to deposit',
    'Prepaid expenses',
    'Uncategorized Asset',
    'Vehicle Purchase',
    'Security Deposit',
    'Sales',
    'Sales of Product Income',
    'Partner Investments',
    'Retained Earnings',
    'Freight Shipping',
    'Account Receivable',
    'Account Payable',
    'Business penalties'
  ];

  const paymentMethods = [
    'Cash Payment',
    'Debit Card',
    'Credit Card'
  ];

  // API URL
  const api = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem('userid');

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // Fetch all transactions (for admin)
        const response = await fetch(`${api}transaction`);

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();

        if (data.success && data.transactions) {
          // Map API data to component state format
          const formattedTransactions = data.transactions.map(txn => ({
            id: txn._id,
            date: txn.date,
            description: txn.description,
            amount: txn.amount,
            vendor: txn.vendor,
            paymentMethod: txn.paymentMethod,
            category: txn.category,
            transactionType: txn.type,
            expenseType: txn.expenseType || 'general',
            vins: txn.vins || [],
            status: txn.status || 'approved',
            approvedBy: txn.approvedBy || 'Admin',
            createdBy: txn.userId || 'Unknown'
          }));

          setTransactions(formattedTransactions);

          // Calculate balance from transactions
          const totalIn = formattedTransactions
            .filter(t => t.transactionType === 'in')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

          const totalOut = formattedTransactions
            .filter(t => t.transactionType === 'out')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

          setBalance(totalIn - totalOut);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    // Fetch vehicles for VIN selection
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${api}inventory`);

        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedVehicles = data.map(vehicle => ({
            vin: vehicle.vin || vehicle._id,
            make: vehicle.make || 'Unknown',
            model: vehicle.model || 'Unknown',
            year: vehicle.year || 'Unknown'
          }));

          setVehicles(formattedVehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchTransactions();
    fetchVehicles();
  }, [api]);

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    const searchMatch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vins.some(vin => vin.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const categoryMatch = categoryFilter ? transaction.category === categoryFilter : true;

    // Date filter
    const dateMatch =
      (!dateFilter.start || new Date(transaction.date) >= new Date(dateFilter.start)) &&
      (!dateFilter.end || new Date(transaction.date) <= new Date(dateFilter.end));

    // User filter
    const userMatch = userFilter ?
      transaction.createdBy.toLowerCase().includes(userFilter.toLowerCase()) ||
      (transaction.approvedBy && transaction.approvedBy.toLowerCase().includes(userFilter.toLowerCase()))
      : true;

    // Transaction type filter
    const typeMatch = transactionType === 'all' ? true : transaction.transactionType === transactionType;

    return searchMatch && categoryMatch && dateMatch && userMatch && typeMatch;
  });

  // Handle new transaction submission
  const handleSubmitTransaction = async (e) => {
    e.preventDefault();

    // Validation
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Prepare transaction data for API
      const transactionData = {
        userId: userId,
        date: newTransaction.date,
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        vendor: newTransaction.vendor,
        paymentMethod: newTransaction.paymentMethod,
        type: newTransaction.transactionType,
        category: newTransaction.category,
        expenseType: newTransaction.expenseType,
        vins: newTransaction.vins,
        status: userRole === 'partner' ? 'approved' : 'pending',
      };

      // Submit to API
      const response = await fetch(`${api}transaction/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      const result = await response.json();

      // Format the new transaction for the UI
      const newTxn = {
        id: result.transaction._id,
        ...transactionData,
        createdBy: userId,
        approvedBy: userRole === 'partner' ? userId : null
      };

      // Add to appropriate list
      if (newTxn.status === 'pending') {
        setPendingApprovals([...pendingApprovals, newTxn]);
        toast.success('Transaction submitted for approval');
      } else {
        setTransactions([...transactions, newTxn]);

        // Update balance
        if (newTxn.type === 'in') {
          setBalance(balance + parseFloat(newTxn.amount));
        } else {
          setBalance(balance - parseFloat(newTxn.amount));
        }

        toast.success('Transaction recorded successfully');
      }

      // Reset form and close modal
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        vendor: '',
        paymentMethod: 'Cash Payment',
        category: '',
        transactionType: 'in',
        expenseType: 'general',
        vins: [],
        documents: []
      });

      setShowNewTransactionModal(false);

    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(error.message || 'Failed to create transaction');
    }
  };

  // Handle transfer to company account
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(transfer.amount) > balance) {
      toast.error('Transfer amount exceeds available balance');
      return;
    }

    try {
      // Create transfer transaction data
      const transferData = {
        userId: userId,
        date: transfer.date,
        description: transfer.description,
        amount: parseFloat(transfer.amount),
        vendor: 'Company Account',
        paymentMethod: 'Internal Transfer',
        category: 'Transfer to Company',
        type: 'out',
        expenseType: 'general',
        vins: [],
        status: userRole === 'partner' ? 'approved' : 'pending',
      };

      // Submit to API
      const response = await fetch(`${api}transaction/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process transfer');
      }

      const result = await response.json();

      // Format the transfer transaction for the UI
      const transferTransaction = {
        id: result.transaction._id,
        ...transferData,
        transactionType: 'out',
        createdBy: userId,
        approvedBy: userRole === 'partner' ? userId : null
      };

      // Add to appropriate list and update balance
      if (transferTransaction.status === 'pending') {
        setPendingApprovals([...pendingApprovals, transferTransaction]);
        toast.success('Transfer submitted for approval');
      } else {
        setTransactions([...transactions, transferTransaction]);
        setBalance(balance - transferTransaction.amount);
        toast.success('Transfer completed successfully');
      }

      // Reset transfer form and close modal
      setTransfer({
        amount: '',
        description: 'Transfer to company account',
        date: new Date().toISOString().split('T')[0]
      });

      setShowTransferModal(false);
    } catch (error) {
      console.error('Error processing transfer:', error);
      toast.error(error.message || 'Failed to process transfer');
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Wallet Overview</h2>

      {/* Balance */}
      <div className="flex items-center mb-6">
        <FaWallet className="text-green-500 text-2xl mr-2" />
        <span className="text-xl font-semibold">Balance: ${balance.toFixed(2)}</span>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full p-2 pl-10 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <select
              className="w-full p-2 border rounded"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <optgroup label="Income Categories">
                {inCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
              <optgroup label="Expense Categories">
                {outCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* User Filter */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by user..."
                className="w-full p-2 pl-10 border rounded"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
              <FaUser className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Range */}
          <div className="flex-1 flex gap-2 items-center">
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="date"
              className="flex-1 p-2 border rounded"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
            <span>to</span>
            <input
              type="date"
              className="flex-1 p-2 border rounded"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            />
          </div>

          {/* Transaction Type Buttons */}
          <div className="flex-1">
            <div className="flex gap-2">
              <button
                className={`flex-1 p-2 rounded ${transactionType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTransactionType('all')}
              >
                All
              </button>
              <button
                className={`flex-1 p-2 rounded ${transactionType === 'in' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTransactionType('in')}
              >
                Income
              </button>
              <button
                className={`flex-1 p-2 rounded ${transactionType === 'out' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTransactionType('out')}
              >
                Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Transactions</h3>
          <div className="text-sm text-gray-500">
            {transactions.length > 0 && `Total: ${transactions.length} transactions`}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500 mb-4">No transactions found.</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowNewTransactionModal(true)}
            >
              <FaPlus className="inline mr-2" /> Add Your First Transaction
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-gray-50 p-4 text-center rounded-lg">
            <p className="text-gray-500">No transactions match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Date</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(txn => (
                  <tr key={txn.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{txn.date}</td>
                    <td className="p-2">{txn.description}</td>
                    <td className={`p-2 font-medium ${txn.transactionType === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.transactionType === 'in' ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                    </td>
                    <td className="p-2">{txn.category}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        txn.transactionType === 'in'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {txn.transactionType === 'in' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        txn.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          // View transaction details (could be implemented in a future update)
                          toast.info(`Viewing details for transaction: ${txn.description}`);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Approvals */}
      {userRole === 'partner' && pendingApprovals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Pending Approvals</h3>
          <ul className="space-y-2">
            {pendingApprovals.map(pa => (
              <li key={pa.id} className="border p-2 rounded">
                <div className="flex justify-between">
                  <span>{pa.description} - ${pa.amount}</span>
                  <div className="space-x-2">
                    <button
                      className="text-green-500"
                      onClick={() => {
                        const updated = { ...pa, status: 'approved', approvedBy: 'John Partner' };
                        setTransactions([...transactions, updated]);
                        setPendingApprovals(pendingApprovals.filter(p => p.id !== pa.id));
                        if (updated.transactionType === 'in') {
                          setBalance(balance + parseFloat(updated.amount));
                        } else {
                          setBalance(balance - parseFloat(updated.amount));
                        }
                        toast.success('Transaction approved');
                      }}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => {
                        setPendingApprovals(pendingApprovals.filter(p => p.id !== pa.id));
                        toast.info('Transaction rejected');
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buttons for new transaction or transfer */}
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowNewTransactionModal(true)}
        >
          <FaPlus className="inline mr-2" /> New Transaction
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setShowTransferModal(true)}
        >
          <FaExchangeAlt className="inline mr-2" /> Transfer Funds
        </button>
      </div>

      {/* New Transaction Modal */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">New Transaction</h3>
            <form onSubmit={handleSubmitTransaction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Transaction Type */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1">Transaction Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="transactionType"
                        value="in"
                        checked={newTransaction.transactionType === 'in'}
                        onChange={() => setNewTransaction({...newTransaction, transactionType: 'in'})}
                        className="mr-2"
                      />
                      Income
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="transactionType"
                        value="out"
                        checked={newTransaction.transactionType === 'out'}
                        onChange={() => setNewTransaction({...newTransaction, transactionType: 'out'})}
                        className="mr-2"
                      />
                      Expense
                    </label>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Vendor */}
                <div>
                  <label className="block mb-1">Vendor/Customer</label>
                  <input
                    type="text"
                    value={newTransaction.vendor}
                    onChange={(e) => setNewTransaction({...newTransaction, vendor: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block mb-1">Payment Method</label>
                  <select
                    value={newTransaction.paymentMethod}
                    onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1">Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select a category</option>
                    {newTransaction.transactionType === 'in' ? (
                      inCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    ) : (
                      outCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Expense Type */}
                {newTransaction.transactionType === 'out' && (
                  <div className="col-span-1 md:col-span-2">
                    <label className="block mb-1">Expense Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="expenseType"
                          value="general"
                          checked={newTransaction.expenseType === 'general'}
                          onChange={() => setNewTransaction({...newTransaction, expenseType: 'general', vins: []})}
                          className="mr-2"
                        />
                        General Expense
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="expenseType"
                          value="vin-specific"
                          checked={newTransaction.expenseType === 'vin-specific'}
                          onChange={() => setNewTransaction({...newTransaction, expenseType: 'vin-specific'})}
                          className="mr-2"
                        />
                        Vehicle-Specific Expense
                      </label>
                    </div>
                  </div>
                )}

                {/* VIN Selection */}
                {(newTransaction.expenseType === 'vin-specific' ||
                  (newTransaction.transactionType === 'in' && newTransaction.category === 'Sales of Inventory Asset')) && (
                  <div className="col-span-1 md:col-span-2">
                    <label className="block mb-1">Select Vehicle(s)</label>
                    <select
                      multiple
                      value={newTransaction.vins}
                      onChange={(e) => {
                        const selectedVins = Array.from(e.target.selectedOptions, option => option.value);
                        setNewTransaction({...newTransaction, vins: selectedVins});
                      }}
                      className="w-full p-2 border rounded h-32"
                    >
                      {vehicles.map(vehicle => (
                        <option key={vehicle.vin} value={vehicle.vin}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple vehicles</p>
                  </div>
                )}

                {/* Document Upload */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block mb-1">Upload Documents (Optional)</label>
                  <div className="border rounded p-4">
                    <div className="flex items-center justify-center border-2 border-dashed p-4 mb-2">
                      <div className="text-center">
                        <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                        <p>Drag & drop files here or click to browse</p>
                        <input
                          type="file"
                          multiple
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          onChange={(e) => {
                            // In a real app, you would handle file uploads here
                            // For this example, we'll just store the file names
                            const fileNames = Array.from(e.target.files).map(file => file.name);
                            setNewTransaction({...newTransaction, documents: [...newTransaction.documents, ...fileNames]});
                          }}
                        />
                      </div>
                    </div>

                    {/* Document List */}
                    {newTransaction.documents.length > 0 && (
                      <ul className="space-y-1">
                        {newTransaction.documents.map((doc, index) => (
                          <li key={index} className="flex justify-between items-center text-sm">
                            <span>{doc}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => {
                                const updatedDocs = [...newTransaction.documents];
                                updatedDocs.splice(index, 1);
                                setNewTransaction({...newTransaction, documents: updatedDocs});
                              }}
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowNewTransactionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Funds Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Transfer Funds to Company Account</h3>
            <form onSubmit={handleTransfer}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={balance}
                    value={transfer.amount}
                    onChange={(e) => setTransfer({...transfer, amount: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Available balance: ${balance.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block mb-1">Description</label>
                  <input
                    type="text"
                    value={transfer.description}
                    onChange={(e) => setTransfer({...transfer, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Date</label>
                  <input
                    type="date"
                    value={transfer.date}
                    onChange={(e) => setTransfer({...transfer, date: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowTransferModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Transfer Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
