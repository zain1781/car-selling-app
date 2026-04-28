import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
const Blogs = () => {
  const api = import.meta.env.VITE_API_URL;
  const upload = import.meta.env.VITE_UPLOADS;
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${api}blogs`);
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [api]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-pulse">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Car Auction Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id || blog._id}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300"
            >
                   {blog.img && (
                <img
                  src={`${upload}${blog.img}`}
                  alt={blog.title}
                  className="w-full h-auto mb-4 rounded-lg"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 mb-4">
                {blog.description?.substring(0, 150)}
                {blog.description?.length > 150 ? '...' : ''}
              </p>
         
              <NavLink
                to={`/blog/${blog._id}`}
                className="text-blue-600 hover:underline font-medium inline-flex items-center"
              >
                Read More <span className="ml-1">→</span>
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
