import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Signup() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    password: '',
  });
  const countryCodes = [
    { code: "+1", name: "United States" },
    { code: "+44", name: "United Kingdom" },
    { code: "+91", name: "India" },
    { code: "+92", name: "Pakistan" },
    { code: "+93", name: "Afghanistan" },
    { code: "+61", name: "Australia" },
    { code: "+81", name: "Japan" },
    { code: "+49", name: "Germany" },
    { code: "+86", name: "China" },
    { code: "+33", name: "France" },
    { code: "+39", name: "Italy" },
    { code: "+34", name: "Spain" },
    { code: "+971", name: "UAE" },
    { code: "+7", name: "Russia" },
    { code: "+880", name: "Bangladesh" },
    { code: "+62", name: "Indonesia" },
    { code: "+234", name: "Nigeria" },
    { code: "+27", name: "South Africa" },
    { code: "+82", name: "South Korea" },
    { code: "+98", name: "Iran" },
    { code: "+55", name: "Brazil" },
    { code: "+20", name: "Egypt" },
    { code: "+964", name: "Iraq" }
  ];
    
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
  
    try {
      const { name, email, country ,phone, password } = data;
      const response = await fetch(`${apiUrl}users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email,country, phone, password }),
      });
  
      let json;
      try {
        json = await response.json();
      } catch (parseError) {
        handleError("Invalid JSON response from server");
      }
  
      if (!response.ok) {
        handleError(json.message || "Something went wrong");
      }
  
      setData({ name: "", email: "", phone: "", country:"", password: "" });
  
    } catch (error) {
      console.error("Error:", error);
      handleError(error.message || "An unknown error occurred");
    }
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl text-center font-bold mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                required
              />
            </div>

            <div>
  <label className="block mb-2 text-sm font-medium text-gray-900">Country</label>
  <select
    name="country"
    value={data.country}
    onChange={handleChange}
    className="w-full p-3 mb-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
    required
  >
    <option value="" disabled>Select your country</option>
    {countryCodes.map((country, index) => (
      <option key={index} value={country.name}>
        {country.name} ({country.code})
      </option>
    ))}
  </select>

  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
  <div className="flex">
    <input
      type="text"
      readOnly
      value={data.country}
      className="w-1/4 p-3 bg-gray-200 border border-gray-300 text-sm rounded-l-lg text-gray-900"
    />
    <input
      type="text"
      id="phone"
      name="phone"
      value={data.phone}
      onChange={handleChange}
      className="w-3/4 p-3 bg-gray-50 border-t border-b border-r border-gray-300 text-sm rounded-r-lg text-gray-900"
      required
    />
  </div>
</div>


            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  required
                />
                <span 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>

     

        <div className="flex items-start mb-5 mt-4">
          <div className="flex items-center h-5">
            <p>Already have an account?</p>&nbsp;
            <NavLink to="/login" className="text-blue-600 hover:underline">Login</NavLink>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
