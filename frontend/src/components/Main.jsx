import React, { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import mains from '../assets/animation/car.json';
import { NavLink } from 'react-router-dom';
import { FaCar, FaPhone } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Main() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [inventoryItems, setInventoryItems] = useState([]);
  const [carCount, setCarCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [bannerImage, setBannerImage] = useState('');
  const api = import.meta.env.VITE_API_URL;
  const upload = import.meta.env.VITE_UPLOADS;

  useEffect(() => {
    fetch(`${api}inventory/`)
      .then((response) => response.json())
      .then((data) => {
        setInventoryItems(data);
        if (data.length === 0) {
          setBannerImage('https://via.placeholder.com/1200x300?text=No+Items+Available'); // default banner
        }
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
        setBannerImage('https://via.placeholder.com/1200x300?text=Error+Loading+Inventory');
      });
  }, []);

  useEffect(() => {
    const carInterval = setInterval(() => {
      setCarCount((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);

    const orderInterval = setInterval(() => {
      setOrderCount((prev) => (prev < 100 ? prev + 1 : 122));
    }, 30);

    return () => {
      clearInterval(carInterval);
      clearInterval(orderInterval);
    };
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Banner Image */}
      {bannerImage && (
        <div
          className="w-full h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        ></div>
      )}

      <div className="container mx-auto px-6 py-24 flex flex-col-reverse lg:flex-row items-center gap-20">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-800">
            Buy & Sell <span className="text-blue-600">Vehicles</span> with Confidence
          </h1>
          <p className="text-lg text-gray-600">
            Seamlessly purchase vehicles from U.S. auctions and export to the UAE. Track your
            shipments, manage orders, and get full transparency—all from one place.
          </p>

          <div className="flex gap-4 flex-wrap">
            <NavLink to="/inventory">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-md font-medium shadow-md flex items-center gap-2 transition-all">
                <FaCar />
                Explore Listings
              </button>
            </NavLink>
            <NavLink to="/contact">
              <button className="border border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800 py-3 px-6 rounded-full text-md font-medium flex items-center gap-2 transition-all">
                <FaPhone />
                Contact Us
              </button>
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="relative mt-12">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              required
              placeholder="Search by car name..."
              className="p-3 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
            />
            <NavLink to="/inventory">
              <button className="mt-3 absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition">
                Search
              </button>
            </NavLink>
          </div>

          {/* Featured Cars */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Cars</h2>

          {inventoryItems.length > 0 ? (
            <Slider {...settings}>
              {inventoryItems.map((item) => (
                <div key={item._id} className="p-4">
                  <div className="bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <img
                      src={`${upload}${item.images[0]}`}
                      alt={item.carName}
                      className="h-64 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.carName}</h3>
                      <p className="text-blue-600 font-bold">{`$${item.price}`}</p>
                      <p className="text-gray-600">
                        {item.year} | {item.make} {item.model}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center text-lg text-gray-500 font-medium mt-4">
              🚗 No cars available at the moment. Please check back later.
            </div>
          )}

          {/* Counter Section */}
          <div className="mt-12 bg-white border-l-4 border-blue-500 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Achievements</h3>
            <div className="flex space-x-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-blue-600">{carCount}+</h2>
                <p className="text-gray-600">Cars Sold</p>
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-blue-600">{orderCount}+</h2>
                <p className="text-gray-600">Orders Processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Lottie Animation */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
          <Player autoplay loop src={mains} style={{ height: '500px', width: '500px' }} />
        </div>
      </div>
    </section>
  );
}
