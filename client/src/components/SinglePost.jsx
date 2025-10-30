import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';

function SinglePost() {
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
      <Link
        to="/"
        className="text-blue-600 hover:underline mb-5 inline-block"
      >
        ← Back to Posts
      </Link>

      <h2 className="text-3xl font-bold mb-3">{post.title}</h2>
      <p className="text-gray-600 mb-5">
        By {post.author.name} in {post.category.name}
      </p>
      <img
        src={`/uploads/${post.featuredImage}`}
        alt={post.title}
        className="mb-5 w-full max-h-96 object-cover rounded"
      />
      <p className="mb-5">{post.content}</p>
      <p className="text-sm text-gray-500">
        Tags: {post.tags.join(', ')}
      </p>
    </div>
  );
}

export default SinglePost;
