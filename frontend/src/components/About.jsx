import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6 md:px-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Car Auctions </h1>
        <p className="text-lg text-gray-700">
          At Car Auticonn, we specialize in delivering cutting-edge automotive
          connectivity solutions to enhance vehicle performance, safety, and user experience.
        </p>
      </div>

      {/* Company Information */}
      <div className="mt-12 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p className="text-gray-600 mt-2">
            To revolutionize the automotive industry by providing seamless and smart
            connectivity solutions that ensure efficiency, security, and convenience.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Why Choose Us?</h2>
          <p className="text-gray-600 mt-2">
            Our team of experts is dedicated to integrating AI-driven and IoT-powered
            technologies into automobiles, ensuring real-time connectivity and
            advanced automation.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Our Key Features</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Smart Connectivity</h3>
            <p className="text-gray-600 mt-2">Seamless integration with IoT and AI for smart vehicle management.</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Safety & Security</h3>
            <p className="text-gray-600 mt-2">Advanced monitoring systems to ensure driver and passenger safety.</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">Efficient Performance</h3>
            <p className="text-gray-600 mt-2">Optimized vehicle performance with real-time analytics and automation.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
        <p className="text-gray-600 mt-2">Partner with us to redefine the future of automotive technology.</p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;
