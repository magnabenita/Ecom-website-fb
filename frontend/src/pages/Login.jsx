// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 rounded text-black" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 rounded text-black" />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
