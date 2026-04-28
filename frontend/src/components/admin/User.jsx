import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { handleError } from "../../../utils.js";
import { ToastContainer } from "react-toastify";

export default function User() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}users`)
      .then(response => response.json())
      .then(fetchedData => {
        setData(fetchedData);
        setFilter(fetchedData);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const deleteUser = async (id) => {
    const response = await fetch(`${apiUrl}users/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const updatedData = data.filter(user => user._id !== id);
      setData(updatedData);
      setFilter(updatedData);
    } else {
      handleError("User not deleted");
    }
  };

  useEffect(() => {
    const query = search.toLowerCase();
    const results = data.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query)
    );
    setFilter(results);
  }, [search, data]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Search by name, role, or email"
        className="mb-4 w-full px-4 py-2 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Country</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Verified</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filter.map((user , index) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4">{index+1}</td>
                <td className="px-6 py-4">
                  <NavLink 
                    to={`/admin/users/cars/${user._id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {user._id}
                  </NavLink>
                </td>
                <td className="px-6 py-4 text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-800">{user.email}</td>
                                <td className="px-6 py-4 text-gray-800">{user.phone}</td>

                <td className="px-6 py-4 text-gray-800">{user.country}</td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.verified ? (
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800">
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => deleteUser(user._id)} 
                    className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                 <NavLink to={`/admin/update/user/${user._id}`}>  <button 
                    
                    className="px-4 m-1 py-2 text-sm rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                  >
                    Edit
                  </button></NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}
