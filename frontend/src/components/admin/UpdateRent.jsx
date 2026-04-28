import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateRent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rentData, setRentData] = useState({
    type: "",
    location: "",
    monthly_rent: "",
    vendor: "",
    start_date: "",
    end_date: "",
    payment_status: "",
    category: "",
    payment_method: "",
    description: "",

  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch all rents
  useEffect(() => {
    const fetchAllRents = async () => {
      try {
        const response = await fetch(`${apiUrl}rentassets`);
        if (!response.ok) {
          throw new Error("Failed to fetch rent assets");
        }
        const data = await response.json();

        // Find the specific rent that matches the id
        const currentRent = data.find(rent => rent._id === id);

        if (currentRent) {
          // Format dates for input fields
          const formattedStartDate = currentRent.start_date ?
            new Date(currentRent.start_date).toISOString().split('T')[0] : '';

          const formattedEndDate = currentRent.end_date ?
            new Date(currentRent.end_date).toISOString().split('T')[0] : '';

          setRentData({
            type: currentRent.type || "",
            location: currentRent.location || "",
            monthly_rent: currentRent.monthly_rent || "",
            vendor: currentRent.vendor || "",
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            payment_status: currentRent.payment_status || ""
          });
        } else {
          toast.error("Rent asset not found");
        }
      } catch (error) {
        console.error("Error fetching rent assets:", error);
        toast.error("Failed to load rent asset data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRents();
  }, [apiUrl, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}rentassets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentData)
      });

      if (!response.ok) {
        throw new Error("Failed to update rent asset");
      }

      await response.json();
      toast.success("Rent asset updated successfully!");

      // Navigate back to the rent assets list after a short delay
      setTimeout(() => {
        navigate("/admin/all/rent");
      }, 2000);
    } catch (error) {
      console.error("Error updating rent asset:", error);
      toast.error(error.message || "Failed to update rent asset");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Update Rent Asset</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={rentData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={rentData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Monthly Rent */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Monthly Rent</label>
            <input
              type="number"
              name="monthly_rent"
              value={rentData.monthly_rent}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={rentData.vendor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={rentData.start_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={rentData.end_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Payment Status</label>
            <select
              name="payment_status"
              value={rentData.payment_status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={rentData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <input
              type="text"
              name="payment_method"
              value={rentData.payment_method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={rentData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
        </div>





        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/all/rent")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Rent Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
