import React, { useState } from "react";
import { NavLink } from "react-router-dom";
const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "employee",
    salary: "",
    assigned_tasks: "",
    designation: "",
    isactive: false,
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}employee/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Employee added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "employee",
          salary: "",
          assigned_tasks: "",
          designation: "",
          isactive: false,
        });
      } else {
        setStatus("Error: Could not submit the form.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <NavLink to="/admin/all/employee">    <button
                           
                           className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                       >
                           List Employees
                       </button></NavLink>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Employee
      </h2>
      {status && <p className="text-center mb-4 text-blue-600">{status}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Salary", name: "salary", type: "number" },
          { label: "Assigned Tasks", name: "assigned_tasks", type: "text" },
          { label: "Designation", name: "designation", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              required
              value={formData[name]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-xl focus:ring focus:ring-blue-300"
            />
          </div>
        ))}

        <div>
          <label className="block text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl focus:ring focus:ring-blue-300"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isactive"
            checked={formData.isactive}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Is Active</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
