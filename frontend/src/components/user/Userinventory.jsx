import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Userinventory() {
    const { id } = useParams();
    const [inventory, setInventory] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const userid = localStorage.getItem("userid");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user details
                const userResponse = await fetch(`${apiUrl}users/${userid}`);
                if (!userResponse.ok) throw new Error(`User not found! Status: ${userResponse.status}`);
                const userData = await userResponse.json();
                setUserInfo(userData);

                // Fetch user's cars
                const carsResponse = await fetch(`${apiUrl}inventory/user/${userid}`);
                if (!carsResponse.ok) throw new Error(`Inventory fetch failed! Status: ${carsResponse.status}`);
                const carsData = await carsResponse.json();
                
                setInventory(Array.isArray(carsData) ? carsData : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, apiUrl]);

    const handleDelete = async (carId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this car?");
        if (confirmDelete) {
            try {
                const response = await fetch(`${apiUrl}inventory/${carId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error(`Delete failed! Status: ${response.status}`);
                setInventory(inventory.filter(car => car._id !== carId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error && inventory.length === 0) return (
        <p className="text-center text-gray-500">No inventory items found</p>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
 <p className="text-sm font-medium text-gray-700">
                <NavLink to="/user/dashboard" className="text-blue-600 hover:text-blue-800">
                    Home
                </NavLink>
                &nbsp;
            </p>
            <div className="max-w-7xl mx-auto">
                {userInfo && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {userInfo.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-3xl font-bold text-gray-900">{userInfo.name}</h2>
                                <p className="text-gray-600">{userInfo.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Car Inventory</h2>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {inventory.length} Cars
                        </span>
                    </div>

                    {inventory.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {inventory.map(car => (
                                <div key={car._id} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-white relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleDelete(car._id)} 
                                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{car.carName}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-20 font-medium">Model:</span>
                                            <span>{car.model}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-20 font-medium">Year:</span>
                                            <span>{car.year}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-20 font-medium">Mileage:</span>
                                            <span>{car.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-20 font-medium">Price:</span>
                                            <span className="text-green-600 font-semibold">${car.price?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-lg shadow-md">
                            <div className="flex flex-col items-center">
                                <img src="/path/to/your/icon.png" alt="No Inventory" className="w-16 h-16 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800">No Inventory Items Found</h2>
                                <p className="text-gray-600">It seems you don't have any items in your inventory. Please add some!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
