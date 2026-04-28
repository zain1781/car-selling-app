import { FaGooglePlay, FaApple } from 'react-icons/fa';
import carAuctionImage from '../assets/img/bg.png'; // Make sure this is the correct path

export default function Dloads() {
  return (
    <div className="bg-gradient-to-r from-red-100 via-blue-100 to-pink-100 p-8 rounded-3xl shadow-2xl max-w-6xl mx-auto mt-14 flex flex-col md:flex-row items-center gap-10 m-4">
      
      {/* Image Section */}
      <div className="w-full md:w-1/2">
        <img
          src={carAuctionImage}
          alt="Car Auction App"
          className="rounded-2xl shadow-xl w-full transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Text and Download Links */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
          Download the Car Auction App
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Discover, bid, and win your next car — all from your phone.
        </p>

        <div className="flex justify-center md:justify-start gap-4 flex-wrap">
          {/* Google Play */}
          <a
            href="#"
            className="flex items-center gap-3 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 shadow-md transition-all duration-300"
          >
            <FaGooglePlay className="text-2xl" />
            <div className="text-left">
              <div className="text-xs">GET IT ON</div>
              <div className="text-base font-semibold">Google Play</div>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            className="flex items-center gap-3 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 shadow-md transition-all duration-300"
          >
            <FaApple className="text-2xl" />
            <div className="text-left">
              <div className="text-xs">Download on the</div>
              <div className="text-base font-semibold">App Store</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
