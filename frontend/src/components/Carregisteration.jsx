import React, { useEffect, useState } from 'react';
import { handleSuccess, handleError } from "../../utils";
import { ToastContainer } from 'react-toastify';

export default function CarRegistration() {
  const url = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    carmodel: '',
    registeraionnumber: '',
    userId: '',
  });
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    if (storedUserId) {
      setUserId(storedUserId);
      setData(prev => ({ ...prev, userId: storedUserId }));
    } else {
      handleError("User ID not found in local storage.");
    }
  }, []);
  console.log(userId)


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${url}registeration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json(); // Try reading the response
  
      if (response.ok) {
        handleSuccess('Car registered successfully!');
        setData({
          name: '',
          email: '',
          phone: '',
          carmodel: '',
          registeraionnumber: '',
          userId: '',
        });
      } else {
        handleError("Server Response:", responseData);
        handleError(`Failed to register: ${responseData.message || "Check input data."}`);
      }
    } catch (error) {
      handleError('Error:', error);
      handleError('An error occurred. Please try again.');
    }
  };
  

  return (
    <section className="text-gray-700 body-font bg-gray-50 min-h-screen">
      <div className="container px-5 py-16 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-bold text-4xl text-gray-900 mb-6">
            Register Your Vehicle
          </h1>
          <p className="leading-relaxed text-lg mb-4">
            Welcome to our vehicle registration portal. Please provide accurate information 
            to ensure a smooth registration process.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-blue-700">
              ℹ️ All fields are required for successful registration
            </p>
          </div>
        </div>
        <div className="lg:w-2/5 md:w-1/2 bg-white rounded-xl shadow-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-2xl font-semibold title-font mb-8">
            Vehicle Registration Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="owner-name" className="text-sm font-medium text-gray-700 block mb-2">
                Owner Name
              </label>
              <input
                type="text"
                id="owner-name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                name="name"
                className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                required
                placeholder="Enter owner's full name"
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                required
                placeholder="Enter phone number"
              />
            </div>

            <div className="relative">
  <label htmlFor="car-model" className="text-sm font-medium text-gray-700 block mb-2">
    Car Model
  </label>
  <select
    id="car-model"
    name="carmodel"
    value={data.carmodel}
    onChange={(e) => setData({ ...data, carmodel: e.target.value })}
    className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
    required
  >
    <option value="">Select Car Model</option>
    <option value="Toyota Corolla 2023">Toyota Corolla 2023</option>
    <option value="Honda Civic 2022">Honda Civic 2022</option>
    <option value="Suzuki Swift 2023">Suzuki Swift 2023</option>
    <option value="Kia Sportage 2022">Kia Sportage 2022</option>
    <option value="Hyundai Elantra 2023">Hyundai Elantra 2023</option>
    <option value="MG HS 2024">MG HS 2024</option>
  </select>
</div>

            <div className="relative">
              <label htmlFor="registration-number" className="text-sm font-medium text-gray-700 block mb-2">
                Registration Number
              </label>
              <input
                type="text"
                id="registration-number"
                name="registeraionnumber"
                value={data.registeraionnumber}
                onChange={(e) => setData({ ...data, registeraionnumber: e.target.value })}
                className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                required
                placeholder="Enter vehicle registration number"
              />
            </div>

            {data.userId ? (
  <button
    type="submit"
    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-8 py-3 text-center transition-colors duration-200 ease-in-out mt-6"
  >
    Register Vehicle
  </button>
) : (
  <button
    type="submit"
    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-8 py-3 text-center transition-colors duration-200 ease-in-out mt-6"
  >
    login please
  </button>
)}

          </form>
          <div className="flex items-center mt-6 text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Your information is encrypted and secure
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
