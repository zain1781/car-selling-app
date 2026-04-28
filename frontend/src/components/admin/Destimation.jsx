import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Destimation = () => {
  const { id } = useParams();
  const [estimation, setEstimation] = useState(null);
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch estimation
        const estRes = await fetch(`${api}estimation/${id}`);
        if (!estRes.ok) throw new Error("Estimation not found");
        const estData = await estRes.json();
        setEstimation(estData);

        // Fetch user
        const userRes = await fetch(`${api}users/${estData.userId}`);
        if (!userRes.ok) throw new Error("User not found");
        const userData = await userRes.json();
        setUser(userData);

        // Fetch order
        const orderRes = await fetch(`${api}order/${estData.orderId}`);
        if (!orderRes.ok) throw new Error("Order not found");
        const orderData = await orderRes.json();
        
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Estimation Overview</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Field</th>
              <th className="px-6 py-3 text-left">Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {/* Estimation */}
            <tr className="border-b"><td className="px-6 py-4 font-medium">Estimation ID</td><td className="px-6 py-4">{estimation._id}</td></tr>
            <tr className="border-b"><td className="px-6 py-4 font-medium">Tax</td><td className="px-6 py-4">{(estimation.Tax * 100).toFixed(2)}%</td></tr>
            <tr className="border-b">
              <td className="px-6 py-4 font-medium">Approved</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${estimation.approved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {estimation.approved ? "Yes" : "No"}
                </span>
              </td>
            </tr>
            <tr className="border-b"><td className="px-6 py-4 font-medium">Created At</td><td className="px-6 py-4">{new Date(estimation.createdAt).toLocaleString()}</td></tr>

            {/* User Info */}
            <tr className="bg-gray-50"><td colSpan="2" className="px-6 py-4 font-semibold text-gray-700">User Information</td></tr>
            <tr className="border-b"><td className="px-6 py-4 font-medium">User ID</td><td className="px-6 py-4">{user._id}</td></tr>
            <tr className="border-b"><td className="px-6 py-4 font-medium">Name</td><td className="px-6 py-4">{user.name}</td></tr>
            <tr className="border-b"><td className="px-6 py-4 font-medium">Email</td><td className="px-6 py-4">{user.email}</td></tr>

            {/* Order Info */}
            <tr className="bg-gray-50"><td colSpan="2" className="px-6 py-4 font-semibold text-gray-700">Order Information</td></tr>
            <tr className="border-b"><td className="px-6 py-4 font-medium">Order ID</td><td className="px-6 py-4">{order.order._id}</td></tr>
            <tr className="border.order-b"><td className="px-6 py-4 font-medium">Product</td><td className="px-6 py-4">{order.order.name || "N/A"}</td></tr>
            <tr><td className="px-6 py-4 font-medium">Amount</td><td className="px-6 py-4">{order.order.price ? `$${order.order.price}` : "N/A"}</td></tr>



            <tr>
  <td className="px-6 py-4 font-medium">Total Amount</td>
  <td className="px-6 py-4">
    ${ (order.order.price * 1.05).toFixed(2) }/-
  </td>
</tr>


          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Destimation;
