import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
  AreaChart, Area
} from "recharts";
import {
  FaUsers, FaUserPlus, FaShoppingCart, FaChartPie,
  FaChartBar, FaChartLine, FaSearch, FaDownload,
  FaCalendarAlt, FaSyncAlt, FaFilter, FaEllipsisV
} from "react-icons/fa";
import { format } from "date-fns";

// Professional color palette
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const CHART_COLORS = {
  primary: "#4F46E5",
  secondary: "#10B981",
  tertiary: "#F59E0B",
  quaternary: "#EF4444",
  gradient1: "url(#colorGradient1)",
  gradient2: "url(#colorGradient2)"
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    orders: [],
    registrations: [],
    recentOrders: [],
    recentRegistrations: [],
    ordersByDate: [],
    registrationsByDate: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch orders
      const ordersResponse = await fetch(`${apiUrl}order`);
      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders");
      }
      const ordersData = await ordersResponse.json();

      let orders = [];
      let totalRevenue = 0;

      if (ordersData.message === "Orders fetched successfully." && Array.isArray(ordersData.orders)) {
        orders = ordersData.orders;

        // Calculate total revenue
        totalRevenue = orders.reduce((sum, order) => {
          return sum + (parseFloat(order.price) || 0);
        }, 0);

        // Process orders by date for chart
        const ordersByDate = processDataByDate(orders, 'createdAt');

        setStats(prevStats => ({
          ...prevStats,
          totalOrders: orders.length,
          totalRevenue,
          orders,
          recentOrders: orders.slice(0, 5), // Get 5 most recent orders
          ordersByDate
        }));
      }

      // Fetch registrations
      const registrationsResponse = await fetch(`${apiUrl}registeration`);
      if (!registrationsResponse.ok) {
        throw new Error("Failed to fetch registrations");
      }
      const registrationsData = await registrationsResponse.json();

      if (Array.isArray(registrationsData)) {
        const registrations = registrationsData;

        // Process registrations by date for chart
        const registrationsByDate = processDataByDate(registrations, 'createdAt');

        setStats(prevStats => ({
          ...prevStats,
          totalRegistrations: registrations.length,
          registrations,
          recentRegistrations: registrations.slice(0, 5), // Get 5 most recent registrations
          registrationsByDate
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "An error occurred while fetching data");
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  // Process data by date for charts
  const processDataByDate = (data, dateField) => {
    const dateMap = new Map();

    // Group by date
    data.forEach(item => {
      if (item[dateField]) {
        const date = new Date(item[dateField]);
        const dateStr = format(date, 'yyyy-MM-dd');

        if (dateMap.has(dateStr)) {
          dateMap.set(dateStr, dateMap.get(dateStr) + 1);
        } else {
          dateMap.set(dateStr, 1);
        }
      }
    });

    // Convert to array for charts
    const result = Array.from(dateMap, ([date, count]) => ({ date, count }));

    // Sort by date
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search term
  const filterData = (data) => {
    if (!searchTerm) return data;

    return data.filter(item =>
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item._id && item._id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredOrders = filterData(stats.orders);
  const filteredRegistrations = filterData(stats.registrations);

  // Chart data
  const pieData = [
    { name: "Orders", value: stats.totalOrders, color: COLORS[0] },
    { name: "Registrations", value: stats.totalRegistrations, color: COLORS[1] },
  ];

  const barData = [
    { name: "Orders", value: stats.totalOrders, color: COLORS[0] },
    { name: "Registrations", value: stats.totalRegistrations, color: COLORS[1] },
  ];

  // Line chart data for trends
  const lineData = [...stats.ordersByDate].map((item, index) => {
    const regItem = stats.registrationsByDate.find(r => r.date === item.date) || { count: 0 };
    return {
      date: item.date,
      Orders: item.count,
      Registrations: regItem.count
    };
  });

  // Area chart data for cumulative growth
  const calculateCumulativeData = () => {
    let orderSum = 0;
    let regSum = 0;

    return [...stats.ordersByDate].map((item, index) => {
      const regItem = stats.registrationsByDate.find(r => r.date === item.date) || { count: 0 };
      orderSum += item.count;
      regSum += regItem.count;

      return {
        date: item.date,
        Orders: orderSum,
        Registrations: regSum
      };
    });
  };

  const areaData = calculateCumulativeData();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-xl font-semibold">Total Registrations</h2>
          <p className="text-2xl font-bold mt-2">{stats.totalRegistrations}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div className="bg-white p-6 shadow rounded-lg flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4">Order & Registration Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 shadow rounded-lg flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4">User and Registration Stats</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white p-6 shadow rounded-lg flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4">Orders Table</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">Order ID</th>
                <th className="border border-gray-200 p-2">User</th>
              </tr>
            </thead>
            <tbody>
              {stats.orders.map((order, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="border border-gray-200 p-2">{order._id}</td>
                  <td className="border border-gray-200 p-2">{order.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 shadow rounded-lg flex-1 min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4">Registrations Table</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">User ID</th>
                <th className="border border-gray-200 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {stats.registrations.map((reg, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="border border-gray-200 p-2">{reg._id}</td>
                  <td className="border border-gray-200 p-2">{reg.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
