import { NavLink, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const UpdateEmployee = () => {
    const { id: employeeId } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    assigned_tasks: "",
    designation: "",
    role: "",
    isactive: false,
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      const res = await fetch(`${apiUrl}employee/${employeeId}`);
      const result = await res.json();
      setEmployee(result.data);
    };

    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${apiUrl}employee/${employeeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Employee updated successfully!");
    } else {
      alert(result.message || "Update failed");
    }
  };

  return (
   <> <button
                  
   className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
   title="Approve"
 >
   <NavLink to='/admin/all/employee'> Back</NavLink>
 </button>
   <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      
     <h2 className="text-xl font-bold mb-4">Update Employee</h2>

     {["name", "email", "phone", "salary", "assigned_tasks", "designation", "role"].map((field) => (
       <div key={field} className="mb-4">
         <label className="block mb-1 font-medium capitalize">{field.replace("_", " ")}:</label>
         <input
           type={field === "salary" ? "number" : "text"}
           name={field}
           value={employee[field] || ""}
           onChange={handleChange}
           className="w-full border px-3 py-2 rounded-md"
           required
         />
       </div>
     ))}

     <div className="mb-4">
       <label className="flex items-center space-x-2">
         <input type="checkbox" name="isactive" checked={employee.isactive} onChange={handleChange} />
         <span>Active</span>
       </label>
     </div>

     <button
       type="submit"
       className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
     >
       Update Employee
     </button>
   </form></>
  );
};

export default UpdateEmployee;
