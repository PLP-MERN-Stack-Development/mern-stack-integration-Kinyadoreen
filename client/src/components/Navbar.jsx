import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar(){
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-semibold text-blue-300">MERN Blog</Link>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-blue-200">Home</Link>
        {user ? <>
          <Link to="/create-post" className="hover:text-blue-200">Create</Link>
          {user.role==='admin' && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
          <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
        </> : <>
          <Link to="/login" className="hover:text-blue-200">Login</Link>
          <Link to="/register" className="hover:text-blue-200">Register</Link>
        </>}
      </div>
    </nav>
  );
}
