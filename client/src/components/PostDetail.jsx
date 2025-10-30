import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPost(slug);
        setPost(data);
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <p className="p-10 text-center">Loading post...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!post) return <p className="p-10 text-center">Post not found.</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">
        By {post.author.name} in {post.category.name}
      </p>
      <img
        src={`http://localhost:5000/uploads/${post.featuredImage}`}
        alt={post.title}
        className="w-full rounded mb-5"
      />
      <p className="mb-4">{post.content}</p>
      <p className="text-sm text-gray-500">
        Tags: {post.tags.join(', ')}
      </p>
    </div>
  );
}

export default PostDetail;
