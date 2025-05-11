import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, {
        username,
        password
      });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError('Registration failed. Try another username.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">🆕 Register</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">Register</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
