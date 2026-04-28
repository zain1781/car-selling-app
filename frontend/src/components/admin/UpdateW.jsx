import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const api = import.meta.env.VITE_API_URL;

const Updatew = () => {
    const { id } = useParams();
    const [wire, setWire] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`${api}wire/${id}`)
            .then(res => res.json())
            .then(data => setWire(data))
            .catch(err => setError('Error fetching data'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWire(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        setIsUpdating(true);

        // Remove image before sending
        const { image, _id, __v, createdAt, updatedAt, ...updatedWire } = wire;

        fetch(`${api}wire/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedWire),
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update');
                return res.json();
            })
            .then(data => {
                setMessage(`✅ Wire updated successfully for: ${data.wires.accountName}`);
                setWire(data.wires);
            })
            .catch(err => {
                console.error(err);
                setMessage('❌ Update failed.');
            })
            .finally(() => setIsUpdating(false));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Update Wire Details</h1>

            <table className="table-auto w-full border-collapse border border-gray-300 mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Field</th>
                        <th className="border px-4 py-2 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(wire)
                        .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt', 'image','accountNumber','routingNumber'].includes(key))
                        .map(([key, value]) => (
                            <tr key={key}>
                                <td className="border px-4 py-2 font-medium capitalize">{key}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="text"
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 px-3 py-1 rounded"
                                    />
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                {isUpdating ? 'Updating...' : 'Update'}
            </button>

            {message && (
                <div className="mt-4 text-green-600 font-medium">
                    {message}
                </div>
            )}
        </div>
    );
};

export default Updatew;
