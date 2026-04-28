import React, { useState } from 'react';
import { handleSuccess, handleError } from "../../../utils";
import { ToastContainer } from 'react-toastify';


export default function Cblogs() {
  const api = import.meta.env.VITE_API_URL;
  const [data, setdata] = useState({
   title: '',
   description: '',
   img: null,
  });



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setdata({ ...data, [name]: files[0] });
    } else {
      setdata({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("img", data.img);

    try {
      const res = await fetch(`${api}blogs/create`, {
        method: 'POST',
        body: formData,
      });
      setdata({
        title: '',
        description: '',
        img: null,
      })

      const responseData = await res.json();
      if (res.ok) {
        handleSuccess("Blog created successfully");
      } else {
        handleError(responseData.message);
      }
    } catch (error) {
     handleError("Error submitting form:", error);
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16 px-5">
      <div className="container mx-auto max-w-4xl bg-white shadow-xl rounded-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">Create New Blog Post</h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Create and publish your blog post by filling out the form below
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Blog Title</label>
            <input 
              type="text" 
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-700"
              placeholder="Enter a compelling title for your blog post"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Blog Content</label>
            <textarea 
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[200px] text-gray-700"
              placeholder="Write your blog content here..."
              name="description"
              value={data.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Blog Image</label>
            <input 
              type="file" 
              name="img"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-700"
              required
            />
          </div>

          <div className="text-center">
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center mx-auto space-x-2"
            >
              <span>Publish Blog Post</span>
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
