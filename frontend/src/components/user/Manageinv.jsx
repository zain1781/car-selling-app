import React, { useState, useEffect } from 'react';

export default function Manageinv() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [editForm, setEditForm] = useState({
        carName: '',
        make: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        fuelType: '',
        transmission: '',
        bodyType: '',
        condition: '',
        description: '',
        status: ''
    });

    useEffect(() => {
        fetchUserInventory();
    }, []);
    const api = import.meta.env.VITE_API_URL;
    const upload = import.meta.env.VITE_UPLOADS;

    const fetchUserInventory = async () => {
        try {
            const userId = localStorage.getItem('userid');
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${api}inventory/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch inventory');
            }
            const data = await response.json();
            setInventory(data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditMode(item._id);
        setEditForm({ ...item });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await fetch(`${api}inventory/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error('Failed to update inventory');
            }

            const updatedItem = await response.json();
            setInventory(inventory.map(item => 
                item._id === id ? updatedItem : item
            ));
            setEditMode(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${api}inventory/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete inventory');
                }

                setInventory(inventory.filter(item => item._id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error && inventory.length === 0) return (
        <div className="text-center p-4 text-gray-500">
            No inventory items found
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Inventory</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map(item => (
                    <div key={item._id} className="border rounded-lg p-4 shadow-sm">
                        {editMode === item._id ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={editForm.carName}
                                    onChange={(e) => setEditForm({...editForm, carName: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    placeholder="Car Name"
                                />
                                <input
                                    type="text"
                                    value={editForm.make}
                                    onChange={(e) => setEditForm({...editForm, make: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    placeholder="Make"
                                />
                                <input
                                    type="text"
                                    value={editForm.model}
                                    onChange={(e) => setEditForm({...editForm, model: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    placeholder="Model"
                                />
                                <input
                                    type="number"
                                    value={editForm.year}
                                    onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    placeholder="Year"
                                />
                                <input
                                    type="number"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    placeholder="Price"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleUpdate(item._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditMode(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img 
                                    src={`${upload}${item.images?.[0] || '/default-car.jpg'}`} 
                                    alt={item.carName}
                                    className="w-full h-48 object-cover rounded-md mb-3"
                                />
                                <h2 className="text-xl font-semibold">{item.carName}</h2>
                                <p className="text-gray-600">{item.make} {item.model} {item.year}</p>
                                <p className="text-lg font-bold">${Number(item.price).toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Mileage: {item.mileage} km</p>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            
            {inventory.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                    No inventory items found
                </div>
            )}
        </div>
    );
}
