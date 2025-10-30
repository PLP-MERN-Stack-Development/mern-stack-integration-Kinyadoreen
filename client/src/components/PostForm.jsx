import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

function PostForm() {
  const { slug } = useParams(); // for editing existing posts
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        if (!category && data.length > 0) setCategory(data[0]._id);
      } catch (err) {
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  // Fetch post data if editing
  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const post = await postService.getPost(slug);
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category._id);
        setTags(post.tags.join(', '));
      } catch (err) {
        setError('Failed to load post data.');
      }
    };
    fetchPost();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      content,
      category,
      tags: tags.split(',').map((t) => t.trim()),
    };

    try {
      if (slug) {
        await postService.updatePost(slug, postData);
      } else {
        await postService.createPost(postData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save post.');
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">
        {slug ? 'Edit Post' : 'Create New Post'}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {slug ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default PostForm;
