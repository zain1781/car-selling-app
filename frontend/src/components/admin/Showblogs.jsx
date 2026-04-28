import React, { useState, useEffect } from 'react';
import { handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';

export default function Showblogs() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: ''
    });
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${url}blogs`);
                const data = await response.json();
                setBlogs(data.blogs);
            } catch (error) {
                handleError("Failed to fetch blogs");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${url}blogs/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setBlogs(blogs.filter(blog => blog._id !== id));
            }
        } catch (error) {
            handleError("Failed to delete blog");
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog._id);
        setEditForm({
            title: blog.title,
            description: blog.description
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${url}blogs/${editingBlog}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const updatedBlog = await response.json();
                setBlogs(blogs.map(blog => 
                    blog._id === editingBlog ? updatedBlog.blog : blog
                ));
                setEditingBlog(null);
            }
        } catch (error) {
            handleError("Failed to update blog");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Manage Blogs</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map((blog) => (
                            <tr key={blog._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {blog.description.length > 100
                                            ? `${blog.description.substring(0, 100)}...`
                                            : blog.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="text-red-600 hover:text-red-900 mr-4"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {blogs.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No blogs found
                </div>
            )}
            {editingBlog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Title"
                        />
                        <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Description"
                            rows="4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingBlog(null)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
