import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditPost(){
  const { id } = useParams();
  const [title,setTitle]=useState(''); const [content,setContent]=useState('');
  const navigate = useNavigate();
  useEffect(()=>{ api.get(`/posts/${id}`).then(r=>{ const p=r.data.data; setTitle(p.title); setContent(p.content); }).catch(console.error); }, [id]);
  const submit = async (e)=>{ e.preventDefault(); await api.put(`/posts/${id}`, { title, content }); navigate(`/posts/${id}`); };
  return (<div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
    <h2 className="text-2xl mb-4">Edit Post</h2>
    <form onSubmit={submit} className="space-y-4">
      <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2 rounded" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} className="w-full border p-2 rounded h-40" />
      <button className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
    </form>
  </div>);
}
