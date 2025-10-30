import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostDetails(){
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  useEffect(()=>{ api.get(`/posts/${id}`).then(r=>setPost(r.data.data)).catch(console.error); }, [id]);
  if(!post) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500">By {post.author?.name}</p>
      <div className="mt-4">{post.content}</div>
      {user && user.id === post.author?._id && <Link to={`/edit-post/${post._id}`} className="mt-4 inline-block bg-blue-500 text-white px-3 py-1 rounded">Edit</Link>}
    </div>
  );
}
