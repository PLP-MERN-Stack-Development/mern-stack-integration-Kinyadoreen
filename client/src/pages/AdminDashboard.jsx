import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard(){
  const [users,setUsers]=useState([]); const [posts,setPosts]=useState([]);
  useEffect(()=>{ (async ()=>{ try{ const [u,p]=await Promise.all([api.get('/admin/users'), api.get('/posts')]); setUsers(u.data.data); setPosts(p.data.data); }catch(e){console.error(e);} })(); }, []);
  const deleteUser = async (id)=>{ if(confirm('Delete user?')){ await api.delete(`/admin/users/${id}`); setUsers(users.filter(u=>u._id!==id)); } };
  const deletePost = async (id)=>{ if(confirm('Delete post?')){ await api.delete(`/posts/${id}`); setPosts(posts.filter(p=>p._id!==id)); } };
  return (<div className="p-6">
    <h1 className="text-2xl mb-4">Admin</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Users</h3>
        <ul>{users.map(u=><li key={u._id} className="flex justify-between"><span>{u.name} ({u.email})</span><button onClick={()=>deleteUser(u._id)} className="text-red-500">Delete</button></li>)}</ul>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Posts</h3>
        <ul>{posts.map(p=><li key={p._id} className="flex justify-between"><span>{p.title}</span><button onClick={()=>deletePost(p._id)} className="text-red-500">Delete</button></li>)}</ul>
      </div>
    </div>
  </div>);
}
