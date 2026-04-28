import React, { useState, useEffect } from 'react';
export default function Registercars() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const id = localStorage.getItem('userid');
    if (!id) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-600">Please login to view your registered cars</p>
            </div>
        );
    }
    
    const [registeration, setRegisteration] = useState([]);
    useEffect(() => {
        const fetchRegisteration = async () => {
            const response = await fetch(`${apiUrl}registeration/${id}`);
            const data = await response.json();
            setRegisteration(data);
        }   
        fetchRegisteration();
    }, [id]);       
    console.log(registeration);
    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                My Registered Cars
            </h1>
            
            {registeration.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <p className="mt-4 text-lg text-gray-600">No registered cars found.</p>
                    <p className="mt-2 text-gray-500">Register your first car to see it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registeration.map((car) => (
                        <div 
                            key={car._id} 
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 ml-3">{car.carmodel}</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium w-32">Reg. Number:</span>
                                    <span className="text-gray-600">{car.registeraionnumber}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium w-32">Name:</span>
                                    <span className="text-gray-600">{car.name}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium w-32">Email:</span>
                                    <span className="text-gray-600">{car.email}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium w-32">Phone:</span>
                                    <span className="text-gray-600">{car.phone}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium w-32">Reg. Date:</span>
                                    <span className="text-gray-600">
                                        {new Date(car.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
