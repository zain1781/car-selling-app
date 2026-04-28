import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaUserTag, FaCheck, FaTimes, FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";

export default function Updateuser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        role: "",
        verified: false,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${apiUrl}users/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = await response.json();
            setFormData({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                country: data.country || "",
                role: data.role || "",
                verified: data.verified || false,
            });
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Failed to load user data");
            toast.error("Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            // Log the data being sent to the server for debugging
            console.log("Sending user data:", formData);

            const response = await fetch(`${apiUrl}users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Get the response data for debugging
            const responseData = await response.json();
            console.log("Server response:", responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update user');
            }

            toast.success("User updated successfully!");
            setTimeout(() => {
                navigate('/admin/users');
            }, 2000);
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Failed to update user");
        } finally {
            setSubmitting(false);
        }
    };

    const roleOptions = ["buyer", "admin", "staff"];
    const countryOptions = [
        "United States", "United Kingdom", "Canada", "Australia",
        "Germany", "France", "India", "Japan", "China", "Brazil",
        "South Africa", "Mexico", "Spain", "Italy", "Russia"
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-500 text-5xl mb-4 flex justify-center">
                        <FaTimes />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error Loading User</h2>
                    <p className="text-gray-600 text-center mb-6">{error}</p>
                    <div className="flex justify-center">
                        <button
                            onClick={fetchUser}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <NavLink to="/admin/users" className="ml-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                            Back to Users
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Update User</h1>
                    <NavLink
                        to="/admin/users"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Users
                    </NavLink>
                </div>

                {/* User Form Card */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <FaUser className="mr-2" /> User Information
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                                    <FaUser className="mr-2 text-blue-600" /> Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user's name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                                    <FaEnvelope className="mr-2 text-blue-600" /> Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user's email"
                                />
                            </div>
                        </div>

                        {/* Phone & Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center">
                                    <FaPhone className="mr-2 text-blue-600" /> Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter user's phone number"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 flex items-center">
                                    <FaGlobe className="mr-2 text-blue-600" /> Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a country</option>
                                    {countryOptions.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Role & Verification */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 flex items-center">
                                    <FaUserTag className="mr-2 text-blue-600" /> Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a role</option>
                                    {roleOptions.map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center h-full pt-8">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="verified"
                                            name="verified"
                                            checked={formData.verified}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition ${formData.verified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.verified ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <div className="ml-3 text-gray-700 font-medium">
                                        {formData.verified ? (
                                            <span className="flex items-center text-green-600">
                                                <FaCheck className="mr-1" /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-gray-500">
                                                <FaTimes className="mr-1" /> Not Verified
                                            </span>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        Update User
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* User ID Info */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{id}</span>
                </div>
            </div>
        </div>
    );
}
