// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email,
        role: 'user'
      });
      alert('Signup successful!');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-sm">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 rounded text-black" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 rounded text-black" />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded">Sign Up</button>
        <p className="text-sm">Already have an account? <Link to="/login" className="underline text-purple-400">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
