import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Adminnav = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get JWT token and decode role on component mount
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        const decodedToken = jwtDecode(jwtToken);
        setRole(decodedToken.role || "");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle invalid token by redirecting to login
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userid");

    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} h-screen bg-gray-900 text-white fixed transition-all duration-300 overflow-hidden`}>
        <div className="p-5 text-lg font-bold border-b border-gray-700 flex items-center">
          <span>Admin Panel</span>
        </div>
        <ul className="mt-4 scrollable-list">
          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/add">Add Vehicle</Link>
          </li>
          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/list">Vehicles</Link>
          </li>

          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/traceshipment">Tracking Vehicle</Link>
          </li>
        {role === "admin" ? (
          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/users">Users</Link>
          </li>
        ) : (
          ""
        )}


          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/finance/data">Finance Mangment</Link>
          </li>

          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/orders/cars">Orders</Link>
          </li>


          <li className="p-3 hover:bg-gray-700">
            <Link to="/admin/contacts">Messages</Link>
          </li>


          <button
            onClick={handleLogout}
            className="bg-red-500 m-2 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </ul>

      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} flex-1 transition-all duration-300 min-h-screen w-full`}>
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10 w-full">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 w-full max-w-full overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Adminnav;
