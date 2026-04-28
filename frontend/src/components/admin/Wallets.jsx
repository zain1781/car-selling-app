import React, { useEffect, useState } from 'react';
import { FaMoneyCheckAlt, FaListUl } from "react-icons/fa";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}wallet`)
      .then((res) => res.json())
      .then((data) => {
        if (data.wallets) setWallets(data.wallets);
      })
      .catch((error) => console.error('Error fetching wallet data:', error));
  }, []);

  const handleDeposit = async (walletId) => {
    try {
      const response = await fetch(`${apiUrl}wallet/approve/${walletId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to approve deposit");
      }
  
      alert("Deposit approved successfully");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };




  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">User Wallets</h2>
      
      <div className="overflow-x-auto rounded shadow-md bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Account Number</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">deposit request</th>

              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {wallets.length ? (
              wallets.map((wallet, index) => (
                <tr key={wallet._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{wallet.accountnumber}</td>
                  <td className="px-4 py-3">{wallet.userId}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">${wallet.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">${wallet.req_deposit.toFixed(2)}</td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(wallet.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleDeposit(wallet._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      title="Deposit"
                    >
                      <FaMoneyCheckAlt className="text-base" />
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No wallet records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallets;
