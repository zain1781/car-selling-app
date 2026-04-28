import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function CarsInventory() {
    const url = import.meta.env.VITE_API_URL;
    const upload = import.meta.env.VITE_UPLOADS;
    
    const [cars, setCars] = useState([]); 
    const [offers, setOffers] = useState({}); 
    const [users, setUsers] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${url}inventory/${id}`);
                if (!response.ok) throw new Error("Failed to fetch car inventory");
                const data = await response.json();
                const carsData = Array.isArray(data) ? data : [data];

                setCars(carsData);

                // Fetch user details for each car
                const userIds = [...new Set(carsData.map(car => car.userId))]; // Get unique user IDs
                fetchUsers(userIds);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [id]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch(`${url}offers`);
                if (!response.ok) throw new Error("Failed to fetch offers");
                const data = await response.json();

                // Convert offers to a lookup object by car ID
                const offersMap = {};
                data.forEach(offer => {
                    offersMap[offer.carId] = offer.offerDetail;
                });
                setOffers(offersMap);
            } catch (error) {
                console.error("Error fetching offers:", error.message);
            }
        };

        fetchOffers();
    }, []);

    // Fetch user data for each unique userId
    const fetchUsers = async (userIds) => {
        try {
            const userMap = {};
            await Promise.all(userIds.map(async (userId) => {
                if (!userId) return;
                const response = await fetch(`${url}users/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    userMap[userId] = { name: userData.name, email: userData.email };
                } else {
                    userMap[userId] = { name: "Unknown", email: "N/A" };
                }
            }));
            setUsers(userMap);
        } catch (error) {
            console.error("Error fetching user details:", error.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading inventory...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h2 className="text-red-600 font-semibold text-lg">Error</h2>
                <p className="text-red-500 mt-2">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Cars Inventory</h1>
                <p className="text-gray-600 mt-2">Manage and track your vehicle inventory and offers</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Details</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offers</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Information</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cars.length > 0 ? (
                                cars.map((car) => (
                                    <tr key={car._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img 
                                                src={car.images?.length ? `${upload}${car.images[0]}` : "/placeholder.jpg"} 
                                                alt={car.carName || "Car Image"} 
                                                className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{car.carName || "N/A"}</div>
                                            <div className="text-sm text-gray-500">ID: {car._id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                                ${car.price?.toLocaleString() || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium
                                                ${offers[car._id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {offers[car._id] || "No offers"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{users[car.userId]?.name || "Unknown"}</div>
                                            <div className="text-sm text-gray-500">{users[car.userId]?.email || "N/A"}</div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="text-gray-500 text-lg">No cars available in inventory</div>
                                        <p className="text-gray-400 text-sm mt-2">Cars will appear here once added to the system</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
