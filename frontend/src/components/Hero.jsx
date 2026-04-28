import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import mains from '../assets/animation/circle.json';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex items-center justify-center">
      <div className="container mx-auto flex px-6 py-24 md:flex-row flex-col items-center">
        
        {/* Left Content */}
        <div className="lg:w-1/2 md:w-2/3 w-full text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Your Trusted <span className="text-gray-600">Vehicle Marketplace</span>
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Buy, sell, and explore a wide variety of vehicles with confidence. Our platform provides secure transactions,
            financing options, and real-time updates to make your car buying experience smooth and hassle-free.
          </p>

          {/* Additional Information */}
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Wide range of vehicles from trusted auctions</li>
            <li>Easy financing options available</li>
            <li>Real-time tracking and support</li>
          </ul>

          <p className="text-gray-600 italic">Trusted by thousands of car buyers worldwide.</p>
        </div>

        {/* Right Content (Lottie Animation) */}
        <div className="lg:w-1/2 md:w-2/3 w-full flex justify-center mt-10 md:mt-0">
          <Player
            autoplay
            loop
            src={mains}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>
    </section>
  );
}