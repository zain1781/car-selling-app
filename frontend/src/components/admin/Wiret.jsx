import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Wiret() {
  const [wire, setWire] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);
  const api = import.meta.env.VITE_API_URL;
  const upload = import.meta.env.VITE_UPLOADS;

  useEffect(() => {
    fetch(`${api}wire`)
      .then((res) => res.json())
      .then((data) => setWire(data))
      .catch((err) => console.log(err));
  }, []);

  const Zoom = (image) => {
    setZoomImage(image);
  };

  const closeModal = () => {
    setZoomImage(null);
  };

  const handleDelete = (id) => {
    fetch(`${api}wire/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((err) => console.log(err));  
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Wire Data</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Account Name</th>
              <th className="py-2 px-4 border-b">Wire Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
            
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {wire.map((item, index) => (
              <tr key={item._id} className="bg-white border-b hover:bg-gray-100">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                
                <td className="py-2 px-4 text-center"><NavLink to={`/admin/update/wire/${item._id}`}>{item.accountName}</NavLink></td>
                <td className="py-2 px-4 text-center">${item.wireAmount}</td>
                <td className="py-2 px-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              
                <td className="py-2 px-4 text-center">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 text-center">
                  <img
                    onClick={() => Zoom(item.image)}
                    src={`${upload}${item.image}`}
                    alt="Wire icon"
                    className="w-8 h-8 rounded-full mx-auto cursor-pointer"
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <button className="bg-red-500 text-white py-1 px-4 rounded" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to show the zoomed image */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <img
              src={`${upload}${zoomImage}`}
              alt="Zoomed Image"
              className="w-96 h-auto"
            />
            <button
              onClick={closeModal}
              className="mt-2 bg-red-500 text-white py-1 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
