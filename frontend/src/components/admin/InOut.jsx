import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import { FaArrowLeft, FaDownload, FaFilter, FaSearch, FaChartPie, FaChartBar, FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const InOut = () => {
  const api = import.meta.env.VITE_API_URL.endsWith('/')
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL + '/';

  const [orders, setOrders] = useState([]);
  const [rentAssets, setRentAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [chartType, setChartType] = useState('both');
  const [showIncomeOnly, setShowIncomeOnly] = useState(false);
  const [showOutcomeOnly, setShowOutcomeOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orderRes, rentRes, empRes] = await Promise.all([
        fetch(`${api}order`),
        fetch(`${api}rentassets`),
        fetch(`${api}employee`),
      ]);

      if (!orderRes.ok) throw new Error("Failed to fetch orders");
      if (!rentRes.ok) throw new Error("Failed to fetch rent assets");
      if (!empRes.ok) throw new Error("Failed to fetch employees");

      const orderData = await orderRes.json();
      const rentData = await rentRes.json();
      const empData = await empRes.json();

      setOrders(Array.isArray(orderData.orders) ? orderData.orders : []);
      setRentAssets(Array.isArray(rentData) ? rentData : []);
      setEmployees(Array.isArray(empData?.data) ? empData.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filterOrders = () => {
    if (!searchTerm) return orders;
    return orders.filter(order =>
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.payment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterRentAssets = () => {
    if (!searchTerm) return rentAssets;
    return rentAssets.filter(asset =>
      asset.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterEmployees = () => {
    if (!searchTerm) return employees;
    return employees.filter(emp =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get filtered data
  const filteredOrders = filterOrders();
  const filteredRentAssets = filterRentAssets();
  const filteredEmployees = filterEmployees();

  const totalIncome = orders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);
  const totalRent = rentAssets.reduce((sum, asset) => sum + (parseFloat(asset?.monthly_rent) || 0), 0);
  const totalSalary = employees.reduce((sum, emp) => sum + (parseFloat(emp?.salary) || 0), 0);
  const totalOutcome = totalRent + totalSalary;
  const fullAmount = totalIncome - totalOutcome;

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Rent", value: totalRent },
    { name: "Salary", value: totalSalary },
  ];

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Rent", amount: totalRent },
    { name: "Salary", amount: totalSalary },
  ];

  const COLORS = ["#4ade80", "#facc15", "#f87171"];

  // Export to CSV function
  const exportToCSV = (data, filename) => {
    if (!data || !data.length) return;

    // Get headers from first object
    const headers = Object.keys(data[0]).filter(key =>
      !key.startsWith('_') && key !== '__v'
    );

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(item =>
        headers.map(header =>
          item[header] !== undefined && item[header] !== null
            ? `"${String(item[header]).replace(/"/g, '""')}"`
            : '""'
        ).join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle filter functions
  const toggleIncomeFilter = () => {
    setShowIncomeOnly(!showIncomeOnly);
    setShowOutcomeOnly(false);
  };

  const toggleOutcomeFilter = () => {
    setShowOutcomeOnly(!showOutcomeOnly);
    setShowIncomeOnly(false);
  };

  // Toggle chart type
  const toggleChartType = () => {
    if (chartType === 'both') setChartType('pie');
    else if (chartType === 'pie') setChartType('bar');
    else setChartType('both');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center">
            <NavLink to="/admin" className="mr-4">
              <button className="flex items-center text-blue-600 hover:text-blue-800">
                <FaArrowLeft className="mr-2" /> Back to Dashboard
              </button>
            </NavLink>
            <h2 className="text-2xl font-bold text-gray-800">Income & Outcome Analysis</h2>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <button
              onClick={() => exportToCSV([...orders, ...rentAssets, ...employees], 'financial_data')}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaDownload className="mr-2" /> Export Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Total Income</p>
                <h3 className="text-2xl font-bold">${totalIncome.toLocaleString()}</h3>
                <p className="text-sm mt-1">{orders.length} orders</p>
              </div>
              <FaArrowUp className="text-3xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Total Outcome</p>
                <h3 className="text-2xl font-bold">${totalOutcome.toLocaleString()}</h3>
                <p className="text-sm mt-1">{rentAssets.length + employees.length} expenses</p>
              </div>
              <FaArrowDown className="text-3xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Net Balance</p>
                <h3 className="text-2xl font-bold">${fullAmount.toLocaleString()}</h3>
                <p className="text-sm mt-1">{fullAmount >= 0 ? 'Profit' : 'Loss'}</p>
              </div>
              <FaMoneyBillWave className="text-3xl opacity-80" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Filter View</p>
                <div className="flex mt-2 space-x-2">
                  <button
                    onClick={toggleIncomeFilter}
                    className={`px-3 py-1 text-xs rounded-full ${
                      showIncomeOnly
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Income Only
                  </button>
                  <button
                    onClick={toggleOutcomeFilter}
                    className={`px-3 py-1 text-xs rounded-full ${
                      showOutcomeOnly
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Outcome Only
                  </button>
                </div>
              </div>
              <button
                onClick={toggleChartType}
                className="text-blue-600 hover:text-blue-800"
              >
                {chartType === 'both' ? <FaChartPie /> : chartType === 'pie' ? <FaChartBar /> : <FaChartPie />}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b mb-6">
          <div className="flex">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'income' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('income')}
            >
              Income
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'outcome' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('outcome')}
            >
              Outcome
            </button>
            <NavLink to="/admin/all/employee">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'employees' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            
            >
              Employees
            </button>
            </NavLink>
          </div>
        </div>

      {/* Income Table */}
      {(activeTab === 'income' || activeTab === 'overview' || !activeTab) && !showOutcomeOnly && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              <span className="flex items-center">
                <FaArrowUp className="text-green-500 mr-2" /> Income - Orders
              </span>
            </h3>
            <button
              onClick={() => exportToCSV(orders, 'income_orders')}
              className="flex items-center text-green-600 hover:text-green-800 text-sm"
            >
              <FaDownload className="mr-1" /> Export Income Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, i) => (
                    <tr key={order._id || i} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">{order.name || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{order.email || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-green-600">
                        ${parseFloat(order.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {order.payment || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                      No income data found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-green-50 border-t">
                  <td colSpan="2" className="py-3 px-4 text-right font-medium">Total Income:</td>
                  <td className="py-3 px-4 font-bold text-green-600">${totalIncome.toLocaleString()}</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Outcome Table */}
      {(activeTab === 'outcome' || activeTab === 'overview' || !activeTab) && !showIncomeOnly && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              <span className="flex items-center">
                <FaArrowDown className="text-red-500 mr-2" /> Outcome - Expenses
              </span>
            </h3>
            <button
              onClick={() => exportToCSV([...rentAssets, ...employees.map(emp => ({ type: 'Salary', ...emp }))], 'outcome_expenses')}
              className="flex items-center text-red-600 hover:text-red-800 text-sm"
            >
              <FaDownload className="mr-1" /> Export Expense Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRentAssets.length > 0 || filteredEmployees.length > 0 ? (
                  <>
                    {filteredRentAssets.map((asset, i) => (
                      <tr key={`rent-${asset._id || i}`} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Rent
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {asset.type || 'N/A'} - {asset.location || 'N/A'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-red-600">
                          ${parseFloat(asset.monthly_rent).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            asset.payment_status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : asset.payment_status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {asset.payment_status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.map((emp, i) => (
                      <tr key={`emp-${emp._id || i}`} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Salary
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {emp.name || 'N/A'} - {emp.designation || 'N/A'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-red-600">
                          ${parseFloat(emp.salary).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            emp.isactive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {emp.isactive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                      No expense data found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-red-50 border-t">
                  <td colSpan="2" className="py-3 px-4 text-right font-medium">Total Outcome:</td>
                  <td className="py-3 px-4 font-bold text-red-600">${totalOutcome.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {(activeTab === 'overview' || !activeTab) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Financial Overview</h3>
            <button
              onClick={toggleChartType}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              {chartType === 'both' ? (
                <>
                  <FaChartPie className="mr-1" /> Show Pie Chart Only
                </>
              ) : chartType === 'pie' ? (
                <>
                  <FaChartBar className="mr-1" /> Show Bar Chart Only
                </>
              ) : (
                <>
                  <FaChartPie className="mr-1" /> Show Both Charts
                </>
              )}
            </button>
          </div>

          <div className={`grid grid-cols-1 ${chartType === 'both' ? 'md:grid-cols-2' : ''} gap-6`}>
            {(chartType === 'pie' || chartType === 'both') && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Income vs Outcome Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-4">
                    {pieData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(chartType === 'bar' || chartType === 'both') && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Financial Breakdown</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                    />
                    <Bar
                      dataKey="amount"
                      name="Financial Amount"
                      radius={[4, 4, 0, 0]}
                    >
                      {barData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-500">Net Balance</p>
                <p className={`text-2xl font-bold ${fullAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${fullAmount.toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${totalIncome.toLocaleString()}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">Outcome</p>
                  <p className="text-lg font-semibold text-red-600">
                    ${totalOutcome.toLocaleString()}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">Ratio</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {totalOutcome > 0 ? (totalIncome / totalOutcome).toFixed(2) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Table */}
      {(activeTab === 'employees' || !activeTab) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              <span className="flex items-center">
                <FaUsers className="text-blue-500 mr-2" /> Employee Details
              </span>
            </h3>
            <button
              onClick={() => exportToCSV(employees, 'employee_details')}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <FaDownload className="mr-1" /> Export Employee Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp, i) => (
                    <tr key={`emp-details-${emp._id || i}`} className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap font-medium">{emp.name || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{emp.email || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {emp.designation || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-blue-600">
                        ${parseFloat(emp.salary).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          emp.isactive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {emp.isactive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                      No employee data found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 border-t">
                  <td colSpan="3" className="py-3 px-4 text-right font-medium">Total Salary Expense:</td>
                  <td className="py-3 px-4 font-bold text-blue-600">${totalSalary.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Financial Summary</h3>
          <div className="inline-block bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Outcome</p>
                <p className="text-xl font-bold text-red-600">${totalOutcome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Net Balance</p>
                <p className={`text-xl font-bold ${fullAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${fullAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

export default InOut;
