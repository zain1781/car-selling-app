// frontend/src/components/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [formData, setFormData] = useState({});
  const api = import.meta.env.VITE_API_URL;
const [count ,setcount] = useState(1)
  useEffect(() => {
    fetchOrders();
    setcount(count + 1);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${api}order`);
      const data = await response.json();
      
      const ordersWithDetails = await Promise.all(
        data.orders.map(async (order) => {
          try {
            // Fetch car data
            const carResponse = await fetch(`${api}inventory/${order.carId}`);
            const carData = carResponse.ok ? await carResponse.json() : null;
            console.log('Car Data:', carData);
  
            // Fetch user data
            const userResponse = await fetch(`${api}users/${order.userId}`);
            const userData = userResponse.ok ? await userResponse.json() : null;
  
            return {
              ...order,
              car: carData
                ? { id: carData._id, name: carData.make || "Unknown", price: carData.price || 0 }
                : { id: "N/A", name: "Unknown", price: 0 },
              user: userData
                ? { id: userData._id, name: userData.name || "Unknown" }
                : { id: "N/A", name: "Unknown" },
            };
          } catch (error) {
            console.error("Error fetching car or user data", error);
            return order;
          }
        })
      );
  
      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await fetch(`${api}order/${id}`, { method: "DELETE" });
      setOrders(orders.filter(order => order._id !== id));
    } catch (error) {
      console.error("Error deleting order", error);
    }
  };
 

  const handleEdit = (order) => {
    setEditOrder(order._id);
    setFormData(order);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${api}order/${editOrder}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setOrders(orders.map(order => (order._id === editOrder ? formData : order)));
      setEditOrder(null);
    } catch (error) {
      console.error("Error updating order", error);
    }
  };

  const handelEst = async (userid, orderid) => {
    try {
      const response = await fetch(`${api}estimation/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userid, orderId: orderid }), // corrected keys
      });
  
      const res = await response.json();
  
      if (!response.ok) {
      alert("Server responded with an error:", res);
      } else {
       alert("Submitted successfully:", res);
      }
  
    } catch (error) {
    alert("An error occurred:", error);
    }
  };
  
  

  const exportToCSV = () => {
    const csvRows = [];
    // Get the headers
    const headers = ['Order ID', 'Order Name', 'Customer', 'Vehicle', 'Car Price', 'Order Price', 'Payment', 'Status'];
    csvRows.push(headers.join(','));

    // Get the data
    orders.forEach(order => {
      const row = [
        order._id,
        order.name,
        order.user.name,
        order.car.name,
        order.car.price.toLocaleString(),
        order.price.toLocaleString(),
        order.payment,
        order.status
      ];
      csvRows.push(row.join(','));
    });

    // Create a Blob from the CSV string
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'orders.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Orders Management</h2>
            <div className="flex gap-2">
              <button 
                onClick={exportToCSV} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Export Orders
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Car Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">estimation</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order , index) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    {editOrder === order._id ? (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-600">{order._id}</td>
                        <td className="px-6 py-4">
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.car.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">${order.car?.price?.toLocaleString() || "0"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">${order.price?.toLocaleString() || "0"}</td>

                        <td className="px-6 py-4">
                          <select
                            name="payment"
                            value={formData.payment}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>

                        <td className="px-6 py-4">
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.name}</td>
                        <td className="px-6 py-4">
                          <NavLink to={`/admin/users/cars/${order.user.id}`} className="text-indigo-600 hover:text-indigo-800">
                            {order.user.name}
                          </NavLink>
                        </td>
                        <td className="px-6 py-4">
                          <NavLink to={`/admin/inventory/cars/${order.car.id}`} className="text-indigo-600 hover:text-indigo-800">
                            {order.car.name}
                          </NavLink>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">${order.car.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">${order.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.payment === 'completed' ? 'bg-green-100 text-green-800' :
                            order.payment === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment}
                          </span>
                        </td>
                        <td><button  onClick={() => handelEst(order.user.id , order._id)}
            className="px-2 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                        >esiitmation</button></td>

                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(order)}
                              className="p-2 text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="p-2 text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                         
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;