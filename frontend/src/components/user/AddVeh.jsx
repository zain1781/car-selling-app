import React, { useState, useEffect } from "react";
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const carData = {
  Ford: ["F-150", "F-250", "F-350", "Ranger", "Maverick", "Escape", "Edge", "Explorer", "Expedition", "Bronco", "Bronco Sport", "Mustang", "Mustang Mach-E", "Transit", "Transit Connect"],
  Chevrolet: ["Silverado 1500", "Silverado 2500HD", "Silverado 3500HD", "Colorado", "Tahoe", "Suburban", "Traverse", "Equinox", "Blazer", "Trailblazer", "Trax", "Malibu", "Camaro", "Corvette", "Bolt EV", "Bolt EUV", "Express Van"],
  Toyota: ["Camry", "Corolla", "Corolla Hatchback", "Prius", "Prius Prime", "Avalon", "Mirai", "GR Supra", "GR86", "Sienna", "RAV4", "RAV4 Prime", "Venza", "Highlander", "Highlander Hybrid", "4Runner", "Sequoia", "Tacoma", "Tundra", "Land Cruiser"],
  Honda: ["Accord", "Civic", "Civic Hatchback", "Civic Si", "Civic Type R", "Insight", "Clarity", "Fit", "HR-V", "CR-V", "CR-V Hybrid", "Passport", "Pilot", "Ridgeline", "Odyssey"],
  Jeep: ["Wrangler", "Wrangler 4xe", "Gladiator", "Cherokee", "Grand Cherokee", "Grand Cherokee L", "Grand Cherokee 4xe", "Compass", "Renegade", "Wagoneer", "Grand Wagoneer"],
  Ram: ["1500", "1500 Classic", "2500", "3500", "ProMaster", "ProMaster City"],
  Subaru: ["Impreza", "Legacy", "WRX", "BRZ", "Crosstrek", "Forester", "Outback", "Ascent", "Solterra"],
  Dodge: ["Charger", "Challenger", "Durango", "Hornet", "Journey", "Grand Caravan"],
  Hyundai: ["Accent", "Elantra", "Elantra N", "Sonata", "Sonata N Line", "Ioniq 5", "Ioniq 6", "Kona", "Kona Electric", "Tucson", "Santa Fe", "Santa Cruz", "Palisade", "Venue", "Veloster N"],
  Nissan: ["Versa", "Sentra", "Altima", "Maxima", "LEAF", "Ariya", "Kicks", "Rogue", "Rogue Sport", "Murano", "Pathfinder", "Armada", "Frontier", "Titan", "Titan XD", "GT-R", "Z"],
  BMW: ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "Z4 Roadster", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "i3", "i4", "i5", "i7", "i8", "M Models"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQB", "EQE", "EQS", "EQS SUV", "AMG Variants"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck", "Roadster"],
  Audi: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q4 e-tron", "Q5", "Q6", "Q7", "Q8", "e-tron GT", "RS Models", "S Models"],
  Volkswagen: ["Jetta", "Passat", "Arteon", "Golf", "ID.4", "ID. Buzz", "Taos", "Tiguan", "Atlas", "Atlas Cross Sport"],
  Kia: ["Rio", "Forte", "K5", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "Carnival", "Niro", "EV6", "EV9"],
  GMC: ["Canyon", "Sierra 1500", "Sierra HD", "Terrain", "Acadia", "Yukon", "Yukon XL", "Hummer EV Pickup", "Hummer EV SUV", "Savana"],
  Chrysler: ["300", "Pacifica", "Pacifica Hybrid", "Voyager"],
  Mazda: ["Mazda3", "Mazda6", "MX-5 Miata", "CX-30", "CX-5", "CX-50", "CX-9", "CX-90", "CX-70"],
  Lexus: ["IS", "ES", "GS", "LS", "UX", "NX", "RX", "GX", "LX", "RC", "LC", "RZ"]
};

const AddVeh = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const initialFormState = {
    carName: "",
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
    engine: "",
    features: "",
    location: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userid");
      if (storedUserId) {
        setUserId(storedUserId);
        setFormData(prev => ({ ...prev, userId: storedUserId }));
      } else {
        handleError("User ID not found in local storage.");
      }
    } catch (error) {
      handleError("Error retrieving user ID from local storage:", error);
    }
  }, []);

  const generateDescription = async () => {
    setGenerating(true);
    try {
      if (!formData.description) {
        handleError("Description is required.");
        setGenerating(false);
        return;
      }

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData })
      });

      const data = await response.json();
      if (data.seo_text) {
        const combinedText = `${data.seo_text} ${(data.hashtags || []).join(' ')}`;
        setFormData(prev => ({ ...prev, description: combinedText }));
      } else {
        handleError(data.error || "Failed to generate description.");
      }
    } catch (error) {
      handleError("Error generating description:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 20) {
      handleError("You can upload a maximum of 20 images.");
    } else {
      setImages(files);
    }
  };

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel('');
    setFormData(prev => ({
      ...prev,
      make: e.target.value,
      model: ''
    }));
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setFormData(prev => ({
      ...prev,
      model: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadingCount(0);

    if (!userId) {
      handleError("User not found. Please log in.");
      setLoading(false);
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });
    images.forEach((image) => formDataObj.append("images", image));

    try {
      const res = await fetch(`${apiUrl}inventory/create`, {
        method: "POST",
        body: formDataObj,
      });

      const data = await res.json();

      if (res.ok) {
        handleSuccess("Inventory item added successfully!");
        setFormData({ ...initialFormState, userId });
        setImages([]);
      } else {
        handleError(data.message || "Failed to add inventory item.");
      }
    } catch (error) {
      handleError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Inventory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(initialFormState).map((key) =>
            key !== "description" && key !== "make" && key !== "model" && key !== "userId" ? (
              <input
                key={key}
                type={["year", "price", "mileage"].includes(key) ? "number" : "text"}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            ) : null
          )}
        </div>

        <select value={selectedMake} onChange={handleMakeChange} className="w-full p-2 border rounded">
          <option value="">Select Make</option>
          {Object.keys(carData).map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        {selectedMake && (
          <select value={selectedModel} onChange={handleModelChange} className="w-full p-2 border rounded">
            <option value="">Select Model</option>
            {carData[selectedMake].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          accept="image/*"
          className="w-full"
        />


        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddVeh;
