import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaChartBar, FaMoneyBillWave, FaBuilding, FaUsers, FaFilter, FaDownload, FaSearch } from 'react-icons/fa';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Alldata = () => {
  const api = import.meta.env.VITE_API_URL.endsWith('/')
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL + '/';

  const [orders, setOrders] = useState([]);
  const [rentAssets, setRentAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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


  const totalIncome = orders.reduce(
    (sum, order) => sum + (parseFloat(order.price) || 0),
    0
  );
  const totalRent = rentAssets.reduce(
    (sum, asset) => sum + (parseFloat(asset?.monthly_rent) || 0),
    0
  );
  const totalSalary = employees.reduce(
    (sum, emp) => sum + (parseFloat(emp?.salary) || 0),
    0
  );
const fullamount = totalIncome+ totalRent+totalSalary;
  // Filter functions for search
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
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Prepare filtered data
  const filteredOrders = filterOrders();
  const filteredRentAssets = filterRentAssets();
  const filteredEmployees = filterEmployees();

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

  // Handle chart type toggle
  const toggleChartType = () => {
    setChartType(chartType === 'pie' ? 'bar' : 'pie');
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
          <h2 className="text-2xl font-bold text-gray-800">Financial Dashboard</h2>

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

            <NavLink to="/admin/info/inout">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                <FaFilter className="mr-2" /> IN/OUT View
              </button>
            </NavLink>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Total Income</p>
                <h3 className="text-2xl font-bold">${totalIncome.toLocaleString()}</h3>
                <p className="text-sm mt-2">{orders.length} orders</p>
              </div>
              <FaMoneyBillWave className="text-4xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Total Rent Expenses</p>
                <h3 className="text-2xl font-bold">${totalRent.toLocaleString()}</h3>
                <p className="text-sm mt-2">{rentAssets.length} assets</p>
              </div>
              <FaBuilding className="text-4xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Total Salary Expenses</p>
                <h3 className="text-2xl font-bold">${totalSalary.toLocaleString()}</h3>
                <p className="text-sm mt-2">{employees.length} employees</p>
              </div>
              <FaUsers className="text-4xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Financial Breakdown</h3>
            <button
              onClick={toggleChartType}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              {chartType === 'pie' ? (
                <>
                  <FaChartBar className="mr-1" /> Switch to Bar Chart
                </>
              ) : (
                <>
                  <FaChartPie className="mr-1" /> Switch to Pie Chart
                </>
              )}
            </button>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {chartType === 'pie' ? (
                <Pie
                  data={{
                    labels: ['Income', 'Rent Expenses', 'Salary Expenses'],
                    datasets: [
                      {
                        data: [totalIncome, totalRent, totalSalary],
                        backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
                        hoverOffset: 10,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    maintainAspectRatio: true,
                  }}
                />
              ) : (
                <Bar
                  data={{
                    labels: ['Income', 'Rent Expenses', 'Salary Expenses'],
                    datasets: [
                      {
                        label: 'Amount ($)',
                        data: [totalIncome, totalRent, totalSalary],
                        backgroundColor: ['#4CAF50', '#F44336', '#2196F3'],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `$${context.raw.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '$' + value.toLocaleString();
                          }
                        }
                      }
                    },
                    maintainAspectRatio: true,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-lg font-semibold text-center">
                Total Financial Activity: <span className="text-blue-600">${fullamount.toLocaleString()}</span>
              </p>
              <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-center">
                <div>
                  <p className="text-gray-500">Income</p>
                  <p className="font-semibold text-green-600">${totalIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rent</p>
                  <p className="font-semibold text-red-600">${totalRent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Salary</p>
                  <p className="font-semibold text-blue-600">${totalSalary.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'rent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('rent')}
          >
            Rent Assets
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'employees' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3">Orders</h3>
        <table className="min-w-full border bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Payment</th>
              <th className="py-2 px-4 border">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id || i}>
                <td className="py-2 px-4 border">{i+1}</td>
                <td className="py-2 px-4 border">{order.name}</td>
                <td className="py-2 px-4 border">{order.email}</td>
                <td className="py-2 px-4 border">{order.price}</td>
                <td className="py-2 px-4 border">{order.payment}</td>
                <td className="py-2 px-4 border">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-green-100 font-semibold">
              <td colSpan="2" className="py-2 px-4 text-right">
                Total Income:
              </td>
              <td className="py-2 px-4">{totalIncome.toFixed(2)}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Rent Assets Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Rent Assets</h3>
        <table className="min-w-full border bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Asset ID</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Monthly Rent</th>
              <th className="py-2 px-4 border">Vendor</th>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">End Date</th>
              <th className="py-2 px-4 border">Payment</th>
            </tr>
          </thead>
          <tbody>
            {rentAssets.map((asset, i) => (
              <tr key={asset._id || i}>
                <td className="py-2 px-4 border">{i+1}</td>
                <td className="py-2 px-4 border">{asset.type}</td>
                <td className="py-2 px-4 border">{asset.location}</td>
                <td className="py-2 px-4 border">{asset.monthly_rent}</td>
                <td className="py-2 px-4 border">{asset.vendor}</td>
                <td className="py-2 px-4 border">
                  {new Date(asset.start_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  {asset.end_date ? new Date(asset.end_date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-2 px-4 border">{asset.payment_status}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-red-100 font-semibold">
              <td colSpan="2" className="py-2 px-4 text-right">
                Total Rent:
              </td>
              <td className="py-2 px-4">{totalRent.toFixed(2)}</td>
              <td colSpan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Employees Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Employees</h3>
        <table className="min-w-full border bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Employee ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Salary</th>
              <th className="py-2 px-4 border">Designation</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={emp._id || i}>
                <td className="py-2 px-4 border">{i+1}</td>
                <td className="py-2 px-4 border">{emp.name}</td>
                <td className="py-2 px-4 border">{emp.email}</td>
                <td className="py-2 px-4 border">{emp.phone}</td>
                <td className="py-2 px-4 border">{emp.salary}</td>
                <td className="py-2 px-4 border">{emp.designation}</td>
                <td className="py-2 px-4 border">{emp.role}</td>
                <td className="py-2 px-4 border">{emp.isactive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-yellow-100 font-semibold">
              <td colSpan="3" className="py-2 px-4 text-right">
                Total Salary:
              </td>
              <td className="py-2 px-4">{totalSalary.toFixed(2)}</td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>



    </div>
  );
};

export default Alldata;
