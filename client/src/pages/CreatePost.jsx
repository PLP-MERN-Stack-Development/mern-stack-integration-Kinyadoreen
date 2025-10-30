import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreatePost(){
  const [title,setTitle]=useState(''); const [content,setContent]=useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const submit = async (e)=>{ e.preventDefault();
    const form = new FormData(); form.append('title', title); form.append('content', content); form.append('category', ''); form.append('author', user?.id);
    await api.post('/posts', form, { headers: { 'Content-Type':'multipart/form-data' } });
    navigate('/');
  };
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create Post</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded" required />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" className="w-full border p-2 rounded h-40" required />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Publish</button>
      </form>
    </div>
  );
}
