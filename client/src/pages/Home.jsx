import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Home(){
  const [posts, setPosts] = useState([]);
  useEffect(()=>{ api.get('/posts').then(r=>setPosts(r.data.data)).catch(console.error); }, []);
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(p=>(
        <div key={p._id} className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{p.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{p.excerpt || p.content.slice(0,140)}</p>
          <div className="flex justify-between mt-3">
            <Link to={`/posts/${p._id}`} className="text-blue-500">Read</Link>
            <span className="text-xs text-gray-400">{p.category?.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
