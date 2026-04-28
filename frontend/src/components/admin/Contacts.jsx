import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../../../utils.js';

export default function Contacts() {
    const url = import.meta.env.VITE_API_URL;
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [error, setError] = useState(null);
    const [messageModal, setMessageModal] = useState({ show: false, message: '' });


    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${url}contact`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setContacts(data);
            setError(null);
        } catch (error) {
            setError("Failed to load messages. Please try again later.");
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${url}contact/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setContacts(contacts.filter(item => item.id !== id));
                setDeleteModal({ show: false, id: null });
                handleSuccess("Message deleted successfully");
                window.location.reload();
            } else {
                throw new Error("Failed to delete record");
            }
        } catch (error) {
            console.error("Error deleting record:", error);
            setError("Failed to delete message. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                    <div className="text-sm text-gray-500">
                        {contacts.length} total messages
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                        <td className="px-6 py-4">
                                        <div className="max-w-xs overflow-hidden text-ellipsis">
  {item.message.substring(0, 10)}...
  <button
  onClick={() => setMessageModal({ show: true, message: item.message })}
  className="bg-blue-500 text-white px-2 py-1 rounded-md mt-1 block"
>
  Show Message
</button>
{messageModal.show && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
      <h3 className="text-lg font-semibold mb-4">Full Message</h3>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{messageModal.message}</p>
      <div className="flex justify-end">
        <button
          onClick={() => setMessageModal({ show: false, message: '' })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
</div>


                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => setDeleteModal({ show: true, id: item._id })}
                                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
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

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}