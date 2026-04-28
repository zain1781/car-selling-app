import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaPlus, FaFilter, FaSearch, FaArrowUp, FaArrowDown, FaFileExport } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Allrent = () => {
  const [rentAssets, setRentAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "income", "outcome"
  const [sortField, setSortField] = useState("start_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRentAssets();
  }, []);

  const fetchRentAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}rentassets`);
      if (!res.ok) {
        throw new Error("Failed to fetch rent assets");
      }
      const data = await res.json();

      // Add a transaction_type field based on the category
      const processedData = data.map(asset => ({
        ...asset,
        transaction_type: determineTransactionType(asset.category)
      }));

      setRentAssets(processedData);
      setFilteredAssets(processedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch rent assets:", error);
      toast.error("Failed to load rent assets");
      setLoading(false);
    }
  };

  // Helper function to determine if a category is income or outcome
  const determineTransactionType = (category) => {
    // Check if the category is directly "INCOME" or contains income-related keywords
    if (category === "INCOME" ||
        (typeof category === 'string' &&
         (category.toUpperCase() === "INCOME" ||
          category.includes("Income") ||
          category.includes("income") ||
          category.includes("Revenue") ||
          category.includes("revenue") ||
          category.includes("Sales") ||
          category.includes("sales") ||
          category.includes("Rental Income") ||
          category.includes("Sublease") ||
          category.includes("Deposit") ||
          category.includes("Refund")))) {
      return "income";
    }

    // Check if the category is directly "OUTCOME" or contains expense-related keywords
    if (category === "OUTCOME" ||
        (typeof category === 'string' &&
         (category.toUpperCase() === "OUTCOME" ||
          category.includes("Expense") ||
          category.includes("expense") ||
          category.includes("Cost") ||
          category.includes("cost") ||
          category.includes("Payment") ||
          category.includes("payment")))) {
      return "outcome";
    }

    // Default to outcome if we can't determine
    return "outcome";
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...rentAssets];

    // Apply transaction type filter
    if (filterType !== "all") {
      result = result.filter(asset => asset.transaction_type === filterType);
    }

    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        asset =>
          asset.type.toLowerCase().includes(search) ||
          asset.location.toLowerCase().includes(search) ||
          asset.vendor.toLowerCase().includes(search) ||
          asset.description?.toLowerCase().includes(search) ||
          asset.category?.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date fields
      if (sortField === "start_date" || sortField === "end_date") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // Handle numeric fields
      if (sortField === "monthly_rent") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAssets(result);
  }, [rentAssets, filterType, searchTerm, sortField, sortDirection]);

  // Calculate totals
  const totalRent = filteredAssets.reduce((sum, asset) => sum + Number(asset.monthly_rent), 0);
  const totalIncome = filteredAssets
    .filter(asset => asset.transaction_type === "income")
    .reduce((sum, asset) => sum + Number(asset.monthly_rent), 0);
  const totalOutcome = filteredAssets
    .filter(asset => asset.transaction_type === "outcome")
    .reduce((sum, asset) => sum + Number(asset.monthly_rent), 0);

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Type", "Location", "Monthly Rent", "Vendor", "Description",
      "Category", "Payment Method", "Start Date", "End Date", "Payment Status"
    ];

    const csvData = filteredAssets.map(asset => [
      asset.type,
      asset.location,
      asset.monthly_rent,
      asset.vendor,
      asset.description || "",
      asset.category || "",
      asset.payment_method || "",
      new Date(asset.start_date).toLocaleDateString(),
      asset.end_date ? new Date(asset.end_date).toLocaleDateString() : "N/A",
      asset.payment_status
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rent_assets_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV file downloaded successfully");
  };
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}rentassets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete asset");
      }
      await res.json();
      toast.success("Asset deleted successfully");
      fetchRentAssets();
    } catch (error) {
      console.error("Failed to delete asset:", error);
      toast.error("Failed to delete asset");
    }
  };


  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with title and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Rent Assets</h2>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <NavLink to="/admin/add/rent">
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              <FaPlus className="mr-2" /> Add New Asset
            </button>
          </NavLink>

          <button
            onClick={exportToCSV}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaFileExport className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-md ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-4 py-2 rounded-md ${
                filterType === "income"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaArrowUp className="inline mr-1" /> Income
            </button>
            <button
              onClick={() => setFilterType("outcome")}
              className={`px-4 py-2 rounded-md ${
                filterType === "outcome"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaArrowDown className="inline mr-1" /> Outcome
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total</h3>
          <p className="text-2xl font-bold text-gray-900">Rs {totalRent.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">{filteredAssets.length} assets</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Income</h3>
          <p className="text-2xl font-bold text-green-900">Rs {totalIncome.toLocaleString()}</p>
          <p className="text-sm text-green-500 mt-1">
            {filteredAssets.filter(a => a.transaction_type === "income").length} assets
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Outcome</h3>
          <p className="text-2xl font-bold text-red-900">Rs {totalOutcome.toLocaleString()}</p>
          <p className="text-sm text-red-500 mt-1">
            {filteredAssets.filter(a => a.transaction_type === "outcome").length} assets
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <FaFilter className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No assets found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("type")}
                >
                  Type
                  {sortField === "type" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("location")}
                >
                  Location
                  {sortField === "location" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("monthly_rent")}
                >
                  Monthly Rent
                  {sortField === "monthly_rent" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("vendor")}
                >
                  Vendor
                  {sortField === "vendor" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("start_date")}
                >
                  Start Date
                  {sortField === "start_date" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("payment_status")}
                >
                  Status
                  {sortField === "payment_status" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{asset.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{asset.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    <span className={`${asset.transaction_type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {asset.transaction_type === "income" ? "+" : "-"}Rs {Number(asset.monthly_rent).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{asset.vendor}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      asset.transaction_type === "income"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {asset.category || (asset.transaction_type === "income" ? "Income" : "Expense")}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(asset.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      asset.payment_status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : asset.payment_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}>
                      {asset.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <NavLink to={`/admin/update/rent/${asset._id}`}>
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                    </NavLink>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this asset?")) {
                          handleDelete(asset._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Allrent;
