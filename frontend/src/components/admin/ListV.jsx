import React, { useEffect, useState } from "react";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';

export default function ListV() {
    const [cars, setCars] = useState([]);
    const [filter, setFilter] = useState("All");
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}inventory`)
            .then(response => response.json())
            .then(data => setCars(data))
            .catch(error => console.error("Error fetching cars:", error));
    }, []);

    const handleDelete = (id) => {
        fetch(`${apiUrl}inventory/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            handleSuccess("Car deleted successfully");
            setCars(cars.filter(car => car._id !== id));
        })
        .catch(error => handleError("Error deleting car:", error));
    }

    const handleDeleteAll = () => {
        fetch(`${apiUrl}inventory/delete-all`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            handleSuccess("All cars deleted successfully");
            setCars([]);
        })
        .catch(error => handleError("Error deleting all cars:", error));
    }

    const filteredCars = cars.filter(car => {
        if (filter === "All") return true;
        return car.status === filter;
    });
     // Sum all the financial fields
     useEffect(() => {
        fetch(`${apiUrl}inventory`)
            .then(response => response.json())
            .then(data => setCars(data))
            .catch(error => console.error("Error fetching cars:", error));
    }, []);
    
    // Sum all the financial fields for each car
    const financialSum = cars.reduce((acc, car) => {
        return acc + 
            (car.dubaiShipping || 0) + 
            (car.dubaiClearance || 0) + 
            (car.storageFee || 0) + 
            (car.inspectionCharge || 0) + 
            (car.taxDuty || 0) + 
            (car.repairCost || 0) + 
            (car.soldAmount || 0) + 
            (car.amountReceived || 0);
    }, 0);
    
    console.log("Total Financial Sum:", financialSum);
    

    return (
        <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Car Inventory Management</h2>
                <button 
                    onClick={handleDeleteAll} 
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    <FaTrash className="mr-2" />
                    <span>Clear All Inventory</span>
                </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-4">
                {["All", "Available", "sold"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-lg ${filter === type ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-sm text-gray-600 font-semibold">
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Make</th>
                            <th className="px-4 py-3 text-left">Year</th>
                            <th className="px-4 py-3 text-left">Price ($)</th>
                            <th className="px-4 py-3 text-left">Fuel Type</th>
                            <th className="px-4 py-3 text-left">Transmission</th>
                            <th className="px-4 py-3 text-left">Condition</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Dubai Shipping</th>
                            <th className="px-4 py-3 text-left">Dubai Clearance</th>
                            <th className="px-4 py-3 text-left">Storage Fee</th>
                            <th className="px-4 py-3 text-left">Inspection Charge</th>
                            <th className="px-4 py-3 text-left">Tax/Duty</th>
                            <th className="px-4 py-3 text-left">Repair Cost</th>
                            <th className="px-4 py-3 text-left">Sold Amount</th>
                            <th className="px-4 py-3 text-left">Received</th>
                            <th className="px-4 py-3 text-left">Due</th>
                            <th className="px-4 py-3 text-left">Total Cost</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                            <th className="px-4 py-3 text-left">User</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCars.map((car, index) => (
                            <tr key={car._id} className="hover:bg-gray-50 transition-colors duration-200 text-sm">
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{car.make}</td>
                                <td className="px-4 py-3">{car.year}</td>
                                <td className="px-4 py-3">${car.price?.toLocaleString()}</td>
                                <td className="px-4 py-3">{car.fuelType}</td>
                                <td className="px-4 py-3">{car.transmission}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                                        ${car.condition === 'New' ? 'bg-green-100 text-green-800' : 
                                        car.condition === 'Used' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-gray-100 text-gray-800'}`}>
                                        {car.condition}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                                        ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 
                                        'bg-red-100 text-red-800'}`}>
                                        {car.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">${car.dubaiShipping?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.dubaiClearance?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.storageFee?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.inspectionCharge?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.taxDuty?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.repairCost?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.soldAmount?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${car.amountReceived?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3">${((car.soldAmount || 0) - (car.amountReceived || 0)).toLocaleString()}</td>
                                <td className="px-4 py-3">
  ${(
    (car.dubaiShipping || 0) +
    (car.dubaiClearance || 0) +
    (car.storageFee || 0) +
    (car.inspectionCharge || 0) +
    (car.taxDuty || 0) +
    (car.repairCost || 0) +
    (car.soldAmount || 0) +
    (car.amountReceived || 0)
  ).toFixed(2)}
</td>


                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <NavLink 
                                            to={`/admin/update/${car._id}`}
                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        >
                                            <FaRegEdit className="w-5 h-5" />
                                        </NavLink>
                                        <button 
                                            onClick={() => handleDelete(car._id)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                        >
                                            <FaTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <NavLink 
                                        to={`/admin/users/cars/${car.userId}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                                    >
                                        {car.userId}
                                    </NavLink>
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
