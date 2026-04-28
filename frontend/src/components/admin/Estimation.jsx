import React, { useEffect, useState } from 'react';
import { FaUnlock } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Estimation = () => {
  const [data, setData] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  const handleShipment = async (orderId, estimationId) => {
    try {
      const response = await fetch(`${api}shipment/create`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ OrderId: orderId, EstimationId: estimationId })
      });

      const result = await response.json();

      if (response.ok) {
        await fetchApprovals();
        alert('✅ Shipment created successfully');
      } else {
        alert(result.message || '❌ Shipment creation failed');
      }
    } catch (error) {
      console.error("Error creating shipment", error);
      alert('❌ Error creating shipment');
    }
  };

  const fetchApprovals = async () => {
    try {
      const res = await fetch(`${api}estimation`);
      const approvals = await res.json();

      const enrichedData = await Promise.all(
        approvals.map(async (item) => {
          try {
            const userRes = await fetch(`${api}users/${item.userId}`);
            const orderRes = await fetch(`${api}order/${item.orderId}`);

            if (!userRes.ok || !orderRes.ok) return null;

            const user = await userRes.json();
            console.log(user)
            const { order } = await orderRes.json();

            return {
              ...item,
              user,
              order,
              taxAmount: order?.price * (item.Tax ?? 0),
            };
          } catch {
            return null;
          }
        })
      );

      setData(enrichedData.filter(Boolean));
    } catch (err) {
      console.error('Error fetching approvals:', err);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Shipment Approvals</h2>
      <table className="min-w-full table-auto text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b font-medium">ID</th>
            <th className="p-3 border-b font-medium">User Name</th>
            <th className="p-3 border-b font-medium">Order Price</th>
            <th className="p-3 border-b font-medium">Tax Amount</th>
            <th className="p-3 border-b font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50 transition-all">
                <td className="p-3 border-b"><NavLink className="text-blue-500" to={`/admin/info/${d._id}`}>{d._id}</NavLink></td>
                <td className="p-3 border-b">{d.user?.name || 'N/A'}</td>
                <td className="p-3 border-b">${d.order?.price?.toFixed(2) || '0.00'}</td>
                <td className="p-3 border-b">${d.taxAmount?.toFixed(2) || '0.00'}</td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() => handleShipment(d.order._id, d._id)}
                    className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                    title="Approve"
                  >
                    <FaUnlock className="mr-1" /> Approve
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Estimation;
