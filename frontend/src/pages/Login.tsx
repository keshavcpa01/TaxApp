import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, new URLSearchParams({
        username,
        password
      }));

      localStorage.setItem('token', res.data.access_token);
      onLogin();
    } catch (err: any) {
      setError('Invalid credentials');
    }
  };

  // ✅ Make sure this return is present and not accidentally removed
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">🔐 Login</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Login</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
