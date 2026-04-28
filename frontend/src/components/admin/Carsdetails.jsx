import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CarDetails() {
    const { id } = useParams();
    const [inventory, setInventory] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user details
                const userResponse = await fetch(`${apiUrl}users/${id}`);
                if (!userResponse.ok) throw new Error(`User not found! Status: ${userResponse.status}`);
                const userData = await userResponse.json();
                setUserInfo(userData);

                // Fetch user's cars
                const carsResponse = await fetch(`${apiUrl}inventory/user/${id}`);
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                    <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700">Error: {error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {userInfo && (
                    <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-95">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">User Profile</h2>
                            <p className="mt-2 text-gray-600">Manage and view user details</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-900">{userInfo.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                                    <p className="text-lg font-semibold text-gray-900">{userInfo.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-95">
                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Car Inventory</h2>
                                <p className="mt-2 text-gray-600">Managing {inventory.length} vehicles</p>
                            </div>
                            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                Total: {inventory.length}
                            </span>
                        </div>
                    </div>
                    
                    {inventory.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {inventory.map(car => (
                                <div key={car._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{car.carName}</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Model</span>
                                            <span className="font-semibold text-gray-900">{car.model}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Year</span>
                                            <span className="font-semibold text-gray-900">{car.year}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Mileage</span>
                                            <span className="font-semibold text-gray-900">{car.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 mt-2">
                                            <span className="text-gray-600 font-medium">Price</span>
                                            <span className="text-lg font-bold text-blue-600">${car.price?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="mt-4 text-lg font-medium text-gray-600">No cars found for this user.</p>
                            <p className="mt-2 text-gray-500">The inventory is currently empty.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

