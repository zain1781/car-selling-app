import React, { useState, useEffect } from 'react';

export default function Docs() {
    const [docs, setDocs] = useState([]);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const api = import.meta.env.VITE_API_URL;
    const upload = import.meta.env.VITE_UPLOADS;

    const fetchDocs = async () => {
        try {
            const response = await fetch(`${api}docs`);
            if (!response.ok) throw new Error('Failed to fetch documents');
            const data = await response.json();
            setDocs(data);
        } catch (err) {
            setError('Error fetching documents');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setError('');
    };

    const handleUpload = async () => {
        if (!file || !name) {
            setError('Please provide both a file and name.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        setUploading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${api}docs/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            setMessage('File uploaded successfully!');
            setFile(null);
            setName('');
            await fetchDocs();
        } catch (err) {
            console.error(err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${api}docs/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete document');

            setMessage('Document deleted successfully!');
            await fetchDocs();
        } catch (err) {
            console.error(err);
            setError('Failed to delete document. Please try again.');
        }
    };

    const cleanFileName = (filePath) => {
        const parts = filePath.split('/');
        const fullName = parts[parts.length - 1];
        return fullName.replace(/^\d+[-_]?/, '');
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
            {/* Uploaded Documents List */}
            <div className="md:w-1/2 bg-white shadow-md p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
                {docs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {docs.map((doc, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 bg-gray-100 hover:shadow-md transition-shadow"
                            >
                                <p className="text-sm text-gray-500 mb-1">Document</p>
                                <a
                                    href={`${upload}${doc.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 font-medium hover:underline break-words"
                                >
                                    {doc.name}
                                    <br />
                                    {new Date(doc.createdAt).toLocaleString()}
                                </a>
                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No documents uploaded yet.</p>
                )}
            </div>

            {/* Upload Section */}
            <div className="md:w-1/2 bg-white shadow-md p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Upload a Document</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4 block w-full text-sm text-gray-700 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
                <input
                    type="text"
                    placeholder="Document Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="mb-4 block w-full text-sm text-gray-700 border border-gray-300 rounded-md px-4 py-2"
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full px-4 py-2 rounded-md text-white ${
                        uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>

                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </div>
    );
}
