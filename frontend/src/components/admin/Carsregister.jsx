import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';

export default function Carsregister() {
    const url = import.meta.env.VITE_API_URL;
    const [registerations, setRegisterations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        const fetchRegisterations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${url}registeration`);
                if (!response.ok) {
                    handleError("Failed to fetch data");
                }
                const data = await response.json();
                setRegisterations(data);
            } catch (error) {
                handleError("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRegisterations();
    }, []);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirmDialog(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${url}registeration/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRegisterations(registerations.filter(item => item.id !== deleteId));
                handleSuccess("Record deleted successfully!");
            } else {
                handleError("Failed to delete record.");
            }
        } catch (error) {
            handleError("Error deleting record:", error);
        } finally {
            setShowConfirmDialog(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Registered Cars</h1>
                    <div className="flex gap-4">
                        {/* Add any additional action buttons here */}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {registerations.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.carmodel}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.registeraionnumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <NavLink 
                                                to={`/admin/users/cars/${item.userId}`}
                                                className="text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {item.userId}
                                            </NavLink>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteClick(item._id)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer />
        </div>
    );
}
