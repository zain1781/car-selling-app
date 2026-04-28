import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Blog() {
  const api = import.meta.env.VITE_API_URL;
  const upload =import.meta.env.VITE_UPLOADS;
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${api}blogs/${id}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.status}`);
        }
        
        const data = await response.json();
        setBlog(data.blog);
        console.log(data.blog);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();

    return () => controller.abort();
  }, [api, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
          <span className="text-3xl mb-4 block">⚠️</span>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 p-6 rounded-lg text-center max-w-md">
          <span className="text-3xl mb-4 block">🔍</span>
          <p className="text-gray-600">Blog post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <header className="mb-8 pb-6 border-b border-gray-100">
          <img src={`${upload}${blog.img}`}alt="img" height={200} width={200}/>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {blog.title}
          </h1>
          <div className="space-y-2">
            <time className="text-sm text-gray-500 block">
              Created: {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {blog.updatedAt !== blog.createdAt && (
              <time className="text-sm text-gray-400 block italic">
                Updated: {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
        </header>

        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed mb-6">
            {blog.description}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
           
            <div className="text-gray-400">
              v{blog.__v}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}