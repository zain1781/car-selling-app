import React, { useState, useEffect } from 'react';
import { FaTruck, FaBox, FaCheckCircle, FaCar, FaUser, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
export default function Traceshipment() {
    const [count, setcount] = useState(1);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [modalType, setModalType] = useState(null); // 'car' or 'user'
    const api = import.meta.env.VITE_API_URL;
    const baseUrl = import.meta.env.VITE_UPLOADS;

    useEffect(() => {
        fetchShipments();
        setcount(count + 1);
    }, []);

    const fetchShipments = async () => {
        try {
            const response = await fetch(`${api}shipment`);
            const data = await response.json();
            setShipments(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shipments:", error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (shipmentId, newStatus) => {
        try {
            const response = await fetch(`${api}shipment/${shipmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ShipmentStatus: newStatus }),
            });
            if (response.ok) {
                fetchShipments(); // Refresh the list
            }
        } catch (error) {
            console.error("Error updating shipment:", error);
        }
    };

    const fetchCarInfo = async (carId) => {
        try {
            const response = await fetch(`${api}inventory/${carId}`);
            const data = await response.json();
            setSelectedInfo(data);
            setModalType('car');
        } catch (error) {
            console.error("Error fetching car info:", error);
        }
    };

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`${api}users/${userId}`);
            const data = await response.json();
            setSelectedInfo(data);
            setModalType('user');
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

   
    
    const handleDeleteShipment = async (shipmentId) => {
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            try {
                const response = await fetch(`${api}shipment/${shipmentId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchShipments(); // Refresh the list after deletion
                }
            } catch (error) {
                console.error("Error deleting shipment:", error);
            }
        }
    };

    const InfoModal = () => {
        if (!selectedInfo) return null;

        return (
            <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            {modalType === 'car' ? 'Car Information' : 'User Information'}
                        </h3>
                        <button
                            onClick={() => setSelectedInfo(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    
                    {modalType === 'car' ? (
                        <div className="space-y-3">
                            {selectedInfo.images && selectedInfo.images[0] && (
                                <img 
                                src={`${baseUrl}${selectedInfo.images[0]}`}

                                    alt="Car" 
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            )}
                            <p><span className="font-semibold">Name:</span> {selectedInfo.make}</p>
                            <p><span className="font-semibold">Price:</span> ${selectedInfo.price}</p>
                            <p><span className="font-semibold">Model:</span> {selectedInfo.model}</p>
                            <p><span className="font-semibold">user offer:</span> {selectedInfo.price}</p>
                            <p><span className="font-semibold">Brand:</span> {selectedInfo.brand}</p>
                            <p><span className="font-semibold">Status:</span> {selectedInfo.status}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p><span className="font-semibold">Name:</span> {selectedInfo.name}</p>
                            <p><span className="font-semibold">Email:</span> {selectedInfo.email}</p>
                            <p><span className="font-semibold">Phone:</span> {selectedInfo.phone}</p>
                            <p><span className="font-semibold">Address:</span> {selectedInfo.address}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'preparing':
                return <FaBox className="text-yellow-500" />;
            case 'in_transit':
                return <FaTruck className="text-blue-500" />;
            case 'delivered':
                return <FaCheckCircle className="text-green-500" />;
            default:
                return null;
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_transit':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }
   
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Shipment Tracking</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <FaBox className="text-yellow-500" />
                                <span className="text-sm text-gray-600">Preparing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaTruck className="text-blue-500" />
                                <span className="text-sm text-gray-600">In Transit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" />
                                <span className="text-sm text-gray-600">Delivered</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order number</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Estimation ID</th>                               
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Shipping Address</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Info</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {shipments.map((shipment, index) => (
                                    <tr key={shipment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                           {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <NavLink to={`/admin/orders/${shipment.OrderId}`} className="text-red-400">{shipment.OrderId.slice(0, 7) + '...'}</NavLink>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                           <NavLink to={`/admin/estimated/${shipment.EstimationId}`} className="text-red-400">  {shipment.EstimationId.slice(0, 7) + '...'}</NavLink>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {shipment.ShipmentCity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(shipment.ShipmentDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusIcon(shipment.ShipmentStatus)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(shipment.ShipmentStatus)}`}>
                                                    {shipment.ShipmentStatus}
                                                </span>
                                            </div>
                                           
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => fetchCarInfo(shipment.InventoryId)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <FaCar />
                                                    <span className="text-sm">Car</span>
                                                </button>
                                                <button
                                                    onClick={() => fetchUserInfo(shipment.UserId)}
                                                    className="p-2 text-green-600 hover:text-green-800 flex items-center gap-1"
                                                >
                                                    <FaUser />
                                                    <span className="text-sm">User</span>
                                                </button>
                                            </div>
                                        
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={shipment.ShipmentStatus}
                                                    onChange={(e) => handleStatusUpdate(shipment._id, e.target.value)}
                                                >
                                                    <option value="preparing">Preparing</option>
                                                    <option value="in_transit">In Transit</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                                
                                                <button
                                                    onClick={() => handleDeleteShipment(shipment._id)}
                                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <FaTimes />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <InfoModal />
        </div>
    );
}
