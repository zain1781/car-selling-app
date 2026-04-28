import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars,FaHeart } from "react-icons/fa";
import { handleSuccess, handleError } from "../../utils";
import { ToastContainer } from 'react-toastify';

const Products = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const upload = import.meta.env.VITE_UPLOADS;
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const auth = localStorage.getItem('userid');

  const categories = ["Sedan", "SUV", "Truck", "Convertible", "Hatchback"];

  useEffect(() => {
    fetch(`${apiUrl}inventory`)
      .then((res) => res.json())
      .then((data) => {
        setCars(data.slice(0, 12));
      })
      .catch((error) => console.error("Error fetching car data:", error));
  }, []);
  console.log(cars);

  const filteredCars = cars.filter((car) => {
    const price = Math.floor(Math.random() * 90000 + 5000);
    return (
      car.make.toLowerCase().includes(search.toLowerCase()) &&
      (minPrice === "" || price >= Number(minPrice)) &&
      (maxPrice === "" || price <= Number(maxPrice))
    );
  });
  const addToWishlist = async (carId) => {
    if (!auth) {
      handleError('Please login to add to wishlist');
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}wishlist/`, {
        method: "POST",
        body: JSON.stringify({ userId: auth, carId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();

      if (response.ok) {
        console.log("Success message:", data.message);
        handleSuccess(data.message);
      } else {
        console.log("Error message:", data.message);
        handleError(data.message || 'Failed to add to wishlist');
      }
      
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      handleError('An error occurred while adding to wishlist');
    }
  };

  return (
    <div className="bg-gray-50 p-8 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Explore Our Premium Cars
      </h2>
      
      {/* Enhanced Filter Section */}
      <div className="mb-6 flex justify-between items-center relative">
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaBars className="text-gray-600" />
            <span className="text-gray-700">Filter Options</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg p-6 w-72 z-50">
              <h3 className="font-semibold mb-4 text-gray-800">Refine Search</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search by car name..."
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
<NavLink to={`/inventory/${car._id}`} className="block relative">
  <img
    alt={car.make}
    className="w-full h-64 object-cover rounded-t-xl"
    src={`${upload}${car.images[0]}`}
    onError={(e) => {
      console.log('Failed to load:', e.target.src);
      e.target.src = 'https://via.placeholder.com/400x300?text=Car+Image';
      e.target.onerror = null;
    }}
  />
</NavLink>
              
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
                  {car.make}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mb-4">
  <p className="text-gray-600 line-clamp-2">
    {car.description}
  </p>
  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
    {car.status}
  </div>
</div>


                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <span className="text-2xl font-bold text-blue-600">
                    ${car.price.toLocaleString()}
                  </span>
                  {(auth?.length || 0) > 0 ? (
  <button 
    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-110"
    title="Add to Wishlist"
  >
    <FaHeart onClick={() => addToWishlist(car._id)} className="text-gray-400 hover:text-red-500 transition-colors duration-200" size={20} />
  </button>
) : (
  <button 
    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-110"
    title="Add to Wishlist"
  >
    <FaHeart 
      onClick={() => handleError('Please login to add to wishlist')} 
      className="text-gray-400 hover:text-red-500 transition-colors duration-200" 
      size={20} 
    />
  </button>
)}


                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <h4 className="text-xl text-gray-600 mb-2">No results found</h4>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Products;



