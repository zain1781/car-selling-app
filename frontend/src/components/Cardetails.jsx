import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NavLink } from 'react-router-dom';
import { FaGreaterThan, FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { handleSuccess, handleError } from '../../utils';
import { ToastContainer } from 'react-toastify';
export default function Cardetails() {
    const [data, setData] = useState({});
   
    // Replace BOTH formData & formDaata with this single state:
const [formData, setFormData] = useState({
    userId: '',
    carId: '',
    name: '',
    email: '',
    phone: '',
    price: '',
    country: '',
    zipCode: '',
    payment: ''
});

const countries = {
    "Pakistan": "+92",
    "Afghanistan": "+93",
    "India": "+91",
    "Bangladesh": "+880",
    "Nepal": "+977",
    "Sri Lanka": "+94",
    "China": "+86",
    "Iran": "+98",
    "Turkey": "+90",
    "Saudi Arabia": "+966",
    "United Arab Emirates": "+971",
    "United States": "+1",
    "Canada": "+1",
    "Germany": "+49",
    "France": "+33",
    "United Kingdom": "+44",
    "Australia": "+61",
    "Malaysia": "+60",
    "Indonesia": "+62",
    "South Africa": "+27",
};

// Unified handler
const handleInputchange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
        setFormData(prev => ({
            ...prev,
            country: value,
            phone: countries[value] || ""
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
};

    const { id } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;
    const upload = import.meta.env.VITE_UPLOADS;

    useEffect(() => {
        const storedUserId = localStorage.getItem("userid");
        if (storedUserId) {
            setFormData(prev => ({ ...prev, userId: storedUserId, carId: id }));
        } else {
            handleError("User ID not found in local storage.");
        }
    }, [id]);

    useEffect(() => {
        fetch(`${apiUrl}inventory/${id}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFormData(prev => ({ ...prev, price: data.price }));
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [id]);
    

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate price against car price
        // if (parseFloat(formData.price) <= data.price) {
        //     handleError("Price must be greater than the listed price of the car.");
        //     return;
        // }

        try {
            const res = await fetch(`${apiUrl}order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const responseData = await res.json();
            if (res.ok) {
                handleSuccess("Order created successfully.");
                // Reset form data
                setFormData({
                    userId: '',
                    carId: id,
                    name: '',
                    email: '',
                    phone: '',
                    price: '',
                    country: '',
                    payment: ''
                });
            } else {
                handleError(responseData.message);
            }
        } catch (error) {
            handleError("Error submitting form:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-gray-700">
                <NavLink to="/inventory" className="text-blue-600 hover:text-blue-800">
                    Home
                </NavLink>
                &nbsp;
                <FaGreaterThan className="text-blue-500 inline mx-1" />
                <span className="text-blue-500">{data.make}</span>
            </p>
            <div className="max-w-7xl mx-auto">
                {/* Main Content Container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Column - Image Slider */}
                        <div className="lg:w-[45%] p-4">
                            <div className="relative rounded-lg overflow-hidden">
                                <Slider {...settings} className="car-slider">
                                    {data?.images?.map((img, index) => (
                                        <div key={index} className="aspect-w-16 aspect-h-9">
                                            <img
                                                alt={`${data.make || 'Car'} view ${index + 1}`}
                                                className="w-full h-[400px] object-cover rounded-lg"
                                                src={`${upload}${img}`}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>

                        {/* Middle Column - Car Details */}
                        <div className="lg:w-[30%] p-6 border-l border-r border-gray-200">
                            <div className="space-y-6">
                                {/* Car Title and Basic Info */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{data.make}</h1>
                                    <p className="text-lg text-gray-600 mt-1">{data.make} {data.model}</p>
                                </div>

                                {/* Price */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-blue-600 font-semibold">Price</p>
                                    <p className="text-3xl font-bold text-blue-700">${data.price?.toLocaleString()}</p>
                                </div>

                                {/* Key Specifications */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Year</p>
                                        <p className="font-semibold text-gray-900">{data.year}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Mileage</p>
                                        <p className="font-semibold text-gray-900">{data.mileage} miles</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Fuel Type</p>
                                        <p className="font-semibold text-gray-900">{data.fuelType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">color</p>
                                        <p className="font-semibold text-gray-900">{data.color}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Port</p>
                                        <p className="font-semibold text-gray-900">{data.portOfLoading}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Edition</p>
                                        <p className="font-semibold text-gray-900">{data.edition}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Transmission</p>
                                        <p className="font-semibold text-gray-900">{data.transmission}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Body Type</p>
                                        <p className="font-semibold text-gray-900">{data.bodyType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-semibold text-gray-900">{data.location}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">sold In Dubai</p>
                                        <p className="font-semibold text-gray-900">{data.soldInDubai}</p>
                                    </div>
                                  
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500">location of Vei</p>
                                        <p className="font-semibold text-gray-900">{data.locationVei}</p>
                                    </div>
                                
                                    


                                </div>

                                {/* Condition Badge */}
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {data.condition} Condition
                                </div>
                                <div className="inline-flex items-center px-3 py-1 m-1 rounded-full text-sm font-medium bg-blue-100 text-white-800">
                                    {data.status}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Purchase Form */}
                        <div className="lg:w-[25%] p-6 bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                <select
    name="country"
    value={formData.country}
    onChange={handleInputchange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="" disabled>Select a country</option>
          {Object.keys(countries).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
      <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleInputchange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
                               
                              

                                <div>
                                    <input
                                        type="text"
                                        name="price"

                                        hidden
                                        placeholder="Offer Price"
                                        value={formData.price || data.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <select
                                        name="payment"
                                        value={formData.payment}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="cash">Cash</option>
                                        <option value="wire">Wire</option>
                                        <option value="wallet">Use Wallet</option>


                                    </select>
                                </div>
                                <button
  type="submit"
  disabled={data.status === "sold"}
  className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
    data.status === "sold"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  Submit Purchase Request
</button>

                            </form>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{data.description}</p>
                            </div>
                            
                            <div className="ml-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Share This Car</h3>
                                <div className="flex space-x-4">
                                    <a 
                                        href={`https://api.whatsapp.com/send?text=Check out this ${data.year} ${data.make} ${data.model} for $${data.price}: ${window.location.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                        aria-label="Share on WhatsApp"
                                    >
                                        <FaWhatsapp size={28} />
                                    </a>
                                    <a 
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                        aria-label="Share on Facebook"
                                    >
                                        <FaFacebook size={28} />
                                    </a>
                                    <button
                                        onClick={() => {
                                            alert('Instagram sharing requires the Instagram app. Copy the URL and share it manually on Instagram.');
                                            navigator.clipboard.writeText(window.location.href);
                                        }}
                                        className="text-pink-600 hover:text-pink-700 transition-colors"
                                        aria-label="Share on Instagram"
                                    >
                                        <FaInstagram size={28} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}
