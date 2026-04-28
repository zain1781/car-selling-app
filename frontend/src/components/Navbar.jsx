import { useEffect, useState } from "react";
import { FaUserAlt ,FaFacebook ,FaInstagram ,FaWhatsapp ,FaYoutube  } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import img from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Ensure stored data is parsed
      } catch (error) {
        setUser(storedUser); // Fallback if it's just a plain string
      }
    }
  }, []);
  const fetchWallet = async () => {
    try {
      const response = await fetch(`${api}wallet/`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch wallet");
      }
      const data = await response.json();
      const userId = localStorage.getItem("userid");
      const filteredWallets = Array.isArray(data.wallets)
        ? data.wallets.filter((wallet) => wallet.userId === userId)
        : [];
      console.log(filteredWallets); // Log to check the structure of the wallets
      setWallets(filteredWallets);
    } catch (err) {
     console.log(err)
    }
  };
  
  useEffect(() => {
    fetchWallet();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userid");

    navigate("/");

    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <header className="bg-white lg:py-4 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between h-16 bg-white lg:rounded-md lg:h-20 lg:px-8 lg:py-4">
            <div className="flex-shrink-0 transition-transform hover:scale-105">
              <NavLink to="/" title="Logo" className="flex">
                <img src={img} alt="Logo" width={50} height={50} className="object-contain" />
              </NavLink>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="inline-flex p-2 ml-5 text-black transition-all duration-200 rounded-md lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>

            {/* Desktop Menu */}
            <div className="hidden ml-10 lg:flex lg:items-center lg:mr-auto lg:space-x-8">
              {[
                { to: "/", label: "Home" },
                { to: "/inventory", label: "Inventory" },
                { to: "/about", label: "About Us" },
                { to: "/download", label: "Downloads" },
                { to: "/contact", label: "Contact us" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-base font-medium transition-all duration-200 hover:text-blue-600 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-[-4px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform ${
                      isActive ? "text-blue-600 after:scale-x-100" : "text-gray-700"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
                          <div className="flex">
                            <a href="https://facebook,com"><FaFacebook className="icon m-1"/></a>
                            <a href="https://instagram.com"><FaInstagram className="icon m-1"/></a>
                            <a href="https://whatsapp.com"><FaWhatsapp className="icon m-1"/></a>
                            <a href="https://youtube.com"><FaYoutube className="icon m-1"/></a>
                            
                            
                            
                            
                            </div>

            </div>

            {/* User Dropdown */}
            <div className="hidden lg:flex lg:items-center">
              {user ? (
                <div className="relative">
                 <div className="flex"> <button 
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {(typeof user === "string" ? user : user?.name || "U")[0].toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-700">
                      {typeof user === "string" ? user : user?.name || "User"}
                    </span>
                  </button>
                  </div>
                 
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-2 w-48 transition-all duration-200 ease-in-out">
                          <NavLink
                            to="/user/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                          >
                            <span>Dashboard</span>
                          </NavLink>
                          <NavLink
                            to="/user/wishlist"
                            className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                          >
                            <span>Wishlist</span>
                          </NavLink>

                      <NavLink to='/user/wallet'> <button
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors duration-200 w-full text-left"
                      >
                                                <small>Amount : ${wallets.length > 0 ? wallets[0].amount : 0}</small>

                      </button></NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors duration-200 w-full text-left"
                      >
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink 
                  to="/login" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaUserAlt />
                  <span>Login</span>
                </NavLink>
              )}
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="flex flex-col py-4 space-y-2 lg:hidden">
              <NavLink to="/" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                Home
              </NavLink>
              <NavLink to="/inventory" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                Inventory
              </NavLink>
              <NavLink to="/blogs" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                Blogs
              </NavLink>
              <NavLink to="/car-register" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                Car Register
              </NavLink>
              <NavLink to="/contact" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                Contact us
              </NavLink>
              <NavLink to="/about" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                About
              </NavLink>

              {user ? (
                <div className="relative">
                 <button 
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {(typeof user === "string" ? user : user?.name || "U")[0].toUpperCase()}
                    </span>
                    <span className="font-medium text-gray-700">
                      {typeof user === "string" ? user : user?.name || "User"}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute left-0 mt-2 bg-white border rounded shadow-md p-4 w-56">
                      <NavLink
                        to="/user/dashboard"
                        className="block py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400"
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/user/wishlist"
                        className="block py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400"
                      >
                        Wishlist
                      </NavLink>
                     
                  
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login" className="py-2 text-base font-medium text-black transition-all duration-200 hover:text-gray-400">
                  <FaUserAlt />
                </NavLink>
              )}
            </nav>
          )}
        </div>
      </header>
    </div>
  );
}
