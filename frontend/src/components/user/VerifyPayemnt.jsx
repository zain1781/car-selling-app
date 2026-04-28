import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


export const VerifyPayment = () => {
    const { token } = useParams();
    const decodedToken = jwtDecode(token);
    
    // Use the decoded token data for payment details initial state
    const [paymentDetails, setPaymentDetails] = useState({
        amount: decodedToken.price || '',
        email: decodedToken.email || '',
        currency: 'USD'
    });

    const handleInputChange = (e) => {
        setPaymentDetails({
            ...paymentDetails,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = (e) => {
        e.preventDefault();
        // Here you would integrate with PayPal API
        console.log('Processing payment:', paymentDetails);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-800">PayPal Payment</h1>
                        <p className="text-sm text-gray-500">Secure payment processing</p>
                    </div>
                    <img 
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                        alt="PayPal Logo"
                        className="h-8 object-contain"
                    />
                </div>

                {/* User Details Section */}
                <div className="border-t border-b py-4">
                    <h2 className="font-medium text-gray-700 mb-2">Customer Information</h2>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {decodedToken.name}</p>
                        <p><span className="font-medium">Email:</span> {decodedToken.email}</p>
                        <p><span className="font-medium">Phone:</span> {decodedToken.phone}</p>
                        <p><span className="font-medium">Address:</span> {decodedToken.address}</p>
                        <p><span className="font-medium">City:</span> {decodedToken.city}</p>
                        <p><span className="font-medium">Amount:</span> ${decodedToken.price}</p>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-6">
                    {/* Amount Input Group */}
                    <div className="space-y-2">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Payment Amount
                        </label>
                        <div className="flex gap-3">
                            <select 
                                name="currency"
                                value={paymentDetails.currency}
                                onChange={handleInputChange}
                                className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={paymentDetails.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Email Input Group */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            PayPal Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={paymentDetails.email}
                            onChange={handleInputChange}
                            placeholder="email@example.com"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Secure payment powered by PayPal</span>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#0070ba] hover:bg-[#003087] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span>Pay with PayPal</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

