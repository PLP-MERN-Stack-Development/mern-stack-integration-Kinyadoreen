import React from 'react';
import { Link } from 'react-router-dom';
export default function Unauthorized(){ return (<div className="p-6 text-center"><h1 className="text-3xl text-red-500">Access Denied</h1><Link to="/" className="text-blue-500">Go Home</Link></div>); }
