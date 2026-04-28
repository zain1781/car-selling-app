import React, { useEffect, useState } from "react";

export default function WalletUser() {
  const [wallets, setWallets] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const api = import.meta.env.VITE_API_URL;

  const fetchWallets = async () => {
    try {
      const response = await fetch(`${api}wallet/`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch wallets");
      }
      const data = await response.json();
      const userId = localStorage.getItem("userid");
      const filteredWallets = Array.isArray(data.wallets)
        ? data.wallets.filter((wallet) => wallet.userId === userId)
        : [];
      setWallets(filteredWallets);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleCreateWallet = async () => {
    const userId = localStorage.getItem("userid");
    const email = localStorage.getItem("email");
    const accountNumber = `W0043M${userId}`;

    try {
      const response = await fetch(`${api}wallet/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email, accountNumber }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create wallet");
      }

      alert("Wallet created successfully");
      fetchWallets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyAccountNumber = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber);
    alert("Account number copied to clipboard!");
  };

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount)) {
      return alert("Please enter a valid deposit amount");
    }

    try {
      const response = await fetch(`${api}wallet/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletId: selectedWalletId,
          amount: Number(depositAmount),
        }),
      });
      

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to deposit amount");
      }

      alert("Deposit successful");
      setShowModal(false);
      setDepositAmount("");
      fetchWallets();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Bank Wallet Dashboard</h1>

      {error && (
        <div className="text-red-500 mb-4 text-center">
          <p>{error}</p>
        </div>
      )}

      {wallets.length > 0 ? (
        wallets.map((wallet) => (
          <div
            key={wallet._id}
            className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Wallet</h2>
              <button
                onClick={() => {
                  setShowModal(true);
                  setSelectedWalletId(wallet._id);
                }}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Deposit
              </button>
            </div>
            <p><strong>User ID:</strong> {wallet.userId}</p>
            <p className="flex items-center">
              <strong>Account Number:</strong>&nbsp;{wallet.accountnumber}
              <button
                onClick={() => handleCopyAccountNumber(wallet.accountnumber)}
                className="ml-2 text-blue-600 text-sm underline"
              >
                Copy
              </button>
            </p>
            <p><strong>Balance:</strong> ${wallet.amount}</p>
          </div>
        ))
      ) : (
        <div className="text-center">
          <p className="mb-2">No wallet found. Click below to create one.</p>
          <button
            onClick={handleCreateWallet}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Wallet
          </button>
        </div>
      )}

      {/* Deposit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Deposit Amount</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
