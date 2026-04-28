import React from "react";
import { NavLink } from "react-router-dom";

const UDashboard = () => {

  const dashboardCards = [
   
   
    {
      title: "Financial Analytics",
      link: "/user/finance",
      description: "Track revenue, expenses, and financial performance",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
    {
      title: "All Records",
      link: "/user/allrecords",
      description: "View all records of vehicles",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
    {
      title: "Vehicle Tracking",
      link: "/user/trace_car",
      description: "Real-time location and status monitoring",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      bgColor: "bg-yellow-600",
      hoverColor: "hover:bg-yellow-700",
    },
  
    {
      title: "Wallet",
      link: "/user/wallet",
      description: "Real-time location and status monitoring",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-yellow-700",
    },
    
    
   
    {
      title: "Change Password",
      link: "/user/change-pass",
      description: "Update your account security credentials",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      bgColor: "bg-red-600",
      hoverColor: "hover:bg-red-700",
    }
  ];

  return (
  
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Fleet Management Dashboard</h1>
          <p className="text-xl text-gray-600">Comprehensive vehicle management and tracking system</p>
        </div>
      </div>

    

      {/* Main Actions Grid */}
      <div className="max-w-7xl mx-auto">
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
      </div>
    </div>
  );
};

export default UDashboard;
