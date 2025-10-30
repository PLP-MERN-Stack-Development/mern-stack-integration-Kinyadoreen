import React, { useState, useContext } from 'react';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NewPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    featuredImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'featuredImage') {
      setForm({ ...form, featuredImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('category', form.category);
    formData.append('tags', form.tags.split(',').map((t) => t.trim()));
    formData.append('author', user._id);
    if (form.featuredImage) formData.append('featuredImage', form.featuredImage);

    try {
      await postService.createPost(formData);
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 border rounded shadow mt-5">
      <h2 className="text-2xl font-bold mb-5">New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full border p-2 rounded" />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="file" name="featuredImage" onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create Post</button>
      </form>
    </div>
  );
}
