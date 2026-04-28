import React, { useState, useEffect } from 'react';
import { handleSuccess, handleError } from "../../utils";
import { ToastContainer } from 'react-toastify';
export default function Contact() {
  const api = import.meta.env.VITE_API_URL;
  const [data, setdata] = useState({
    name: '',
    email: '',
    message: '',
  
  });

  // useEffect(() => {
  //   try {
  //     const storedUserId = localStorage.getItem("userid");  
  //     if (storedUserId) {
  //       setdata(prev => ({ ...prev, userId: storedUserId }));
  //     } else {
  //       handleError("User ID not found in local storage.");
  //     }
  //   } catch (error) {
  //     handleError("Error retrieving user ID from local storage:", error);
  //   }
  // }, []);

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api}contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setdata({
        name: '',
        email: '',
        message: '',
        
      })
      if (res.ok) {
        handleSuccess("Message sent successfully");
      } else {
        handleError(responseData.message);
      }

      const responseData = await res.json();
      console.log(responseData);
    } catch (error) {
      handleError("Error submitting form:", error);
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-5">
      <div className="container mx-auto max-w-3xl bg-white shadow-xl rounded-xl p-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-3">Get in Touch</h1>
        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Message</label>
            <textarea 
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-40 resize-none"
              placeholder="How can we help you?"
              name="message"
              value={data.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button 
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </section>
  );
}
