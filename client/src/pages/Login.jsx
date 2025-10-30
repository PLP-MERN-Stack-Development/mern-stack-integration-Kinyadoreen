import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const { login } = useAuth(); const navigate = useNavigate();
  const submit = async (e)=>{ e.preventDefault(); try{ await login({ email, password }); navigate('/'); } catch(e){ alert('Login failed'); } };
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 className="text-2xl mb-4">Login</h2>
    <form onSubmit={submit} className="space-y-4">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </form>
  </div>);
}
