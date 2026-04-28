import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const Allemployess = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${apiUrl}employee`);
        const result = await res.json();
        setEmployees(result.data);
        setFiltered(result.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees
  useEffect(() => {
    const query = search.toLowerCase();
    const results = employees.filter((emp) =>
      emp.name.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query)
    );
    setFiltered(results);
  }, [search, employees]);

  // Total salary
  const totalSalary = filtered.reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>

      <input
        type="text"
        placeholder="Search by name, role, or designation"
        className="mb-4 w-full px-4 py-2 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">Employee ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Designation</th>
              <th className="py-2 px-4">Salary</th>
              <th className="py-2 px-4">Tasks</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((emp , index) => (
                <tr key={emp._id} className="border-t">
                  <td className="py-2 px-4">{index+1}</td>
                  <td className="py-2 px-4">{emp.name}</td>
                  <td className="py-2 px-4">{emp.email}</td>
                  <td className="py-2 px-4">{emp.phone}</td>
                  <td className="py-2 px-4">{emp.role}</td>
                  <td className="py-2 px-4">{emp.designation}</td>
                  <td className="py-2 px-4">$.{emp.salary.toLocaleString()}</td>
                  <td className="py-2 px-4">{emp.assigned_tasks}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${emp.isactive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {emp.isactive ? "Active" : "Inactive"}
                    </span>
                    <span >
                    <NavLink to={`/admin/update/employee/${emp._id}`}>    <button
                           
                           className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                       >
                          <FaEdit/>
                       </button></NavLink>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td colSpan="5" className="py-2 px-4 text-right">Total Salary:</td>
              <td className="py-2 px-4">$.{totalSalary.toLocaleString()}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Allemployess;
