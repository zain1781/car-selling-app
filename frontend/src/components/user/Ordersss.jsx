import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Correct import
import { FaExclamationTriangle } from 'react-icons/fa'; // Import an icon for the error

export default function Ordersss() {
  const [data, setData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const api = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // ✅ Correct usage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${api}order/${id}`;
        console.log("Fetching from URL:", url); // Log the URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.order); // Set the order data directly
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (id) {
      fetchData();
    }
  }, [api, id]); // ✅ Dependency array includes `api` and `id`

  if (loading) {
    return <div className="text-center">Loading...</div>; // Loading state
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 rounded-lg p-4 mb-6 flex items-center">
        <FaExclamationTriangle className="mr-2" />
        <div>
          <strong>Error:</strong> {error}
          <p className="mt-1">Please check your connection or try again later.</p>
        </div>
      </div>
    ); // Enhanced error state
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Details</h1>
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">Customer Information</h2>
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Phone:</strong> {data.phone}</p>
              <p><strong>Address:</strong> {data.address}, {data.city}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">Order Information</h2>
              <p><strong>Order ID:</strong> {data._id}</p>
              <p><strong>Car ID:</strong> {data.carId}</p>
              <p><strong>Price:</strong> ${data.price.toLocaleString()}</p>
              <p>
                <strong>Payment Status:</strong>
                <span className={`ml-2 font-bold ${data.payment === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {data.payment.charAt(0).toUpperCase() + data.payment.slice(1)}
                </span>
              </p>
              <p>
                <strong>Order Status:</strong>
                <span className={`ml-2 font-bold ${data.status === 'processing' ? 'text-yellow-600' : 'text-blue-600'}`}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </p>
              <p><strong>Created At:</strong> {data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}</p>
              <p><strong>Updated At:</strong> {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No order details available.</p>
        )}
      </div>
    </div>
  );
}
