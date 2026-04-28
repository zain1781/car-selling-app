import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Updatevei() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const upload = import.meta.env.VITE_UPLOADS;

    const { id } = useParams();

    const initialFormState = {

        make: "",
        model: "",
        year: "",
        price: "",
        mileage: "",
        fuelType: "",
        transmission: "",
        bodyType: "",
        condition: "",
        description: "",
        userId: "",
        dubaiShipping: 0,
        dubaiClearance: 0,
        storageFee: 0,
        inspectionCharge: 0,
        taxDuty: 0,
        repairCost: 0,
        soldAmount: 0,
        amountReceived: 0,
        amountDue: 0,
        loadingDate: "",
        arrivalDate: "",
        handedToCustomer: "no",
        soldInDubai: "no",
        inTransit: "no",
        uaeShip: "no",
        country: "",
        customFee: 0,
        agentFee: 0,

        status: "Available",
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [images, setImages] = useState([]);
    const [docs, setDocs] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [existingDocs, setExistingDocs] = useState([]);
const [showInfo, setShowInfo] = useState(false); // Only for visibility

const handleShow = () => {
  setShowInfo(prev => !prev);
};
    // Fetch inventory details
    useEffect(() => {
        if (id) {
            fetch(`${apiUrl}inventory/${id}`)
                .then(response => response.json())
                .then(data => {
                    setFormData(prev => ({ ...prev, ...data }));
                    // Set existing images and docs if available
                    if (data.images && Array.isArray(data.images)) {
                        setExistingImages(data.images);
                    }
                    if (data.docs && Array.isArray(data.docs)) {
                        setExistingDocs(data.docs);
                    }
                })
                .catch(error => {
                    console.error("Error fetching inventory:", error);
                    handleError("Failed to fetch vehicle details");
                });
        }
    }, [id, apiUrl]);

    // Get userId from localStorage
    useEffect(() => {
        try {
            const storedUserId = localStorage.getItem("userid");
            if (storedUserId) {
                setUserId(storedUserId);
                setFormData(prev => ({ ...prev, userId: storedUserId }));
            } else {
                console.error("User ID not found in local storage.");
            }
        } catch (error) {
            console.error("Error retrieving user ID from local storage:", error);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 20) {
            handleError("You can upload a maximum of 20 images.");
        } else {
            setImages(files);
        }
    };

    const handleDocsChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 20) {
            handleError("You can upload a maximum of 20 documents.");
        } else {
            setDocs(files);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userId) {
            handleError("User not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            // Check if we have new files to upload
            const hasNewFiles = images.length > 0 || docs.length > 0;

            if (hasNewFiles) {
                // If we have new files, use FormData for multipart/form-data
                const formDataObj = new FormData();

                // Add all form fields
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formDataObj.append(key, value);
                    }
                });

                // Add images and docs
                images.forEach((image) => formDataObj.append("images", image));
                docs.forEach((doc) => formDataObj.append("docs", doc));

                const res = await fetch(`${apiUrl}inventory/${id}`, {
                    method: "PUT",
                    body: formDataObj,
                });

                const data = await res.json();

                if (res.ok) {
                    handleSuccess("Vehicle updated successfully!");
                    // Reset file inputs
                    setImages([]);
                    setDocs([]);
                } else {
                    handleError(data.message || "Failed to update vehicle.");
                }
            } else {
                // If no new files, use JSON
                const res = await fetch(`${apiUrl}inventory/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (res.ok) {
                    handleSuccess("Vehicle updated successfully!");
                } else {
                    handleError(data.message || "Failed to update vehicle.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            handleError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-4">Update Vehicle Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-gray-700">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Make</label>
                            <input
                                type="text"
                                name="make"
                                value={formData.make}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Model</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-gray-700">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['year', 'price', 'mileage', 'fuelType', 'transmission', 'bodyType', 'condition', 'status'].map((field) => (
                            <div key={field} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type={['year', 'price', 'mileage'].includes(field) ? "number" : "text"}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
  <h3 className="text-xl font-semibold mb-4 text-gray-700">Title Status</h3>
  <div className="w-full max-w-sm">
    <label htmlFor="titleStatus" className="block mb-2 text-sm font-medium text-gray-600">
      Select Current Status
    </label>
    <select
      id="titleStatus"
      name="titleStatus"
      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue=""
    >
      <option value="" disabled>Select a status</option>
      <option value="received">Received to ATL</option>
      <option value="processed">Processed</option>
      <option value="dmvProcessed">DMV Processed</option>
      <option value="pending">Pending</option>


    </select>
  </div>
</div>

                {/* Financial & Logistics Details */}
               <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-xl font-medium mb-4 text-gray-700">Financial & Logistics Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
            'dubaiShipping', 'dubaiClearance', 'storageFee', 'inspectionCharge',
            'loadingDate', 'arrivalDate', 'portOfLoading', 'locationVei',
            'dubaiRepCost', 'taxDuty', 'tax', 'repairCost', 'soldAmount', 'amountReceived'
        ].map((field) => {
            const isNumberField = [
                'dubaiShipping', 'dubaiClearance', 'storageFee', 'inspectionCharge',
                'dubaiRepCost', 'taxDuty', 'tax', 'repairCost', 'soldAmount', 'amountReceived'
            ].includes(field);
            const isDateField = ['loadingDate', 'arrivalDate'].includes(field);

            return (
                <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        type={isNumberField ? "number" : isDateField ? "date" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                    />
                </div>
            );
        })}
    </div>
</div>

                  {/* Financial & Logistics Details */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-gray-700">Vehicle Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['handedToCustomer', 'soldInDubai', 'inTransit', 'uaeShip'].map((field) => (
                            <div key={field} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <select
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>


          <span
  onClick={handleShow}
  className="bg-green-500 text-white px-4 py-2 m-1 rounded-md hover:bg-green-600 transition-colors duration-200 cursor-pointer"
>
  {showInfo ? "Hide Info" : "Show Info"}
</span>

<div className={`bg-gray-50 p-6 rounded-lg mt-4 ${showInfo ? '' : 'hidden'}`}>
  <h3 className="text-xl font-medium mb-4 text-gray-700">UAE Onward Shipping</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {['country', 'customFee', 'agentFee','soldAmount','amountReceived','amountDue'].map((field) => (
      <div key={field} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <input
          type={['customFee', 'agentFee', 'soldAmount', 'amountReceived', 'amountDue'].includes(field) ? "number" : "text"}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          required
        />
      </div>
    ))}
  </div>
</div>



                {/* Description */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-gray-700">Description</h3>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        rows="4"
                        required
                    ></textarea>
                </div>

                {/* File Uploads */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4 text-gray-700">Images and Documents</h3>

                    {/* Existing Images */}
                    {existingImages && existingImages.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2 text-gray-700">Current Images</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {existingImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={`${upload}${img}`}
                                            alt={`Vehicle image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Existing Documents */}
                    {existingDocs && existingDocs.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2 text-gray-700">Current Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {existingDocs.map((doc, index) => (
                                    <div key={index} className="p-3 border rounded-md flex items-center">
                                        <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <a
                                            href={`${upload}${doc}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Document {index + 1}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload New Images */}
                    <div className="mb-6">
                        <h4 className="text-lg font-medium mb-2 text-gray-700">Upload New Images</h4>
                        <div className="border p-4 rounded-md">
                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                accept="image/*"
                                className="w-full"
                            />
                            <p className="text-sm text-gray-500 mt-2">You can select up to 20 images</p>
                        </div>
                    </div>

                    {/* Upload New Documents */}
                    <div>
                        <h4 className="text-lg font-medium mb-2 text-gray-700">Upload New Documents</h4>
                        <div className="border p-4 rounded-md">
                            <input
                                type="file"
                                multiple
                                onChange={handleDocsChange}
                                accept="application/pdf"
                                className="w-full"
                            />
                            <p className="text-sm text-gray-500 mt-2">You can select up to 20 PDF documents</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full p-4 text-white rounded-md font-medium text-lg transition duration-200 ${
                        loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                        </span>
                    ) : "Update Vehicle"}
                </button>

                <ToastContainer />
            </form>
        </div>
    );
}
