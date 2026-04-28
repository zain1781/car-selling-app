import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess,handleError } from '../../../utils.js'

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);

    const apiUrl = import.meta.env.VITE_API_URL;
    const upload = import.meta.env.VITE_UPLOADS;
    const userId = localStorage.getItem('userid');

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`${apiUrl}wishlist/${userId}`);
                const data = await response.json();
                setWishlist(data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };
        fetchWishlist();
    }, [userId]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${apiUrl}inventory`);
                const cars = await response.json();

                // Extract carIds from the wishlist and filter the inventory
                const wishlistCarIds = wishlist.map(item => item.carId);
                const filtered = cars.filter(car => wishlistCarIds.includes(car._id));

                setFilteredCars(filtered);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        if (wishlist.length > 0) {
            fetchCars();
        }
    }, [wishlist]);
    const handleDelete = async (carId) => {
        try {
            const response = await fetch(`${apiUrl}wishlist/${userId}/${carId}`, {
                method: 'DELETE',
            });
            console.log("response",response);
            if (response.ok) {
                handleSuccess('Car removed from wishlist');
            } else {
                handleError('Failed to remove car from wishlist');
            }
        } catch (error) {
            console.error('Error deleting wishlist item:', error);
        }
    }      


    return (
        <div className="bg-gray-50 p-8 min-h-screen">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
                Explore Your Wishlist
            </h2>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredCars.length > 0 ? (
                    filteredCars.map(car => (
                        <div key={car._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                            <NavLink to={`/inventory/${car._id}`} className="block relative">
                                <img
                                    alt={car.carName}
                                    className="w-full h-64 object-cover rounded-t-xl"
                                    src={`${upload}${car.images[0]}`}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=Car+Image';
                                    }}
                                />
                            </NavLink>

                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
                                    {car.carName}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {car.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${car.price.toLocaleString()}
                                    </span>
                                </div>
                                <button onClick={() => handleDelete(car._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <h4 className="text-xl text-gray-600 mb-2">No cars in your wishlist</h4>
                        <p className="text-gray-500">Add cars to see them here</p>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}
