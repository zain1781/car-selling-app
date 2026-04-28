import React from "react";
import img from "../assets/img/bann.png"
import logo from "../assets/img/bg.png"
// Step-by-Step Guide Component
const HowItWorks = () => {
  const steps = [
    {
      title: "Search Vehicles",
      icon: "🔍",
      description: "Browse through our curated collection of premium vehicles with detailed specifications and history reports."
    },
    {
      title: "Place Your Bid",
      icon: "🎯",
      description: "Participate in real-time auctions or choose our convenient Buy Now option with transparent pricing."
    },
    {
      title: "Get Approved & Delivery",
      icon: "✅",
      description: "Quick approval process and doorstep delivery with our white-glove service ensuring complete satisfaction."
    },
    {
      title: "Start Your Journey",
      icon: "🚗",
      description: "Begin your adventure with confidence, backed by our comprehensive after-sales support."
    }
  ];
  
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 text-center w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">Your journey to finding the perfect vehicle starts here</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">Step {index + 1}</h3>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Banner = () => {
  return (
    <div className="">
      <img
        src={img} // Ensure `img` is passed as a prop or imported
        alt="Car Auction Banner"
        className="w-full h-full object-cover"
      />
      
    </div>
  );
};


// Why Choose Us Component
const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Secure Transactions",
      icon: "🔒",
      description: "Bank-level encryption and secure payment gateways for worry-free transactions"
    },
    {
      title: "Verified Listings",
      icon: "✓",
      description: "Every vehicle undergoes thorough inspection and verification process"
    },
    {
      title: "Competitive Pricing",
      icon: "💎",
      description: "Market-leading prices with transparent fee structure"
    },
    {
      title: "Easy Financing",
      icon: "💳",
      description: "Flexible financing options tailored to your needs"
    }
  ];
  
  return (
    <section className="py-24 bg-white text-center w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">Experience the difference with our premium service</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="p-8 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="text-3xl mb-4">{reason.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Customer Testimonials Component
const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "CEO, Tech Solutions",
      review: "The most seamless car buying experience I've ever had. The platform's attention to detail and customer service is unmatched.",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    // ... add more testimonials with roles and images
  ];
  
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100 text-center w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">What Our Clients Say</h2>
        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">Join thousands of satisfied customers</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
              </div>
              <p className="italic text-gray-700 text-lg mb-4">"{testimonial.review}"</p>
              <h4 className="font-bold text-blue-600">{testimonial.name}</h4>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call to Action Component
const CallToAction = () => {
  return (
    <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Find Your Dream Car?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who found their perfect vehicle through our platform</p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
            Browse Listings
          </button>
          <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold border-b-2 border-red-600 inline-block mb-4">Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-600">Home</a></li>
            <li><a href="/about" className="hover:text-red-600">About Us</a></li>
            <li><a href="/contact" className="hover:text-red-600">Contact Us</a></li>
            <li><a href="/car-register" className="hover:text-red-600">Register</a></li>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div>
          <h3 className="text-lg font-semibold border-b-2 border-red-600 inline-block mb-4">Get in touch</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-2">
              <span>📞</span>
              <span>
                For Support & Reservations<br />
                <strong>+92 12345678910</strong><br />
                <strong>+1 (123) 123-4567</strong>
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span>⏰</span>
              <span>
                The Office Hours<br />
                <strong>Monday to Sunday 10:00am to 10:00pm</strong>
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span>📧</span>
              <span>
                Send Us Email<br />
                <strong>info@carauction.com</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 text-white text-sm py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <img src={logo}alt="Logo" className="h-10 mr-3" />
            <p>Copyright © {new Date().getFullYear()} <span className="text-blue-400 font-semibold">Car Auction</span> LLC. All Rights Reserved</p>
          </div>
          <div className="flex space-x-6">
            <a href="/support" className="hover:text-gray-300">Support</a>
            <a href="/terms" className="hover:text-gray-300">Terms & Condition</a>
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};



// Main Component that Combines Everything
export default function File() {
  return (
    <div>
   
      <Banner />
      
      <CallToAction />
      <Footer />
    </div>
  );
}
