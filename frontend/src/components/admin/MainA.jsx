import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const MainA = () => {

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


  // All available dashboard cards
  const allDashboardCards = [
    {
      title: "Total Expense",
      link: "/admin/all/finance",
      description: "Summary of revenues, expenses, and net balance",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V9a4 4 0 018 0v2m-1 6h-6m2-6v2a2 2 0 11-4 0V9a2 2 0 114 0v2z" />
        </svg>
      ),
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      roles: ["admin"] // Both admin and staff can see this
    },
    {
      title: "Wallet Management",
      link: "/admin/wallets",
      description: "View, add, and manage income and expense entries",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m4-4H8" />
        </svg>
      ),
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      roles: ["admin", "staff"] // Both admin and staff can see this
    },
    {
      title: "IN / OUT Category",
      link: "/admin/info/inout",
      description: "Manage categories for income and expenses",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: "bg-yellow-600",
      hoverColor: "hover:bg-yellow-700",
      roles: ["admin","staff"] // Only admin can see this
    },
    {
      title: "Estimation Management",
      link: "/admin/estimation",
      description: "Set financial goals and plan monthly budgets",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: "bg-yellow-600",
      hoverColor: "hover:bg-yellow-700",
      roles: ["admin","staff"] // Only admin can see this
    },
    {
      title: "Invoices & Billing",
      link: "/admin/invoice",
      description: "Generate, send, and track invoices",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14h6m-6 4h6m2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h8l4 4v13a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
      roles: ["admin","staff"] // Only admin can see this
    },
    {
      title: "Wire Transfer",
      link: "/admin/wire/set",
      description: "Manage wire transfers and transaction history",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14h6m-6 4h6m2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h8l4 4v13a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
      roles: ["admin","staff"] // Only admin can see this
    },
    {
      title: "Transaction Management",
      link: "/admin/info/transaction",
      description: "Track, update, and manage rent-related expenses",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      bgColor: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      roles: ["admin","staff"] // Only admin can see this
    },
    {
      title: "Wallet Management",
      link: "/admin/wallet/admin",
      description: "View, add, and manage income and expense entries",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m4-4H8" />
        </svg>
      ),
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      roles: ["admin", "staff"] // Both admin and staff can see this
    },
    {
      title: "Employee & Salary",
      link: "/admin/add/employee",
      description: "Manage employee records and salary distributions",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v2a2 2 0 004 0v-2m-4 0H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4" />
        </svg>
      ),
      bgColor: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      roles: ["admin"] // Only admin can see this
    },
    {
      title: "Expense Management",
      link: "/admin/add/rent",
      description: "Track, update, and manage rent-related expenses",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      bgColor: "bg-red-600",
      hoverColor: "hover:bg-red-700",
      roles: ["admin","staff"] // Only admin can see this
    },
  ];

  // Filter cards based on user role
  const dashboardCards = allDashboardCards.filter(card =>
    card.roles.includes(role)
  );
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {role === "admin" ? "Admin Finance Panel" : "Staff Finance Panel"}
        </h1>
        <p className="text-xl text-gray-600">
          {role === "admin"
            ? "Manage and monitor all financial aspects"
            : "View and manage assigned financial tasks"}
        </p>
        {role === "staff" && (
          <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-lg inline-block">
            <p className="text-sm">
              <span className="font-semibold">Note:</span> Some features are only available to administrators.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {dashboardCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <NavLink key={index} to={card.link}>
                <button
                  className={`w-full ${card.bgColor} ${card.hoverColor} transform hover:scale-105 transition-all duration-200 text-white rounded-xl shadow-lg p-6 text-left`}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">{card.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-white/80 text-sm">{card.description}</p>
                  </div>
                </button>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Access Available</h3>
            <p className="text-gray-500 mb-4">You don't have access to any finance management features.</p>
            <p className="text-gray-500 text-sm">Please contact your administrator if you believe this is an error.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainA;
