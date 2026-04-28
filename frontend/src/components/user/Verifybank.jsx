import React, { useState } from "react";
import img from "../../assets/img/logo.png";

export default function VerifyBank() {
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    routingNumber: "",
  });
  const [receipt, setReceipt] = useState(null);
  const api = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };
  const user = localStorage.getItem("userid");
  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("accountNumber", accountDetails.accountNumber);
    formData.append("routingNumber", accountDetails.routingNumber);
    formData.append("wire", "wire");
    formData.append("wireAmount", 40);
    formData.append("accountName", "American Dignified Apparel Co.");
    formData.append("image", receipt);

   

    formData.append("userId", user); // Use userId correctly

    try {
        const response = await fetch(`${api}wire`, {
          method: "POST",
          body: formData,
        });
      
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server Error (${response.status}): ${errorText}`);
        }
      
        const result = await response.json();
        console.log("Result:", result);
        alert("Submitted successfully!");
        setAccountDetails({
          accountNumber: "",
          routingNumber: "",
        });
        setReceipt(null);
      } catch (error) {
        console.error("Error:", error.message);
        alert("Submission failed. Please try again.");
      }
};



  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8 border border-gray-200">
      {/* Bank Info Image */}
     <center> <img
        src={img}
        alt="Wire Transfer Info"
        className=" rounded-xl mb-6"height={200} width={200}
      /></center>

      {/* Wire Transfer Details */}
      <div className="mb-6 text-gray-800">
        <h2 className="text-2xl font-bold text-center mb-2">
          Wire Transfer Information
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          International Wire Transfer in USD$
        </p>
        <div className="text-sm space-y-2">
          <p><strong>Bank Name:</strong> WELLS FARGO BANK</p>
          <p><strong>Bank Address:</strong> 2800 Woodridge Dr. Houston, TX 77087</p>
          <p><strong>Bank Phone:</strong> (713) 644-2300</p>
          <p><strong>Beneficiary:</strong> American Dignified Apparel Co.</p>
          <p><strong>Routing Number:</strong> 111900659</p>
          <p><strong>ABA/Domestic Wire Transfer:</strong> 121000248</p>
          <p><strong>Account Number:</strong> 7837180962</p>
          <p><strong>SWIFT Number:</strong> WFBIUS6S</p>
          
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* <div>
          <label className="block mb-1 font-medium text-gray-700">
            Your Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={accountDetails.accountNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Your Routing Number
          </label>
          <input
            type="text"
            name="routingNumber"
            value={accountDetails.routingNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Upload Receipt Screenshot
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
