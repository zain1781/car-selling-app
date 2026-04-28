import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}users/login`, {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch');
      }
  
      const result = await response.json(); // Parse response JSON
      const {success, name, jwtToken, email, id} = result;
      const decodedToken = jwtDecode(jwtToken);
      const role = decodedToken.role;
      console.log(role)
      // Add debugging logs
      console.log('Login Response:', result);
      console.log('Decoded Token:', decodedToken);
      console.log('Role:', role);

      if(success) {
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('user', name);
        localStorage.setItem('userid', id);
        localStorage.setItem('email', email);

        handleSuccess("User login successful");
        setData({ email: "", password: "" });

        if (role === "staff" || role === "admin") {
          console.log("Navigating to admin...");
          navigate('/admin');
        } else if (role === "buyer" || role === "employee") {
          console.log("Navigating to home...");
          window.location.href = '/';
        } else {
          console.log("Unknown role:", role);
          setErrorMessage("Invalid user role");
        }
      }
  
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-3xl text-center font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5 relative">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
            <span 
              onClick={togglePasswordVisibility} 
              className="absolute right-3 mt-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button 
            type="submit" 
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Not Registered? 
            <NavLink to='/signup' className="text-blue-600 hover:underline"> Signup</NavLink>
          </p>
          <p className="text-sm text-gray-600">Forget Password? 
            <NavLink to='/user/change-pass' className="text-blue-600 hover:underline"> click me</NavLink>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
