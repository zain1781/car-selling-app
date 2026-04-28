import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';

export default function Forgetpass() {
    const url = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${url}users/forgetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                handleSuccess('Password reset link sent to your email');
                navigate('/resetpassword');
            } else {
                handleError(data.message || 'Something went wrong');
            }
        } catch (error) {
            handleError('Error connecting to server');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Forgot Password?</h1>
                    <p className="mt-2 text-gray-600">
                        Don't worry! Enter your email and we'll send you a reset link.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition duration-150 ease-in-out"
                    >
                        Send Reset Link
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
