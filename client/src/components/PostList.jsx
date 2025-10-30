import React, { useEffect, useState } from 'react';
import { postService } from '../services/api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts. Please check your backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading posts...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border rounded-lg p-5 mb-5 shadow-sm">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              By {post.author?.name || 'Unknown'} in {post.category?.name || 'Uncategorized'}
            </p>
            <p>{post.content}</p>
            {post.tags && post.tags.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Tags: {post.tags.join(', ')}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;
