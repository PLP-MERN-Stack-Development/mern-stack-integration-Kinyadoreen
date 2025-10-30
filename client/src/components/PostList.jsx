import React, { useEffect, useState, useContext } from 'react';
import { postService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

function PostList() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts(page, 5, search);
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  const handleComment = async (postId, comment, resetInput) => {
    if (!comment) return;
    await postService.addComment(postId, { content: comment });
    fetchPosts(); // refresh posts
    resetInput();
  };

  if (loading) return <p className="p-10 text-center">Loading posts...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-5">All Posts</h2>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-5 border rounded"
      />

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} handleComment={handleComment} user={user} />)
      )}

      <div className="flex justify-between mt-5">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded">
          Previous
        </button>
        <button onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded">
          Next
        </button>
      </div>
    </div>
  );
}

function PostCard({ post, handleComment, user }) {
  const [commentText, setCommentText] = useState('');

  const resetInput = () => setCommentText('');

  return (
    <div className="border rounded-lg p-5 mb-5 shadow-sm">
      {post.featuredImage && (
        <img src={`http://localhost:5000/uploads/${post.featuredImage}`} alt={post.title} className="mb-3 w-full max-h-64 object-cover rounded" />
      )}
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <p className="text-gray-600 text-sm mb-2">
        By {post.author.name} in {post.category.name}
      </p>
      <p>{post.content}</p>
      <p className="text-sm text-gray-500 mt-2">Tags: {post.tags.join(', ')}</p>

      <div className="mt-3">
        <h4 className="font-semibold">Comments</h4>
        {post.comments.map((c, idx) => (
          <p key={idx} className="text-gray-700 text-sm border-b py-1">
            {c.content}
          </p>
        ))}

        {user && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border p-1 rounded"
            />
            <button onClick={() => handleComment(post._id, commentText, resetInput)} className="bg-blue-600 text-white px-3 rounded">
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostList;
