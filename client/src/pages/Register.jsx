import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const { register } = useAuth(); const navigate = useNavigate();
  const submit = async (e)=>{ e.preventDefault(); try{ await register({ name, email, password }); navigate('/'); } catch(e){ alert('Register failed'); } };
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 className="text-2xl mb-4">Register</h2>
    <form onSubmit={submit} className="space-y-4">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
      <button className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
    </form>
  </div>);
}
