import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


export default function Allrecords() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchUserShipment();
    }, []);

    const fetchUserShipment = async () => {
        try {
            const userId = localStorage.getItem('userid');
            if (!userId) {
                setLoading(false);
                return;
            }
            const url = `${api}shipment/user/${userId}`;
            const response = await fetch(url);
            if (response.status === 404) {
                setShipments([]);
                setLoading(false);
                return;
            }
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const shipmentsArray = Array.isArray(data) ? data : [data];
            const sortedShipments = shipmentsArray.sort((a, b) =>
                new Date(b.ShipmentDate) - new Date(a.ShipmentDate)
            );
            setShipments(sortedShipments);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shipments:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!shipments || shipments.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <h2 className="text-2xl font-semibold mb-2">No Active Shipments</h2>
                    <p>There are no shipments to track at this time.</p>
                </div>
            </div>
        );
    }

    // Calculate totals
    const totalPrice = shipments.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
    const tax = totalPrice * 0.05;
    const grandTotal = totalPrice + tax;

    const statusCounts = shipments.reduce((acc, s) => {
        acc[s.ShipmentStatus] = (acc[s.ShipmentStatus] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(status => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: statusCounts[status],
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733'];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Shipment Financial Overview
                </h1>

                {/* PieChart Full Width */}
                <div className="w-full h-[300px] md:h-[400px] mb-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={130}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Shipment Table */}
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-700">Tracking ID</th>
                                <th className="py-3 px-4 text-left text-gray-700">Order ID</th>
                                <th className="py-3 px-4 text-left text-gray-700">Shipment Date</th>
                                <th className="py-3 px-4 text-left text-gray-700">Address</th>
                                <th className="py-3 px-4 text-left text-gray-700">Status</th>
                                <th className="py-3 px-4 text-left text-gray-700">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-100 transition">
                                    <td className="py-2 px-4 border-b">{s._id}</td>
                                    <td className="py-2 px-4 border-b">
  <NavLink to={`/user/data/${s.OrderId}`}>{s.OrderId}</NavLink>
</td>
                                    <td className="py-2 px-4 border-b">{new Date(s.ShipmentDate).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b">{s.ShipmentAddress}</td>
                                    <td className="py-2 px-4 border-b capitalize">{s.ShipmentStatus.replace('_', ' ')}</td>
                                    <td className="py-2 px-4 border-b">
                                        ${s.totalPrice ? s.totalPrice.toFixed(2) : '0.00'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-medium">
                            <tr>
                                <td colSpan="5" className="py-2 px-4 text-right">Total Price:</td>
                                <td className="py-2 px-4">${totalPrice.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="5" className="py-2 px-4 text-right">Tax (5%):</td>
                                <td className="py-2 px-4">${tax.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="5" className="py-2 px-4 text-right">Grand Total:</td>
                                <td className="py-2 px-4">${grandTotal.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
