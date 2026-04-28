import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaList, FaSave, FaTimes } from "react-icons/fa";

const Addrent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: "",
    location: "",
    monthly_rent: "",
    vendor: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
    payment_status: "",
    category: "",
    description: "",
    payment_method: ""
  });

  const [errors, setErrors] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["type", "location", "monthly_rent", "vendor", "start_date", "payment_status", "category", "description", "payment_method"];

    requiredFields.forEach(field => {
      if (!form[field]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    if (form.monthly_rent && isNaN(form.monthly_rent)) {
      newErrors.monthly_rent = "Monthly rent must be a number";
    }

    if (form.monthly_rent && Number(form.monthly_rent) <= 0) {
      newErrors.monthly_rent = "Monthly rent must be greater than zero";
    }

    if (form.end_date && new Date(form.end_date) < new Date(form.start_date)) {
      newErrors.end_date = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is filled
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${apiUrl}rentassets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to add asset");
      }

      await res.json();
      toast.success("Asset added successfully!");

      // Reset form or navigate
      setTimeout(() => {
        navigate("/admin/all/rent");
      }, 2000);
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error(error.message || "Failed to add asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dropdownOptions = {
    type: ["Office", "Equipment", "Property", "Warehouse","Business Operations Expenses",
"Vehicle & Transportation Expenses",
"Marketing & Advertising",
"Professional Services",
"Business Licenses & Permits",
"Technology & Software",
"Depreciation & Asset Purchases",
"Taxes & Government Fees",
"Bad Debt",
"Commissions & fees",
"Contract labor",
"Employee retirement plans",
"General Business expenses (Bank fees, service charges)",
"Memberships & subscriptions",
"Business insurance",
"Interest paid",
"Office expenses (office supplies, printing, shipping and postage)",
"Salaries",
"Rent (office rent, equipment rent)",
"Repairs and maintenance",
"Shipping supplies",
"Tax paid",
"Travel",
"Utilities (Electricity bills, Internet, Phone services)",
"Vehicle Towing service",
"Other Misc expense",
"Vehicle expenses (Parking & tolls, Gas, Insurance, registration",
"Inventory",
"Inventory Asset",
"Loans to others",
"Loans to partners",
"Payment to deposit",
"Prepaid expenses",
"Uncategorized Asset",
"Vehicle Purchase",
"Security Deposit",
"Sales",
"Sales of Product Income",
"Partner Investments",
"Retained Earnings",
"Freight Shipping",
"company partners",
"Account Receivable",
"Account Payable",
"Business penalties"
],
    payment_status: ["Paid", "Unpaid", "Pending"],
    payment_method:["Debit Card","Credit Card","Cash Payment"
],
    category:["INCOME","OUTCOME"]
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Rent Asset</h1>
        <NavLink to="/admin/all/rent">
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            <FaList className="mr-2" /> View All Assets
          </button>
        </NavLink>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select type</option>
                {dropdownOptions.type.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select category</option>
                {dropdownOptions.category.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Select "INCOME" for revenue items or "OUTCOME" for expenses
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                className={`w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rs</span>
                <input
                  type="number"
                  name="monthly_rent"
                  value={form.monthly_rent}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full border ${errors.monthly_rent ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.monthly_rent && <p className="mt-1 text-sm text-red-500">{errors.monthly_rent}</p>}
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                placeholder="Enter vendor name"
                className={`w-full border ${errors.vendor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.vendor && <p className="mt-1 text-sm text-red-500">{errors.vendor}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className={`w-full border ${errors.payment_method ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select payment method</option>
                {dropdownOptions.payment_method.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.payment_method && <p className="mt-1 text-sm text-red-500">{errors.payment_method}</p>}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className={`w-full border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.start_date && <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={`w-full border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.end_date && <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>}
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status <span className="text-red-500">*</span>
              </label>
              <select
                name="payment_status"
                value={form.payment_status}
                onChange={handleChange}
                className={`w-full border ${errors.payment_status ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select payment status</option>
                {dropdownOptions.payment_status.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.payment_status && <p className="mt-1 text-sm text-red-500">{errors.payment_status}</p>}
            </div>
          </div>

          {/* Description - Full width */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter asset description"
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <NavLink to="/admin/all/rent">
              <button
                type="button"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </NavLink>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Asset
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-1">About Rent Assets</h3>
        <p className="text-sm text-blue-600">
          Rent assets are recurring expenses or income related to property, equipment, or services.
          Fill in all required fields marked with an asterisk (*).
        </p>
      </div>
    </div>
  );
};

export default Addrent;
